import { useId, useState } from "react";
import type { FormTemplate } from "../lib/form-types";
import { Button } from "./ui/button";

export const formControlClass = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

export default function FormPreview({ form }: { form: FormTemplate }) {
    const prefix = useId();
    const [submitted, setSubmitted] = useState(false);

    return (
        <form className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8" onChange={() => setSubmitted(false)} onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
            <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-700">Form preview</p>
                <h2 className="break-words text-2xl font-bold text-gray-900">{form.title}</h2>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm text-gray-500">{form.description}</p>
            </div>
            <p className="text-xs text-gray-500">Fields marked * are required. This preview does not send or save responses.</p>
            {form.fields.map((field) => {
                const id = `${prefix}-${field.id}`;
                const props = { id, name: field.id, required: field.required, className: formControlClass };
                return (
                    <div key={field.id} className="space-y-2">
                        {field.type === "checkbox" ? (
                            <label htmlFor={id} className="flex items-start gap-2 text-sm text-gray-700">
                                <input id={id} name={field.id} type="checkbox" required={field.required} className="mt-1 size-4 shrink-0 accent-emerald-700" />
                                <span>{field.label}{field.required && " *"}</span>
                            </label>
                        ) : (
                            <>
                                <label htmlFor={id} className="block break-words text-sm font-medium text-gray-700">{field.label}{field.required && " *"}</label>
                                {field.type === "textarea" ? <textarea {...props} rows={4} placeholder={field.placeholder} />
                                    : field.type === "select" ? <select {...props} defaultValue=""><option value="" disabled>Choose an option</option>{field.options?.map((option, index) => <option key={index} value={option}>{option}</option>)}</select>
                                        : <input {...props} type={field.type} placeholder={field.placeholder} min={field.min} max={field.max} />}
                            </>
                        )}
                    </div>
                );
            })}
            <Button type="submit" className="w-full bg-emerald-700 text-white hover:bg-emerald-800">Test submission</Button>
            {submitted && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">Your form passed validation. This was a preview; no response was sent or saved.</p>}
        </form>
    );
}
