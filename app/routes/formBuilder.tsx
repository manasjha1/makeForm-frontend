import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import Header from "~/src/components/Headers";
import FormPreview, { formControlClass } from "~/src/components/FormPreview";
import TemplateGallery from "~/src/components/TemplateGallery";
import { Button } from "~/src/components/ui/button";
import { findTemplate } from "~/src/data/form-templates";
import { createForm, type FormField, type FormTemplate } from "~/src/lib/form-types";

export default function FormBuilder() {
    const [params, setParams] = useSearchParams();
    const templateId = params.get("template");
    const [form, setForm] = useState<FormTemplate | null>(null);
    const [revision, setRevision] = useState(0);
    useEffect(() => {
        const template = findTemplate(templateId);
        setForm(template ? createForm(template) : null);
        setRevision((value) => value + 1);
    }, [templateId]);
    const updateField = (id: string, patch: Partial<FormField>) => setForm((current) => current && ({ ...current, fields: current.fields.map((field) => field.id === id ? { ...field, ...patch } : field) }));
    return <div className="min-h-screen bg-[#faf8f5]">
        <Header viewPage="FormBuilder" />
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            {!form ? <>
                <h1 className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-500">Form builder</h1>
                {templateId && <p role="status" className="mb-4 text-sm text-amber-800">That template is unavailable. Choose one below.</p>}
                <TemplateGallery onSelect={(template) => setParams({ template: template.id })} />
            </> : <>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <Button variant="outline" onClick={() => setParams({})}>All templates</Button>
                    <Button variant="outline" onClick={() => { const template = findTemplate(templateId); if (template) { setForm(createForm(template)); setRevision((value) => value + 1); } }}>Reset template</Button>
                </div>
                <div className="grid items-start gap-8 lg:grid-cols-2">
                    <section aria-label="Edit form" className="space-y-5">
                        <div><h1 className="text-2xl font-bold text-gray-900">Make it yours</h1><p className="mt-1 text-sm text-gray-500">Edit your form and try it in the preview.</p></div>
                        <label className="block space-y-2 text-sm font-medium">Form title<input className={formControlClass} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
                        <label className="block space-y-2 text-sm font-medium">Description<textarea rows={3} className={formControlClass} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
                        {form.fields.map((field, index) => <div key={field.id} className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
                            <div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold uppercase text-gray-500">Field {index + 1} · {field.type}</span><Button variant="ghost" size="sm" aria-label={`Remove ${field.label}`} onClick={() => setForm({ ...form, fields: form.fields.filter((item) => item.id !== field.id) })}>Remove</Button></div>
                            <label className="block space-y-1 text-sm">Label<input className={formControlClass} value={field.label} onChange={(event) => updateField(field.id, { label: event.target.value })} /></label>
                            {field.type === "select" && <label className="block space-y-1 text-sm">Options (one per line)<textarea className={formControlClass} rows={3} value={field.options?.join("\n") || ""} onChange={(event) => updateField(field.id, { options: event.target.value.split("\n") })} /></label>}
                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-emerald-700" checked={field.required} onChange={(event) => updateField(field.id, { required: event.target.checked })} />Required field</label>
                        </div>)}
                        <Button variant="outline" onClick={() => setForm({ ...form, fields: [...form.fields, { id: crypto.randomUUID(), label: "New question", type: "text", required: false }] })}>Add text field</Button>
                    </section>
                    <section aria-label="Live form preview" className="min-w-0 lg:sticky lg:top-24"><FormPreview key={`${form.id}-${revision}`} form={form} /></section>
                </div>
            </>}
        </main>
    </div>;
}
