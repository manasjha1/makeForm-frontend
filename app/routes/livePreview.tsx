import { useEffect, useState } from "react";
import { Link } from "react-router";
import Footer from "~/src/components/Footer";
import Header from "~/src/components/Headers";
import FormPreview from "~/src/components/FormPreview";
import { Button } from "~/src/components/ui/button";
import { readDraft } from "~/src/lib/form-draft";
import type { FormTemplate } from "~/src/lib/form-types";

export function meta() {
  return [
    { title: "Live Preview | makeForm" },
    {
      name: "description",
      content: "Test your saved form draft and validate answers locally.",
    },
  ];
}

export default function LivePreview() {
  const [form, setForm] = useState<FormTemplate | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setForm(readDraft());
    setReady(true);
  }, []);
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d]">
      <Header viewPage="LivePreview" />
      <main className="mx-auto max-w-2xl space-y-6 px-4 py-10">
        <h1 className="text-2xl font-bold text-[#191c1d] font-heading">Live preview</h1>
        {!ready ? (
          <p role="status" className="text-[#464555]">Loading draft…</p>
        ) : form ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button asChild variant="outline" className="border-[#e1e3e4] hover:bg-[#f3f4f5] shadow-xs">
                <Link to="/form-builder">Back to editor</Link>
              </Button>
              <p className="text-xs text-[#464555]">
                Draft saved for this browser tab
              </p>
            </div>
            <FormPreview form={form} />
          </>
        ) : (
          <section className="rounded-xl border border-[#e1e3e4] bg-white p-8 text-center shadow-[0_4px_6px_-1px_rgba(25,28,29,0.05),0_2px_4px_-2px_rgba(25,28,29,0.04)]">
            <h2 className="text-lg font-semibold text-[#191c1d] font-heading">
              Your next form starts here
            </h2>
            <p className="my-3 text-sm text-[#464555]">
              Choose a template, customize it, then save your draft to preview
              it here.
            </p>
            <Button asChild className="bg-[#3525cd] hover:bg-[#4f46e5] text-white shadow-xs">
              <Link to="/form-builder?view=templates">Browse templates</Link>
            </Button>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
