export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  colorway: string;
  size: string;
  quantity: number;
  unitPriceCents: number;
  /** Comma-separated list of sizes this product comes in, captured at add-time
   *  so the cart can offer a size-change dropdown without a re-fetch. Optional
   *  so carts saved before this field existed don't break — they just show
   *  their current size as the only option. */
  availableSizes?: string;
};

export type ProductForCard = {
  id: string;
  slug: string;
  name: string;
  category: string;
  colorway: string;
  sku: string;
  dropCode: string;
  priceCents: number;
  status: string;
  sizes: string;
};
