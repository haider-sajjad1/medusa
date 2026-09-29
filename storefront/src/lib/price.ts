import type { Product } from "./medusa";

export function formatAmount(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount);
}

/**
 * Display price for a product: the cheapest variant price, prefixed with
 * "From" when variants have different prices.
 */
export function getProductPrice(product: Product): string | null {
  const prices = product.variants
    .map((v) => v.calculated_price)
    .filter((p) => p?.calculated_amount != null);

  if (prices.length === 0) return null;

  const amounts = prices.map((p) => p!.calculated_amount!);
  const min = Math.min(...amounts);
  const formatted = formatAmount(min, prices[0]!.currency_code);

  return Math.max(...amounts) > min ? `From ${formatted}` : formatted;
}
