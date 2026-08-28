# JualBeliOnline - Marketplace C2C Indonesia

Platform marketplace Customer-to-Customer (C2C) modern yang menghubungkan penjual dan pembeli di Indonesia. Dibangun dengan teknologi terbaru untuk performa maksimal dan pengalaman pengguna yang optimal.

## Fitur Utama

### Untuk Pembeli
- Browse dan cari produk dengan mudah
- Filter berdasarkan kategori, harga, kondisi
- Lihat detail produk lengkap dengan gambar
- Review dan rating produk
- Chat langsung dengan penjual
- Sistem transaksi yang aman

### Untuk Penjual
- Dashboard penjual yang lengkap
- Upload produk dengan mudah (multiple images)
- Kelola inventori dan stok
- Track views dan statistik produk
- Komunikasi langsung dengan pembeli

## Tech Stack

### Frontend & Backend
- **Next.js 15** - React framework dengan App Router untuk performance optimal
- **React 19** - Latest React with Server Components
- **TypeScript** - Type safety dan better DX
- **Tailwind CSS** - Utility-first CSS framework yang ringan

### Database & ORM
- **PostgreSQL** - Reliable dan scalable database
- **Prisma** - Modern database ORM dengan TypeScript support

### Authentication
- **NextAuth.js** - Authentication untuk Next.js apps
- **bcryptjs** - Password hashing yang aman

### State Management & Validation
- **Zustand** - Lightweight state management
- **Zod** - Schema validation

## Struktur Project

```
JualBeliOnline/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (main)/              # Main app pages with Navbar
│   │   ├── page.tsx         # Home page
│   │   ├── products/
│   │   │   ├── [slug]/      # Product detail
│   │   │   └── new/         # Create product
│   │   └── dashboard/       # Seller dashboard
│   ├── api/                 # API Routes
│   │   ├── auth/
│   │   ├── products/
│   │   ├── categories/
│   │   └── register/
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── Navbar.tsx
│   └── ProductCard.tsx
├── lib/                     # Utility functions
│   ├── prisma.ts            # Prisma client
│   ├── auth.ts              # Auth config
│   └── utils.ts             # Helper functions
├── prisma/
│   └── schema.prisma        # Database schema
└── types/                   # TypeScript types
```

## Database Schema

### Models
- **User** - Data pengguna (pembeli & penjual)
- **Category** - Kategori produk
- **Product** - Data produk yang dijual
- **Transaction** - Transaksi pembelian
- **Message** - Chat antara pembeli & penjual
- **Review** - Review dan rating produk

## Setup & Installation

### Prerequisites
- Node.js 18+ dan npm/yarn/pnpm
- PostgreSQL database
- Git

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/JualBeliOnline.git
cd JualBeliOnline
```

### 2. Install Dependencies

```bash
npm install
# atau
yarn install
# atau
pnpm install
```

### 3. Setup Environment Variables

Copy file `.env.example` ke `.env` dan isi dengan data Anda:

```bash
cp .env.example .env
```

Edit file `.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/jualbelionline?schema=public"

# NextAuth
NEXTAUTH_SECRET="generate-dengan-command: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# Upload (Optional)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

### 4. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database (optional)
npx prisma db seed
```

### 5. Run Development Server

```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Database Management

### Prisma Studio
Untuk melihat dan mengedit data database secara visual:

```bash
npx prisma studio
```

### Migrations
Setelah mengubah schema:

```bash
npx prisma migrate dev --name describe_your_changes
```

## Build untuk Production

```bash
# Build aplikasi
npm run build

# Run production server
npm start
```

## Deployment

### Vercel (Recommended)
1. Push code ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Setup environment variables
4. Deploy!

### Railway / Render
1. Setup PostgreSQL database
2. Deploy Next.js app
3. Configure environment variables
4. Run migrations

## Optimasi Performance

### Fitur Optimasi yang Sudah Diterapkan:
- Server Components untuk faster initial load
- Image optimization dengan Next.js Image
- Lazy loading untuk images
- Database query optimization dengan Prisma
- Tailwind CSS untuk minimal CSS bundle
- Code splitting otomatis oleh Next.js

### Best Practices:
- Gunakan Server Components sebanyak mungkin
- Implement caching untuk data yang jarang berubah
- Optimize images sebelum upload
- Use CDN untuk static assets

## API Routes

### Authentication
- `POST /api/register` - Register user baru
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout

### Products
- `GET /api/products` - Get semua produk (dengan filter)
- `POST /api/products` - Create produk baru (auth required)
- `GET /api/products/[id]` - Get detail produk
- `PATCH /api/products/[id]` - Update produk (auth required)
- `DELETE /api/products/[id]` - Delete produk (auth required)

### Categories
- `GET /api/categories` - Get semua kategori

## Security

- Password di-hash dengan bcryptjs
- Protected API routes dengan NextAuth
- SQL injection protection dengan Prisma
- CSRF protection built-in Next.js
- Environment variables untuk sensitive data

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your needs.

## Support

Untuk pertanyaan dan support, silakan buat issue di GitHub repository.

---

Dibuat dengan oleh rizki menggunakan Next.js 15
