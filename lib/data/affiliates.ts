// Affiliate products per tool, shown only when NEXT_PUBLIC_AFFILIATES_ON=1.
// Empty at launch (A10). Links render with rel="sponsored nofollow noopener".

export interface AffiliateProduct {
  name: string;
  url: string;
  note?: string;
}

// Keyed by tool slug.
export const AFFILIATES: Record<string, AffiliateProduct[]> = {};
