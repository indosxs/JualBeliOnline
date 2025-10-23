import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'elektronik' },
      update: {},
      create: {
        name: 'Elektronik',
        slug: 'elektronik',
        icon: '📱',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'fashion' },
      update: {},
      create: {
        name: 'Fashion',
        slug: 'fashion',
        icon: '👕',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'rumah-tangga' },
      update: {},
      create: {
        name: 'Rumah Tangga',
        slug: 'rumah-tangga',
        icon: '🏠',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'olahraga' },
      update: {},
      create: {
        name: 'Olahraga',
        slug: 'olahraga',
        icon: '⚽',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'buku' },
      update: {},
      create: {
        name: 'Buku & Alat Tulis',
        slug: 'buku',
        icon: '📚',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'otomotif' },
      update: {},
      create: {
        name: 'Otomotif',
        slug: 'otomotif',
        icon: '🚗',
      },
    }),
  ])

  console.log(`Created ${categories.length} categories`)

  // Create demo users
  const hashedPassword = await bcrypt.hash('password123', 10)

  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      phone: '081234567890',
      city: 'Jakarta Selatan',
      address: 'Jl. Sudirman No. 123',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedPassword,
      phone: '081234567891',
      city: 'Bandung',
      address: 'Jl. Braga No. 45',
    },
  })

  console.log('Created demo users')

  // Create demo products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        title: 'iPhone 13 Pro Max 256GB',
        slug: 'iphone-13-pro-max-256gb',
        description: 'iPhone 13 Pro Max dalam kondisi sangat baik, fullset dengan box dan accessories lengkap. Garansi resmi iBox masih aktif.',
        price: 15000000,
        images: [
          'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800',
          'https://images.unsplash.com/photo-1632633728024-e1fd4bef561a?w=800',
        ],
        condition: 'used',
        stock: 1,
        location: 'Jakarta Selatan',
        categoryId: categories[0].id,
        sellerId: user1.id,
      },
    }),
    prisma.product.create({
      data: {
        title: 'MacBook Pro M2 14 inch',
        slug: 'macbook-pro-m2-14-inch',
        description: 'MacBook Pro M2 14 inch, RAM 16GB, SSD 512GB. Kondisi mint, baru 3 bulan pakai. Lengkap dengan charger original.',
        price: 25000000,
        images: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        ],
        condition: 'used',
        stock: 1,
        location: 'Jakarta Pusat',
        categoryId: categories[0].id,
        sellerId: user2.id,
      },
    }),
    prisma.product.create({
      data: {
        title: 'Sepatu Nike Air Max 270',
        slug: 'sepatu-nike-air-max-270',
        description: 'Sepatu Nike Air Max 270 original, size 42, warna hitam putih. Baru dipakai 2x, kondisi seperti baru.',
        price: 1200000,
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
        ],
        condition: 'used',
        stock: 1,
        location: 'Bandung',
        categoryId: categories[1].id,
        sellerId: user2.id,
      },
    }),
    prisma.product.create({
      data: {
        title: 'Kamera Sony A7 III Body Only',
        slug: 'kamera-sony-a7-iii-body-only',
        description: 'Kamera Sony A7 III body only, shutter count rendah (5000). Kondisi sangat terawat, no scratch, no jamur.',
        price: 18500000,
        images: [
          'https://images.unsplash.com/photo-1606980623314-ccb11b33f02f?w=800',
        ],
        condition: 'used',
        stock: 1,
        location: 'Jakarta Selatan',
        categoryId: categories[0].id,
        sellerId: user1.id,
      },
    }),
  ])

  console.log(`Created ${products.length} demo products`)

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
