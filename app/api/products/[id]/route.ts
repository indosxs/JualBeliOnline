import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Get product by ID or slug
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: params.id },
          { slug: params.id }
        ]
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true,
            city: true,
            createdAt: true,
          }
        },
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produk tidak ditemukan' },
        { status: 404 }
      )
    }

    // Increment views
    await prisma.product.update({
      where: { id: product.id },
      data: { views: { increment: 1 } }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

// PATCH - Update product
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produk tidak ditemukan' },
        { status: 404 }
      )
    }

    if (product.sellerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: body,
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

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

// DELETE - Delete product
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produk tidak ditemukan' },
        { status: 404 }
      )
    }

    if (product.sellerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    await prisma.product.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Produk berhasil dihapus' })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
