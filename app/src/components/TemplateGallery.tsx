import { useState } from "react";
import { FileText, Search } from "lucide-react";
import { formTemplates } from "../data/form-templates";
import type { FormTemplate } from "../lib/form-types";
import { Button } from "./ui/button";
import { formControlClass } from "./FormPreview";

export default function TemplateGallery({
  onSelect,
}: {
  onSelect: (template: FormTemplate) => void;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const templates = formTemplates.filter(
    (template) =>
      (category === "All" || template.category === category) &&
      `${template.title} ${template.description}`
        .toLowerCase()
        .includes(search.trim().toLowerCase()),
  );

  return (
    <section
      aria-label="Prebuilt form templates"
      className="template-gallery space-y-6"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#3525cd]">
            Start with a template
          </p>
          <h2 className="mt-1 text-3xl font-bold text-[#191c1d]">
            A head start for every form.
          </h2>
        </div>
        <label className="relative block w-full lg:w-72 lg:shrink-0">
          <span className="sr-only">Search templates</span>
          <Search
            aria-hidden="true"
            className="absolute top-3 left-3 size-4 text-gray-400"
          />
          <input
            className={`${formControlClass} pl-9`}
            type="search"
            placeholder="Search templates…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </div>
      <div className="flex flex-wrap gap-2" aria-label="Template categories">
        {["All", "Business", "Events", "Feedback", "Personal"].map((item) => (
          <Button
            key={item}
            variant={category === item ? "default" : "outline"}
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
          </Button>
        ))}
      </div>
      <p role="status" className="text-sm text-gray-500">
        {templates.length} {templates.length === 1 ? "template" : "templates"}
      </p>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => (
          <article
            key={template.id}
            className="flex min-w-0 flex-col rounded-xl border border-[#e1e3e4] bg-white p-4 sm:p-6 shadow-[0_4px_6px_-1px_rgba(25,28,29,0.05),0_2px_4px_-2px_rgba(25,28,29,0.04)] hover:shadow-[0_10px_20px_-3px_rgba(25,28,29,0.08)] transition-all"
          >
            <div className="mb-5 flex items-center justify-between">
              <FileText
                aria-hidden="true"
                className="size-10 rounded-lg bg-[#e2dfff] p-2 text-[#3525cd]"
              />
              <span className="text-xs font-semibold text-[#464555] bg-[#f3f4f5] px-2 py-0.5 rounded-full border border-[#e1e3e4]">
                {template.category}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-[#191c1d]">
              {template.title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-6 text-[#464555]">
              {template.description}
            </p>
            <p className="mt-5 text-xs text-[#777587]">
              {template.fields.length} fields · Fully customizable
            </p>
            <Button
              onClick={() => onSelect(template)}
              className="mt-4 bg-[#3525cd] text-white hover:bg-[#4f46e5] shadow-xs font-semibold"
              aria-label={`Use ${template.title} template`}
            >
              Use template
            </Button>
          </article>
        ))}
      </div>
      {templates.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center">
          <p className="mb-3 text-gray-600">No templates match your search.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </section>
  );
}
