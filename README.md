# Medusa Store

A headless store built with a **Medusa v2** backend (PostgreSQL) and a **Next.js** (TypeScript) storefront that lists products from the Medusa Store API.

```
.
├── backend/      Medusa v2 server + Admin dashboard (port 9000)
└── storefront/   Next.js product list & product detail pages (port 3000)
```

## Features

- Product list page with name, price and image in a responsive grid
- Product detail page (`/products/[handle]`) with images, description and options
- Loading skeletons while data is fetched, plus error and not-found states
- All data comes from the Medusa Store API, nothing is hard-coded

## Prerequisites

- Node.js 20 or newer (tested with Node 24)
- PostgreSQL 14 or newer running locally. pgAdmin is optional and can be used to browse the database.

## 1. Create the database

```bash
createdb -U postgres medusa
# or in pgAdmin: Databases → Create → Database… → name it "medusa"
```

## 2. Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

- `DATABASE_URL`: your Postgres connection string, for example `postgres://postgres:<password>@localhost:5432/medusa`
- `JWT_SECRET` / `COOKIE_SECRET`: any random strings (for example `openssl rand -hex 32`)

Then install, migrate and seed:

```bash
npm install
npx medusa db:migrate        # creates the database tables
npm run seed                 # region (EUR), publishable key and sample products
npx medusa user -e admin@example.com -p supersecret   # admin login
npm run dev                  # starts http://localhost:9000
```

Open the Admin at **http://localhost:9000/app** and log in with the user you created. The seeded products appear under **Products**.

## 3. Storefront

The storefront needs the **publishable API key** that the seed created. You can copy it from Admin → **Settings → Publishable API Keys**, or print it with:

```bash
psql -U postgres -d medusa -c "select token from api_key where type = 'publishable';"
```

```bash
cd storefront
cp .env.example .env.local   # then paste the key into NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
npm install
npm run dev                  # starts http://localhost:3000
```

Start the backend before you open the storefront.

## Environment variables

| File | Key | Description |
| --- | --- | --- |
| `backend/.env` | `DATABASE_URL` | PostgreSQL connection string |
| | `STORE_CORS` / `ADMIN_CORS` / `AUTH_CORS` | Allowed origins (storefront is `http://localhost:3000`) |
| | `JWT_SECRET` / `COOKIE_SECRET` | Secrets used for auth tokens and cookies |
| | `REDIS_URL` | Optional. Medusa uses in-memory modules when it is not set |
| `storefront/.env.local` | `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | Medusa URL, default `http://localhost:9000` |
| | `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | Publishable API key (required by the Store API) |
| | `NEXT_PUBLIC_MEDUSA_REGION_ID` | Optional. Region used for prices; defaults to the first region |

## How the storefront fetches data

`storefront/src/lib/medusa.ts` calls the Store API with the `x-publishable-api-key` header:

1. `GET /store/regions` picks the region, which sets the currency used for prices
2. `GET /store/products?region_id=…&fields=*variants.calculated_price` returns the products with their calculated prices

The pages are React Server Components. `loading.tsx` shows a skeleton while the request is in flight, and `error.tsx` shows a retry button if the backend can't be reached.
