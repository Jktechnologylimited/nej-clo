import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { getSupportEmail } from "@/lib/site-content";
import { HelpClient } from "./HelpClient";


export default async function HelpPage() {
  const supportEmail = await getSupportEmail();

  return (
    <Suspense fallback={null}>
      <HelpClient supportEmail={supportEmail} />
    </Suspense>
  );
}

export const metadata = pageMetadata('Help & Info', 'Find NEJ size guides, shipping details, returns information, and garment care advice.', '/help');
