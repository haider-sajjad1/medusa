const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000";
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "";
const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID;

export type Region = {
  id: string;
  name: string;
  currency_code: string;
};

export type CalculatedPrice = {
  calculated_amount: number | null;
  original_amount: number | null;
  currency_code: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  calculated_price?: CalculatedPrice | null;
};

export type ProductOption = {
  id: string;
  title: string;
  values: { id: string; value: string }[];
};

export type Product = {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  thumbnail: string | null;
  images?: { id: string; url: string }[];
  options?: ProductOption[];
  variants: ProductVariant[];
};

/** Calls the Medusa Store API. Every store request needs the publishable key. */
async function storeFetch<T>(path: string): Promise<T> {
  if (!PUBLISHABLE_KEY) {
    throw new Error(
      "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is not set. Copy .env.example to .env.local and fill it in.",
    );
  }

  const res = await fetch(`${BACKEND_URL}${path}`, {
    headers: { "x-publishable-api-key": PUBLISHABLE_KEY },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Medusa request failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

/** Region used for pricing: the configured one, otherwise the first region. */
export async function getRegion(): Promise<Region> {
  const { regions } = await storeFetch<{ regions: Region[] }>("/store/regions");
  const region = regions.find((r) => r.id === REGION_ID) ?? regions[0];

  if (!region) {
    throw new Error("No regions found. Did you run the backend seed script?");
  }

  return region;
}

export async function listProducts(regionId: string): Promise<Product[]> {
  const params = new URLSearchParams({
    region_id: regionId,
    fields: "id,title,handle,thumbnail,*variants.calculated_price",
    limit: "50",
  });
  const { products } = await storeFetch<{ products: Product[] }>(
    `/store/products?${params}`,
  );
  return products;
}

export async function getProductByHandle(
  handle: string,
  regionId: string,
): Promise<Product | null> {
  const params = new URLSearchParams({
    handle,
    region_id: regionId,
    fields: "*variants.calculated_price",
  });
  const { products } = await storeFetch<{ products: Product[] }>(
    `/store/products?${params}`,
  );
  return products[0] ?? null;
}
