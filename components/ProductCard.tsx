import Link from 'next/link'
import Image from 'next/image'
import { Card } from './ui/Card'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: {
    id: string
    slug: string
    title: string
    price: number | string
    images: string[]
    location: string
    condition: string
    seller: {
      name: string
      city?: string | null
    }
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`}>
      <Card hover className="overflow-hidden group cursor-pointer">
        {/* Image */}
        <div className="relative w-full aspect-square bg-gray-100">
          <Image
            src={product.images[0] || '/placeholder.png'}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.condition === 'new' && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
              Baru
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-1 min-h-[2.5rem]">
            {product.title}
          </h3>
          <p className="text-lg font-bold text-gray-900 mb-2">
            {formatPrice(product.price)}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="truncate">{product.seller.city || product.location}</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
