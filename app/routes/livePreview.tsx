import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Toaster } from "react-hot-toast";
import { ArrowLeft, MoveRight } from "lucide-react";
import Footer from "~/src/components/Footer";
import Header from "~/src/components/Headers";
import FormPreview from "~/src/components/FormPreview";
import { Button } from "~/src/components/ui/button";
import { readDraft } from "~/src/lib/form-draft";
import { inspectFormLayout } from "~/src/lib/form-layout";
import { findTemplate } from "~/src/data/form-templates";
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
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template");
  const [form, setForm] = useState<FormTemplate | null>(null);
  const [isTemplatePreview, setIsTemplatePreview] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (templateId) {
      const template = findTemplate(templateId);
      if (template) {
        setForm(template);
        setIsTemplatePreview(true);
        setReady(true);
        return;
      }
    }
    setForm(readDraft());
    setIsTemplatePreview(false);
    setReady(true);
  }, [templateId]);

  const layout = useMemo(() => (form ? inspectFormLayout(form.fields) : null), [form]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d] flex flex-col">
      <Toaster position="top-right" />
      <Header viewPage="LivePreview" />
      <main className={`${layout?.containerClass || "mx-auto w-full max-w-4xl"} flex-1 space-y-5 px-3 py-6 sm:space-y-6 sm:px-5 sm:py-8 lg:px-8 lg:py-10`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-heading text-xl font-bold text-[#191c1d] sm:text-2xl lg:text-3xl">
            {isTemplatePreview ? "Template preview" : "Live preview"}
          </h1>
          {layout && (
            <span className="rounded-full bg-surface-container-high px-2.5 py-1 text-xs font-semibold text-on-surface-variant border border-[#e1e3e4]">
              {layout.badgeLabel} &bull; {layout.fieldsCount} {layout.fieldsCount === 1 ? "field" : "fields"}
            </span>
          )}
        </div>
        {!ready ? (
          <p role="status" className="text-on-surface-variant">Loading preview…</p>
        ) : form ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              {isTemplatePreview ? (
                <div className="flex flex-wrap items-center gap-2.5">
                  <Button asChild variant="outline" className="border-[#e1e3e4] hover:bg-surface-container-low shadow-xs">
                    <Link to="/form-builder?view=templates">
                      <ArrowLeft className="size-4" />
                      Back to templates
                    </Link>
                  </Button>
                  <Button asChild className="bg-[#3525cd] text-white hover:bg-primary-container shadow-xs font-semibold">
                    <Link to={`/form-builder?template=${encodeURIComponent(form.id)}`}>
                      Use this template
                      <MoveRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <Button asChild variant="outline" className="border-[#e1e3e4] hover:bg-surface-container-low shadow-xs">
                  <Link to="/form-builder">
                    <ArrowLeft className="size-4" />
                    Back to editor
                  </Link>
                </Button>
              )}
              <p className="text-xs text-on-surface-variant sm:text-sm">
                {isTemplatePreview
                  ? `Interactive template preview · ${form.title}`
                  : "Draft saved for this browser tab"}
              </p>
            </div>
            <FormPreview form={form} />
          </>
        ) : (
          <section className="rounded-xl border border-[#e1e3e4] bg-white p-8 text-center shadow-[0_4px_6px_-1px_rgba(25,28,29,0.05),0_2px_4px_-2px_rgba(25,28,29,0.04)]">
            <h2 className="text-lg font-semibold text-[#191c1d] font-heading">
              Your next form starts here
            </h2>
            <p className="my-3 text-sm text-on-surface-variant">
              Choose a template, customize it, then save your draft to preview
              it here.
            </p>
            <Button asChild className="bg-[#3525cd] hover:bg-primary-container text-white shadow-xs">
              <Link to="/form-builder?view=templates">Browse templates</Link>
            </Button>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
