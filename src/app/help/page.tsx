import { Suspense } from "react";
import { getSupportEmail } from "@/lib/site-content";
import { HelpClient } from "./HelpClient";

export const metadata = { title: "Help & Info — Nej Clothing" };

export default async function HelpPage() {
  const supportEmail = await getSupportEmail();

  return (
    <Suspense fallback={null}>
      <HelpClient supportEmail={supportEmail} />
    </Suspense>
  );
}
