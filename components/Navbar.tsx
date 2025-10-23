'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/Button'

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">JB</span>
            </div>
            <span className="text-xl font-bold text-gray-900">JualBeliOnline</span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <input
              type="search"
              placeholder="Cari produk..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Nav Items */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/products/new">
                  <Button size="sm">
                    Jual Produk
                  </Button>
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {session.user.name?.[0] || 'U'}
                      </span>
                    </div>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 hidden group-hover:block">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profil
                    </Link>
                    <Link href="/transactions" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Transaksi
                    </Link>
                    <Link href="/messages" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Pesan
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Masuk
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Daftar
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <input
          type="search"
          placeholder="Cari produk..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
    </nav>
  )
}
