# solutioncorp-store

Web toko PT Solution Corp Indonesia. Next.js full-stack, halaman toko dan admin.

Stack: Next.js 16, TypeScript, MUI, Prisma 7, MySQL, Vitest.

## Setup

```bash
npm install
cp .env.example .env  
npx prisma generate
npm run admin:create
npm run dev
```

Database dan user MySQL dibuat lewat `sudo mysql` (database utama + `_shadow`).

##  CMD

```bash
npm run dev           
npm test               
npx tsc --noEmit       
npm run build          
npx prisma studio      
```.

