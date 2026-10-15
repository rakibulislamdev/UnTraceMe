import type { Metadata } from "next";
import { PdfOrganizerClient } from "./_components/pdf-organizer-client";
import { AdContainer } from "@/app/_components/ad-container";
import { Pdf01Icon } from "hugeicons-react";

export const metadata: Metadata = {
  title: "PDF Split & Page Organizer | UnTraceMe",
  description:
    "Organize, rotate, reorder, extract, and split PDF pages with zero server data uploads.",
};

export default function PdfOrganizerPage() {
  return (
    <div className="flex-1 flex flex-col py-8 md:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wide mb-2">
          <Pdf01Icon className="size-4" />
          <span>Module 08</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
          PDF Split & Page Organizer
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
          Select individual pages, rotate 90°/180°, extract required sheets into a new PDF, or split every single page into an individual download.
        </p>
      </div>

      <AdContainer format="banner" className="mb-6" />
      <PdfOrganizerClient />
      <AdContainer format="horizontal" className="mt-10" />
    </div>
  );
}
