import type { FormField } from "../../lib/form-types";

export type SettingsProps = { field: FormField; onChange: (patch: Partial<FormField>) => void };
export default function GeneralSettings({ field, onChange }: SettingsProps) {
    return <>
        {field.type === "checkbox" && !field.options?.length && <label className="studio-toggle-row"><span><span className="studio-label">Checked by default</span><span className="studio-muted">Initial state in the live preview</span></span><input className="studio-toggle" type="checkbox" checked={field.defaultValue === "true"} onChange={(event) => onChange({ defaultValue: String(event.target.checked) })} /></label>}
        <label className="studio-label">Field Label <span className="studio-required">*</span><input className="studio-control" value={field.label} onChange={(event) => onChange({ label: event.target.value })} /></label>
        {!["checkbox", "radio", "file"].includes(field.type) && <label className="studio-label">Placeholder Text<input className="studio-control" placeholder="e.g. Enter value..." value={field.placeholder ?? ""} onChange={(event) => onChange({ placeholder: event.target.value })} /></label>}
        <label className="studio-label">Help Text / Description<textarea className="studio-control" rows={2} placeholder="Explanatory guide below field..." value={field.helpText ?? ""} onChange={(event) => onChange({ helpText: event.target.value })} /></label>
        {!["file", "checkbox"].includes(field.type) && <label className="studio-label">Default Value{["select", "radio"].includes(field.type) ? <select className="studio-control" value={field.defaultValue ?? ""} onChange={(event) => onChange({ defaultValue: event.target.value })}><option value="">No default</option>{field.options?.map((option, index) => <option key={index}>{option}</option>)}</select> : <input className="studio-control" type={field.type === "textarea" ? "text" : field.type} placeholder="Pre-filled value" value={field.defaultValue ?? ""} onChange={(event) => onChange({ defaultValue: event.target.value })} />}</label>}
        <label className="studio-toggle-row"><span><span className="studio-label">Required Field</span><span className="studio-muted">Prevents form submission if empty</span></span><input type="checkbox" className="studio-toggle" checked={field.required} onChange={(event) => onChange({ required: event.target.checked })} /></label>
    </>;
}
