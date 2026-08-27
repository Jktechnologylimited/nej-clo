export const productCategoryValues = [
  "hoodie",
  "cargo",
  "tee",
  "tracksuit",
  "cap",
  "jacket",
] as const;
export type ProductCategory = (typeof productCategoryValues)[number];

export const productStatusValues = [
  "available",
  "limited",
  "restocked",
  "sold_out",
] as const;
export type ProductStatus = (typeof productStatusValues)[number];

export const userRoleValues = ["customer", "admin"] as const;
export type UserRole = (typeof userRoleValues)[number];

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  colorway: string;
  sku: string;
  dropCode: string;
  priceCents: number;
  stock: number;
  status: ProductStatus;
  sizes: string;
  imageUrls: string[];
  swatchHex: string | null;
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  userId: string | null;
  email: string;
  name: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  postalCode: string;
  country: string;
  status: string;
  totalCents: number;
  paymentReference: string | null;
  carrier: string | null;
  trackingNumber: string | null;
  createdAt: string;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string | null;
  productName: string;
  size: string;
  quantity: number;
  unitPriceCents: number;
};

export type Collection = {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string | null;
  badge: string | null;
  createdAt: string;
};
