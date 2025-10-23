# Panduan Menjalankan JualBeliOnline di Local

## Prerequisites

Yang harus diinstall terlebih dahulu:

1. **Node.js** versi 18 atau lebih baru
   - Download di: https://nodejs.org/
   - Cek versi: `node --version`

2. **PostgreSQL** (Database)
   - **Windows**: Download di https://www.postgresql.org/download/windows/
   - **Mac**: `brew install postgresql`
   - **Linux**: `sudo apt-get install postgresql`

   Atau gunakan alternatif yang lebih mudah:
   - **Docker**: `docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`
   - **Online Database Gratis**:
     - Neon.tech (https://neon.tech)
     - Supabase (https://supabase.com)
     - Railway.app (https://railway.app)

3. **Git** (sudah terinstall biasanya)

## Langkah-langkah Menjalankan di Local

### 1. Clone atau Navigate ke Project

```bash
cd /home/user/JualBeliOnline
```

### 2. Install Dependencies (sudah dilakukan)

```bash
npm install
```

### 3. Setup Database

#### Opsi A: Menggunakan PostgreSQL Local

1. Buat database baru:
```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE jualbelionline;

# Keluar
\q
```

2. Copy dan edit .env:
```bash
cp .env.example .env
```

3. Edit file `.env` dengan text editor:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/jualbelionline?schema=public"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Cara generate NEXTAUTH_SECRET:**
```bash
# Di terminal
openssl rand -base64 32
# atau
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### Opsi B: Menggunakan Database Online (Lebih Mudah!)

1. Daftar di Neon.tech atau Supabase (gratis)
2. Buat database baru
3. Copy connection string yang diberikan
4. Paste ke `.env`:
```env
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
NEXTAUTH_SECRET="hasil-dari-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Setup Prisma & Database

```bash
# Generate Prisma Client
# Jika error 403, skip dulu (akan di-generate saat npm run dev)

# Run migrations (buat tabel-tabel di database)
npx prisma migrate dev --name init

# Seed database dengan data dummy (opsional)
npm run db:seed
```

**Jika Prisma generate error 403**, tidak masalah! Akan otomatis di-generate saat menjalankan `npm run dev`.

### 5. Jalankan Development Server

```bash
npm run dev
```

Tunggu beberapa detik, lalu buka browser:
- **URL**: http://localhost:3000

### 6. Login dengan Akun Demo (jika sudah seed database)

Jika sudah menjalankan seeding, login dengan:
- **Email**: john@example.com
- **Password**: password123

Atau:
- **Email**: jane@example.com
- **Password**: password123

### 7. Atau Daftar Akun Baru

Klik "Daftar" di halaman utama dan buat akun baru.

## Troubleshooting

### Error: Connection refused (database)
```bash
# Pastikan PostgreSQL running
# Windows: Cek di Services
# Mac/Linux:
sudo service postgresql status
sudo service postgresql start
```

### Error: Prisma generate failed
Jalankan dengan ignore checksum:
```bash
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
```

Atau langsung run `npm run dev` - akan auto-generate.

### Error: Port 3000 already in use
```bash
# Gunakan port lain
PORT=3001 npm run dev
# Buka: http://localhost:3001
```

### Error: Database migration failed
```bash
# Reset database (HATI-HATI: menghapus semua data)
npx prisma migrate reset

# Lalu seed lagi
npm run db:seed
```

## Tools Tambahan

### Prisma Studio (Database GUI)
Untuk melihat dan edit data di database:
```bash
npx prisma studio
```
Buka: http://localhost:5555

## Versi Sederhana (Tanpa Database Setup Manual)

Jika ingin lebih mudah, gunakan database online:

1. **Neon.tech** (Paling Mudah):
   - Daftar di https://neon.tech (gratis)
   - Klik "Create Project"
   - Copy connection string
   - Paste ke .env
   - Jalankan migrate & seed
   - Done!

2. **Supabase**:
   - Daftar di https://supabase.com (gratis)
   - Buat project baru
   - Di Settings > Database, copy "Connection String" (URI mode)
   - Ganti [YOUR-PASSWORD] dengan password project
   - Paste ke .env

## Summary Perintah Cepat

```bash
# 1. Setup env
cp .env.example .env
# Edit .env dengan database URL

# 2. Setup database
npx prisma migrate dev --name init
npm run db:seed

# 3. Run!
npm run dev
```

Buka: http://localhost:3000

## Fitur yang Bisa Dicoba

✅ Register akun baru
✅ Login
✅ Browse produk di homepage
✅ Lihat detail produk
✅ Upload produk baru (setelah login)
✅ Dashboard penjual
✅ Edit profil
✅ Filter produk berdasarkan kategori

## Port yang Digunakan

- **3000**: Next.js app (bisa diubah dengan PORT=3001)
- **5432**: PostgreSQL (default)
- **5555**: Prisma Studio (jika dijalankan)

Selamat mencoba! 🚀
