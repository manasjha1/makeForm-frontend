import { useState } from "react";
import { FileText, Search } from "lucide-react";
import { formTemplates } from "../data/form-templates";
import type { FormTemplate } from "../lib/form-types";
import { Button } from "./ui/button";
import { formControlClass } from "./FormPreview";

export default function TemplateGallery({ onSelect }: { onSelect: (template: FormTemplate) => void }) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const templates = formTemplates.filter((template) =>
        (category === "All" || template.category === category) &&
        `${template.title} ${template.description}`.toLowerCase().includes(search.trim().toLowerCase()),
    );

    return (
        <section aria-label="Prebuilt form templates" className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div><p className="text-sm font-semibold text-emerald-700">Start with a template</p><h2 className="mt-1 text-3xl font-bold text-gray-900">A head start for every form.</h2></div>
                <label className="relative block sm:w-72"><span className="sr-only">Search templates</span><Search aria-hidden="true" className="absolute top-3 left-3 size-4 text-gray-400" /><input className={`${formControlClass} pl-9`} type="search" placeholder="Search templates…" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
            </div>
            <div className="flex flex-wrap gap-2" aria-label="Template categories">
                {["All", "Business", "Events", "Feedback", "Personal"].map((item) => <Button key={item} variant={category === item ? "default" : "outline"} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</Button>)}
            </div>
            <p role="status" className="text-sm text-gray-500">{templates.length} {templates.length === 1 ? "template" : "templates"}</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => <article key={template.id} className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between"><FileText aria-hidden="true" className="size-10 rounded-lg bg-emerald-50 p-2 text-emerald-700" /><span className="text-xs font-medium text-gray-500">{template.category}</span></div>
                    <h3 className="text-lg font-semibold text-gray-900">{template.title}</h3><p className="mt-2 flex-1 text-sm leading-6 text-gray-500">{template.description}</p>
                    <p className="mt-5 text-xs text-gray-500">{template.fields.length} fields · Fully customizable</p>
                    <Button onClick={() => onSelect(template)} className="mt-4 bg-emerald-700 text-white hover:bg-emerald-800" aria-label={`Use ${template.title} template`}>Use template</Button>
                </article>)}
            </div>
            {templates.length === 0 && <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center"><p className="mb-3 text-gray-600">No templates match your search.</p><Button variant="outline" onClick={() => { setSearch(""); setCategory("All"); }}>Clear filters</Button></div>}
        </section>
    );
}
