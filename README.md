# solutioncorp-store

Web toko PT Solution Corp Indonesia (sterno gel & kaleng). Next.js full-stack, halaman toko dan admin.

Stack: Next.js 16, TypeScript, MUI, Prisma 7, MySQL, Vitest.

## Setup

```bash
npm install
cp .env.example .env   # isi user/password database dan SESSION_SECRET
npx prisma migrate dev
npx prisma generate
npm run admin:create
npm run dev
```

Database dan user MySQL dibuat lewat `sudo mysql` (database utama + `_shadow`).

##  CMD

```bash
npm run dev            # development
npm test               # unit test
npx tsc --noEmit       # cek error TypeScript
npm run build          # build production
npx prisma studio      # lihat isi database
```

Ubah database: edit `prisma/schema.prisma`, lalu `npx prisma migrate dev --name xxx` dan `npx prisma generate`. Di server pakai `npx prisma migrate deploy`.

