import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/ProductCard'
import Link from 'next/link'

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
      take: 20,
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
        }
      }
    })
    return products
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return []
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      take: 10,
    })
    return categories
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Jual Beli Online Mudah & Aman
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Platform C2C terpercaya untuk membeli dan menjual produk di Indonesia
            </p>
            <Link
              href="/products/new"
              className="inline-block bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Mulai Jual Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Kategori</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-primary-500 hover:text-primary-600 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Produk Terbaru</h2>
          <Link href="/products" className="text-primary-600 hover:text-primary-700 font-medium">
            Lihat Semua
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Belum ada produk tersedia</p>
            <Link href="/products/new" className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-medium">
              Jadilah yang pertama menjual
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  price: product.price.toString(),
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="bg-white py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Mengapa Memilih JualBeliOnline?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Aman & Terpercaya</h3>
              <p className="text-gray-600">Transaksi dijamin aman dengan sistem verifikasi pengguna</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Cepat & Mudah</h3>
              <p className="text-gray-600">Jual dan beli produk hanya dalam beberapa klik</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Chat Langsung</h3>
              <p className="text-gray-600">Komunikasi langsung dengan penjual atau pembeli</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
