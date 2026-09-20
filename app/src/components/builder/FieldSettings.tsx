import { useState } from "react";
import { MousePointer2 } from "lucide-react";
import type { FormField } from "../../lib/form-types";
import GeneralSettings from "./GeneralSettings";
import ValidationSettings from "./ValidationSettings";
import OptionsSettings from "./OptionsSettings";
import LogicSettings from "./LogicSettings";
import { fieldIcon } from "./field-catalog";

export default function FieldSettings({ field, fields, onChange }: { field?: FormField; fields: FormField[]; onChange: (patch: Partial<FormField>) => void }) {
    const [tab, setTab] = useState("General");
    const Icon = field ? fieldIcon(field.type) : MousePointer2;
    const choice = field && ["select", "radio", "checkbox"].includes(field.type);
    return <aside className="studio-panel studio-settings" aria-label="Field settings">
        {!field ? <div className="studio-empty"><MousePointer2 size={24} className="mx-auto mb-4" /><h2>Select a field</h2><p className="studio-muted mt-2">Click any card on the canvas to edit its settings.</p></div> : <>
            <div className="studio-panel-header flex items-center gap-3"><span className="studio-field-icon"><Icon size={19} /></span><div className="min-w-0"><span className="studio-eyebrow">{field.type}</span><h2 className="truncate">{field.label || "Untitled field"}</h2><p className="studio-muted truncate" title={field.id}>ID: {field.id}</p></div></div>
            <div className="studio-settings-tabs studio-tabs" aria-label="Settings sections">{["General", "Rules", ...(choice ? ["Options"] : []), "Logic"].map((item) => <button key={item} aria-pressed={tab === item} onClick={() => setTab(item)}>{item}</button>)}</div>
            <div className="studio-settings-body">
                {tab === "General" && <GeneralSettings field={field} onChange={onChange} />}
                {tab === "Rules" && <ValidationSettings field={field} onChange={onChange} />}
                {tab === "Options" && choice && <OptionsSettings field={field} onChange={onChange} />}
                {tab === "Logic" && <LogicSettings field={field} fields={fields} onChange={onChange} />}
            </div>
        </>}
    </aside>;
}
