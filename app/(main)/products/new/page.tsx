'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface Category {
  id: string
  name: string
  slug: string
}

export default function NewProductPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    categoryId: '',
    images: [''],
    condition: 'new',
    stock: '1',
    location: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Failed to fetch categories:', err))
  }, [])

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData({ ...formData, images: newImages })
  }

  const addImageField = () => {
    if (formData.images.length < 5) {
      setFormData({ ...formData, images: [...formData.images, ''] })
    }
  }

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index)
      setFormData({ ...formData, images: newImages })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const filteredImages = formData.images.filter(img => img.trim() !== '')

      if (filteredImages.length === 0) {
        setError('Minimal 1 gambar harus diisi')
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          images: filteredImages,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Gagal menambahkan produk')
      } else {
        router.push(`/products/${data.slug}`)
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Tambah Produk Baru</h1>

        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Judul Produk"
                placeholder="Contoh: iPhone 13 Pro Max 256GB"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  rows={5}
                  placeholder="Jelaskan detail produk, kondisi, dll."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Harga (Rp)"
                  type="number"
                  placeholder="50000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kondisi
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    required
                  >
                    <option value="new">Baru</option>
                    <option value="used">Bekas</option>
                  </select>
                </div>

                <Input
                  label="Stok"
                  type="number"
                  min="1"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>

              <Input
                label="Lokasi"
                placeholder="Contoh: Jakarta Selatan"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Gambar (maksimal 5)
                </label>
                {formData.images.map((image, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      required={index === 0}
                    />
                    {formData.images.length > 1 && (
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeImageField(index)}
                      >
                        Hapus
                      </Button>
                    )}
                  </div>
                ))}
                {formData.images.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addImageField}
                  >
                    Tambah Gambar
                  </Button>
                )}
              </div>

              <div className="flex gap-4">
                <Button type="submit" isLoading={isLoading} className="flex-1">
                  Publish Produk
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Batal
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
