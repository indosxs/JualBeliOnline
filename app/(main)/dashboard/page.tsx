import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'

async function getUserProducts(userId: string) {
  return await prisma.product.findMany({
    where: { sellerId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      _count: {
        select: {
          transactions: true,
          reviews: true,
        }
      }
    }
  })
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const products = await getUserProducts(session.user.id)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Penjual</h1>
          <Link href="/products/new">
            <Button>Tambah Produk Baru</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody>
              <p className="text-sm text-gray-600">Total Produk</p>
              <p className="text-3xl font-bold text-gray-900">{products.length}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-sm text-gray-600">Produk Aktif</p>
              <p className="text-3xl font-bold text-green-600">
                {products.filter(p => p.status === 'active').length}
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-sm text-gray-600">Terjual</p>
              <p className="text-3xl font-bold text-primary-600">
                {products.filter(p => p.status === 'sold').length}
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-sm text-gray-600">Total Ulasan</p>
              <p className="text-3xl font-bold text-gray-900">
                {products.reduce((acc, p) => acc + p._count.reviews, 0)}
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Products Table */}
        <Card>
          <CardBody>
            <h2 className="text-xl font-bold mb-4">Produk Saya</h2>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Anda belum memiliki produk</p>
                <Link href="/products/new">
                  <Button>Tambah Produk Pertama</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Produk</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Harga</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Stok</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Dilihat</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <Link href={`/products/${product.slug}`} className="font-medium text-gray-900 hover:text-primary-600">
                            {product.title}
                          </Link>
                        </td>
                        <td className="py-3 px-4">{formatPrice(product.price.toString())}</td>
                        <td className="py-3 px-4">{product.stock}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            product.status === 'active' ? 'bg-green-100 text-green-800' :
                            product.status === 'sold' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {product.status === 'active' ? 'Aktif' :
                             product.status === 'sold' ? 'Terjual' :
                             'Nonaktif'}
                          </span>
                        </td>
                        <td className="py-3 px-4">{product.views}</td>
                        <td className="py-3 px-4 text-right">
                          <Link href={`/products/${product.slug}/edit`}>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
