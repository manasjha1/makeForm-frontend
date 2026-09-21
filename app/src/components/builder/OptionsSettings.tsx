import { ArrowUp, ArrowDown, X, Plus } from "lucide-react";
import type { SettingsProps } from "./GeneralSettings";
import { nextOptionLabel, renameOption } from "../../lib/field-options";

export default function OptionsSettings({ field, onChange }: SettingsProps) {
    const options = field.options ?? [];
    const update = (next: string[]) => onChange({ options: next, ...(field.defaultValue && !next.includes(field.defaultValue) ? { defaultValue: "" } : {}) });
    const move = (index: number, delta: number) => { const next = [...options]; [next[index], next[index + delta]] = [next[index + delta], next[index]]; update(next); };
    return <div><h3 className="studio-label">Options Editor</h3><p className="studio-muted mt-1">Add, rename, or reorder the available choices.</p>
        {options.map((option, index) => <div className="studio-option-row" key={index}>
            <input className="studio-control min-w-0" aria-label={`Option ${index + 1}`} value={option} onChange={(event) => onChange(renameOption(field, index, event.target.value))} />
            <button className="studio-icon-button shrink-0" aria-label={`Move option ${index + 1} up`} disabled={index === 0} onClick={() => move(index, -1)}><ArrowUp size={12} /></button>
            <button className="studio-icon-button shrink-0" aria-label={`Move option ${index + 1} down`} disabled={index === options.length - 1} onClick={() => move(index, 1)}><ArrowDown size={12} /></button>
            <button className="studio-icon-button danger shrink-0" aria-label={`Remove option ${index + 1}`} onClick={() => update(options.filter((_, position) => position !== index))}><X size={13} /></button>
        </div>)}
        <button className="studio-button mt-3 w-full" onClick={() => update([...options, nextOptionLabel(options)])}><Plus size={13} />Add Option</button>
        {field.type === "checkbox" && !options.length && <p className="studio-muted mt-3">Without options, this field is a single agreement checkbox.</p>}
        {field.type !== "checkbox" && !options.length && <p role="alert" className="studio-error mt-3">Add at least one option so this field can be answered.</p>}
        {(options.some((option) => !option.trim()) || new Set(options).size !== options.length) && <p role="alert" className="studio-error mt-3">Give each option a unique, non-empty label.</p>}
    </div>;
}
