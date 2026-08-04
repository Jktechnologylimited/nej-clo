export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  colorway: string;
  size: string;
  quantity: number;
  unitPriceCents: number;
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
