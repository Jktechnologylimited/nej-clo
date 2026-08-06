import { config } from "dotenv";
config({ path: ".env.local" });

import { randomUUID } from "node:crypto";
import { sql } from "./index";
import { slugify } from "../utils";
import { hashPassword } from "../auth/password";
import type { ProductCategory, ProductStatus } from "./types";

type SeedProduct = {
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
};

const SEED_PRODUCTS: SeedProduct[] = [
  {
    name: "Freight Hoodie",
    category: "hoodie",
    description:
      "Heavyweight 480gsm fleece, boxed fit, kangaroo pocket lined with the manifest tag. Built for cold loading docks, not showrooms.",
    colorway: "Bitumen Black",
    sku: "NEJ-HD-BLK-01",
    dropCode: "NEJ-001",
    priceCents: 3500000,
    stock: 6,
    status: "limited",
    sizes: "S,M,L,XL,XXL",
  },
  {
    name: "Freight Hoodie",
    category: "hoodie",
    description:
      "Heavyweight 480gsm fleece, boxed fit, kangaroo pocket lined with the manifest tag. Same cut, bone colourway.",
    colorway: "Bone",
    sku: "NEJ-HD-BON-01",
    dropCode: "NEJ-001",
    priceCents: 3500000,
    stock: 0,
    status: "sold_out",
    sizes: "S,M,L,XL",
  },
  {
    name: "Manifest Cargo",
    category: "cargo",
    description:
      "Ripstop cargo with a stamped patch pocket and drawcord hem. Six pockets, one of them for the receipt.",
    colorway: "Concrete Grey",
    sku: "NEJ-CG-GRY-01",
    dropCode: "NEJ-001",
    priceCents: 2800000,
    stock: 14,
    status: "available",
    sizes: "28,30,32,34,36",
  },
  {
    name: "Manifest Cargo",
    category: "cargo",
    description:
      "Ripstop cargo with a stamped patch pocket and drawcord hem. Rust colourway, restocked after selling out in nine minutes.",
    colorway: "Rust",
    sku: "NEJ-CG-RST-01",
    dropCode: "NEJ-002",
    priceCents: 2800000,
    stock: 9,
    status: "restocked",
    sizes: "28,30,32,34",
  },
  {
    name: "Dock Tee",
    category: "tee",
    description:
      "220gsm heavy cotton, garment-dyed, boxy fit. Back print reads like a shipping stencil, front carries the mark only.",
    colorway: "Bone",
    sku: "NEJ-TE-BON-01",
    dropCode: "NEJ-001",
    priceCents: 1500000,
    stock: 22,
    status: "available",
    sizes: "XS,S,M,L,XL,XXL",
  },
  {
    name: "Dock Tee",
    category: "tee",
    description:
      "220gsm heavy cotton, garment-dyed, boxy fit. Black colourway with tonal print.",
    colorway: "Bitumen Black",
    sku: "NEJ-TE-BLK-01",
    dropCode: "NEJ-001",
    priceCents: 1500000,
    stock: 4,
    status: "limited",
    sizes: "S,M,L,XL",
  },
  {
    name: "Manifest Tracksuit",
    category: "tracksuit",
    description:
      "Matching zip-through top and tapered pant in brushed-back fleece. Sold as a set, worn as a uniform.",
    colorway: "Bitumen Black",
    sku: "NEJ-TS-BLK-01",
    dropCode: "NEJ-002",
    priceCents: 5500000,
    stock: 7,
    status: "limited",
    sizes: "S,M,L,XL",
  },
  {
    name: "Stamped Cap",
    category: "cap",
    description:
      "Structured six-panel with an embroidered stamp mark and adjustable strap. One size, low crown.",
    colorway: "Amber",
    sku: "NEJ-CP-AMB-01",
    dropCode: "NEJ-002",
    priceCents: 1200000,
    stock: 30,
    status: "available",
    sizes: "One size",
  },
  {
    name: "Loading Jacket",
    category: "jacket",
    description:
      "Waxed cotton work jacket, corduroy collar, interior manifest pocket. Weatherproofed for standing outside a shop at 5am.",
    colorway: "Concrete Grey",
    sku: "NEJ-JK-GRY-01",
    dropCode: "NEJ-002",
    priceCents: 6500000,
    stock: 5,
    status: "limited",
    sizes: "S,M,L,XL",
  },
];

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@nejclothing.test";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "change-this-password";

async function seed() {
  console.log("Clearing existing catalog…");
  // product_collections rows cascade-delete with their products/collections
  // (see schema.sql), so this order is enough.
  await sql`DELETE FROM products`;
  await sql`DELETE FROM collections`;

  console.log("Seeding products…");
  const inserted: { id: string; slug: string; sku: string }[] = [];
  for (const p of SEED_PRODUCTS) {
    const id = randomUUID();
    const slug = `${slugify(p.name)}-${slugify(p.colorway)}`;
    await sql`
      INSERT INTO products (
        id, slug, name, category, description, colorway, sku, drop_code,
        price_cents, stock, status, sizes
      ) VALUES (
        ${id}, ${slug}, ${p.name}, ${p.category}, ${p.description}, ${p.colorway}, ${p.sku}, ${p.dropCode},
        ${p.priceCents}, ${p.stock}, ${p.status}, ${p.sizes}
      )
    `;
    inserted.push({ id, slug, sku: p.sku });
  }
  console.log(`Seeded ${inserted.length} products.`);

  console.log("Seeding collections…");
  const bySku = (sku: string) => inserted.find((p) => p.sku === sku)?.id;

  const collectionDefs = [
    {
      name: "NEJ-001: First Manifest",
      description:
        "The opening run. Hoodies, tees, and cargos that started the label — some already sold out.",
      skus: ["NEJ-HD-BLK-01", "NEJ-HD-BON-01", "NEJ-CG-GRY-01", "NEJ-TE-BON-01", "NEJ-TE-BLK-01"],
    },
    {
      name: "NEJ-002: Restock Wave",
      description:
        "The second manifest — restocked cargos, the tracksuit, and cold-weather pieces.",
      skus: ["NEJ-CG-RST-01", "NEJ-TS-BLK-01", "NEJ-CP-AMB-01", "NEJ-JK-GRY-01"],
    },
    {
      name: "Outerwear",
      description: "Everything built to be worn on top — hoodies, the tracksuit, and the jacket.",
      skus: ["NEJ-HD-BLK-01", "NEJ-HD-BON-01", "NEJ-TS-BLK-01", "NEJ-JK-GRY-01"],
    },
  ];

  for (const def of collectionDefs) {
    const collectionId = randomUUID();
    await sql`
      INSERT INTO collections (id, slug, name, description)
      VALUES (${collectionId}, ${slugify(def.name)}, ${def.name}, ${def.description})
    `;

    const productIds = def.skus.map(bySku).filter((id): id is string => !!id);
    for (const productId of productIds) {
      await sql`
        INSERT INTO product_collections (product_id, collection_id)
        VALUES (${productId}, ${collectionId})
      `;
    }
  }
  console.log(`Seeded ${collectionDefs.length} collections.`);

  console.log("Ensuring an admin user exists…");
  const passwordHash = await hashPassword(ADMIN_PASSWORD);
  await sql`
    INSERT INTO users (name, email, password_hash, role)
    VALUES ('Admin', ${ADMIN_EMAIL}, ${passwordHash}, 'admin')
    ON CONFLICT (email) DO NOTHING
  `;
  console.log(
    `Admin ready — log in at /account/login with ${ADMIN_EMAIL} (set ADMIN_EMAIL/ADMIN_PASSWORD env vars to customize). If this user already existed, its password was left untouched.`,
  );

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
