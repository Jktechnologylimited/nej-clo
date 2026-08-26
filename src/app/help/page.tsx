import { Suspense } from "react";
import { HelpClient } from "./HelpClient";

export const metadata = { title: "Help & Info — Nej Clothing" };

export default function HelpPage() {
  return (
    <Suspense fallback={null}>
      <HelpClient />
    </Suspense>
  );
}
