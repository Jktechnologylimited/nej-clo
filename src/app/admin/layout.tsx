import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="border-b border-line bg-bg-raised">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <nav className="flex items-center gap-6 font-mono-data text-xs tracking-[0.1em] text-ink/60">
            <Link href="/admin" className="transition hover:text-amber">
              DASHBOARD
            </Link>
            <Link href="/admin/products" className="transition hover:text-amber">
              PRODUCTS
            </Link>
            <Link href="/admin/orders" className="transition hover:text-amber">
              ORDERS
            </Link>
            <Link href="/admin/customers" className="transition hover:text-amber">
              CUSTOMERS
            </Link>
            <Link href="/admin/subscribers" className="transition hover:text-amber">
              SUBSCRIBERS
            </Link>
            <Link href="/admin/collections" className="transition hover:text-amber">
              COLLECTIONS
            </Link>
            <Link href="/admin/content" className="transition hover:text-amber">
              SITE CONTENT
            </Link>
            <Link
              href="/"
              className="transition hover:text-amber"
              target="_blank"
            >
              VIEW SITE ↗
            </Link>
          </nav>
          <LogoutButton />
        </div>
      </div>
      {children}
    </div>
  );
}
