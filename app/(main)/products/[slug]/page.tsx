import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice, formatRelativeTime } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'

async function getProduct(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
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
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        _count: {
          select: {
            reviews: true,
          }
        }
      }
    })

    if (product) {
      // Increment views
      await prisma.product.update({
        where: { id: product.id },
        data: { views: { increment: 1 } }
      })
    }

    return product
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return null
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary-600">Produk</Link>
          <span>/</span>
          <span className="text-gray-900">{product.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Images */}
          <div className="lg:col-span-2">
            <Card>
              <CardBody>
                <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={product.images[0] || '/placeholder.png'}
                    alt={product.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.slice(1, 5).map((image, index) => (
                      <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`${product.title} ${index + 2}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Description */}
            <Card className="mt-6">
              <CardBody>
                <h2 className="text-xl font-bold mb-4">Deskripsi Produk</h2>
                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
              </CardBody>
            </Card>

            {/* Reviews */}
            {product.reviews.length > 0 && (
              <Card className="mt-6">
                <CardBody>
                  <h2 className="text-xl font-bold mb-4">
                    Ulasan ({product._count.reviews})
                  </h2>
                  <div className="space-y-4">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium">
                              {review.user.name[0]}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{review.user.name}</h4>
                              <span className="text-sm text-gray-500">
                                {formatRelativeTime(review.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center my-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            {review.comment && (
                              <p className="text-gray-700 text-sm">{review.comment}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>

          {/* Right: Product Info & Seller */}
          <div className="lg:col-span-1">
            {/* Product Info */}
            <Card>
              <CardBody>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
                <div className="flex items-center space-x-2 mb-4">
                  {averageRating > 0 && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-sm text-gray-600">
                        {averageRating.toFixed(1)} ({product._count.reviews})
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-gray-500">• {product.views} dilihat</span>
                </div>

                <div className="text-3xl font-bold text-primary-600 mb-6">
                  {formatPrice(product.price.toString())}
                </div>

                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kondisi:</span>
                    <span className="font-medium">
                      {product.condition === 'new' ? 'Baru' : 'Bekas'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stok:</span>
                    <span className="font-medium">{product.stock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kategori:</span>
                    <Link
                      href={`/products?category=${product.category.slug}`}
                      className="font-medium text-primary-600 hover:text-primary-700"
                    >
                      {product.category.name}
                    </Link>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lokasi:</span>
                    <span className="font-medium">{product.location}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full">Beli Sekarang</Button>
                  <Button variant="outline" className="w-full">Chat Penjual</Button>
                </div>
              </CardBody>
            </Card>

            {/* Seller Info */}
            <Card className="mt-6">
              <CardBody>
                <h3 className="font-semibold mb-4">Informasi Penjual</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium">
                      {product.seller.name[0]}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium">{product.seller.name}</h4>
                    <p className="text-sm text-gray-600">{product.seller.city || 'Indonesia'}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Bergabung {formatRelativeTime(product.seller.createdAt)}
                </p>
                <Link href={`/seller/${product.seller.id}`}>
                  <Button variant="outline" className="w-full" size="sm">
                    Lihat Toko
                  </Button>
                </Link>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
