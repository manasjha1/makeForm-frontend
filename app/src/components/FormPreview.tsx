import { useId, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { FormTemplate } from "../lib/form-types";
import { initialAnswers, visibleFields, type Answers } from "../lib/studio-model";
import { validateAnswers, type UploadInfo } from "../lib/form-validation";
import { Button } from "./ui/button";
import PreviewUpload from "./builder/PreviewUpload";

export const formControlClass = "w-full rounded-lg border border-[#E2E8E4] bg-[#FAF9F6] px-3 py-2.5 text-sm text-[#1C2925] outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 aria-invalid:border-red-500";

export default function FormPreview({ form }: { form: FormTemplate }) {
    const prefix = useId();
    const formRef = useRef<HTMLFormElement>(null);
    const [answers, setAnswers] = useState<Answers>(() => initialAnswers(form.fields));
    const [files, setFiles] = useState<Record<string, UploadInfo | undefined>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null);
    const visible = visibleFields(form.fields, answers);
    const visibleErrors = visible.filter((field) => errors[field.id]);
    const focusField = (id: string) => {
        const target = formRef.current?.elements.namedItem(id);
        if (target instanceof HTMLElement) target.focus();
        else if (target instanceof RadioNodeList) (target[0] as HTMLElement)?.focus();
    };
    const update = (id: string, value: Answers[string]) => { setAnswers((current) => ({ ...current, [id]: value })); setErrors((current) => { const next = { ...current }; delete next[id]; return next; }); setSubmitted(null); };

    return <form ref={formRef} noValidate className="space-y-6 rounded-2xl border border-[#E2E8E4] border-t-4 border-t-emerald-700 bg-white p-5 shadow-sm sm:p-8" onSubmit={(event) => {
        event.preventDefault();
        const next = validateAnswers(visible, answers, files);
        setErrors(next); setSubmitted(null);
        if (Object.keys(next).length) { focusField(Object.keys(next)[0]); return; }
        setSubmitted(Object.fromEntries(visible.map((field) => [field.id, field.type === "file" ? files[field.id] ?? null : answers[field.id] ?? ""])));
    }}>
        <div><p className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-700">Live preview</p><h2 className="break-words text-2xl font-bold text-[#1C2925]">{form.title}</h2><p className="mt-2 whitespace-pre-wrap break-words text-sm text-[#6B7872]">{form.description}</p></div>
        <p className="text-xs text-[#6B7872]">Fields marked * are required. Test responses and files stay in this preview and are not uploaded.</p>
        {visibleErrors.length > 0 && <section aria-label="Validation summary" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
            <h3 className="text-sm font-semibold">Check {visibleErrors.length} {visibleErrors.length === 1 ? "field" : "fields"} before continuing</h3>
            <ul className="mt-2 space-y-1">{visibleErrors.map((field) => <li key={field.id}><button type="button" className="text-left text-xs underline underline-offset-2" onClick={() => focusField(field.id)}>{field.label}: {errors[field.id]}</button></li>)}</ul>
        </section>}
        {visible.map((field) => {
            const id = `${prefix}-${field.id}`;
            const props = { id, name: field.id, required: field.required, className: formControlClass, "aria-invalid": !!errors[field.id], "aria-describedby": `${id}-help ${id}-error` };
            const value = typeof answers[field.id] === "string" ? answers[field.id] as string : "";
            const choices = field.type === "radio" || (field.type === "checkbox" && !!field.options?.length);
            return <div key={field.id} className="space-y-2">
                {choices ? <fieldset><legend className="mb-2 text-sm font-semibold text-[#1C2925]">{field.label}{field.required && <span className="text-red-600"> *</span>}</legend>{field.options?.map((option, index) => <label key={index} className="my-2 flex items-start gap-2 text-sm text-[#1C2925]"><input type={field.type} name={field.id} className="mt-1 accent-emerald-700" aria-invalid={!!errors[field.id]} aria-describedby={`${id}-help ${id}-error`} checked={field.type === "radio" ? value === option : Array.isArray(answers[field.id]) && (answers[field.id] as string[]).includes(option)} onChange={(event) => { const current = Array.isArray(answers[field.id]) ? answers[field.id] as string[] : []; update(field.id, field.type === "radio" ? option : event.target.checked ? [...current, option] : current.filter((item) => item !== option)); }} />{option}</label>)}</fieldset>
                    : field.type === "checkbox" ? <label className="flex items-start gap-2 text-sm font-medium"><input {...props} type="checkbox" className="mt-1 accent-emerald-700" checked={answers[field.id] === true} onChange={(event) => update(field.id, event.target.checked)} />{field.label}{field.required && " *"}</label>
                        : <><label htmlFor={id} className="block break-words text-sm font-semibold text-[#1C2925]">{field.label}{field.required && <span className="text-red-600"> *</span>}</label>
                            {field.type === "textarea" ? <textarea {...props} rows={4} value={value} placeholder={field.placeholder} onChange={(event) => update(field.id, event.target.value)} />
                                : field.type === "select" ? <select {...props} value={value} onChange={(event) => update(field.id, event.target.value)}><option value="">{field.placeholder || "Choose an option"}</option>{field.options?.map((option, index) => <option key={index} value={option}>{option}</option>)}</select>
                                    : field.type === "file" ? <PreviewUpload field={field} id={id} invalid={!!errors[field.id]} onChange={(file) => { setFiles((current) => ({ ...current, [field.id]: file })); update(field.id, file?.name ?? ""); }} />
                                        : <input {...props} type={field.type} value={value} step={field.type === "number" ? "any" : undefined} placeholder={field.placeholder} min={field.min} max={field.max} onChange={(event) => update(field.id, event.target.value)} />}
                        </>}
                <p id={`${id}-help`} className="text-xs text-[#6B7872]">{field.helpText}</p>
                <p id={`${id}-error`} role={errors[field.id] ? "alert" : undefined} className="text-xs text-red-700">{errors[field.id]}</p>
            </div>;
        })}
        <Button type="submit" className="w-full bg-emerald-700 text-white hover:bg-emerald-800">Test submission</Button>
        {submitted && <section role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900"><CheckCircle2 className="mb-3" /><h3 className="font-semibold">Your form passed validation</h3><p className="my-2 text-sm">This was a test. No response was sent or saved.</p><details><summary className="cursor-pointer text-xs font-semibold">View test response</summary><pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap break-all text-xs">{JSON.stringify(submitted, null, 2)}</pre></details></section>}
    </form>;
}
