import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { generateSlug } from '@/lib/utils'

const productSchema = z.object({
  title: z.string().min(5, 'Judul minimal 5 karakter'),
  description: z.string().min(20, 'Deskripsi minimal 20 karakter'),
  price: z.number().positive('Harga harus lebih dari 0'),
  categoryId: z.string(),
  images: z.array(z.string()).min(1, 'Minimal 1 gambar'),
  condition: z.enum(['new', 'used']),
  stock: z.number().int().positive().default(1),
  location: z.string().min(3, 'Lokasi harus diisi'),
})

// GET - Fetch products with filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const condition = searchParams.get('condition') || ''
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sort = searchParams.get('sort') || 'latest'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: any = {
      status: 'active',
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (category) {
      where.category = { slug: category }
    }

    if (condition) {
      where.condition = condition
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'price-asc') orderBy = { price: 'asc' }
    if (sort === 'price-desc') orderBy = { price: 'desc' }
    if (sort === 'popular') orderBy = { views: 'desc' }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              avatar: true,
              city: true,
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            }
          },
          _count: {
            select: {
              reviews: true,
            }
          }
        }
      }),
      prisma.product.count({ where })
    ])

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    })
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

// POST - Create new product
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = productSchema.parse(body)

    // Generate unique slug
    let slug = generateSlug(validatedData.title)
    let slugExists = await prisma.product.findUnique({ where: { slug } })
    let counter = 1
    while (slugExists) {
      slug = `${generateSlug(validatedData.title)}-${counter}`
      slugExists = await prisma.product.findUnique({ where: { slug } })
      counter++
    }

    const product = await prisma.product.create({
      data: {
        ...validatedData,
        slug,
        sellerId: session.user.id,
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true,
            city: true,
          }
        },
        category: true,
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
