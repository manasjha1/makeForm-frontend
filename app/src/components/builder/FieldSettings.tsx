import { useId, useState } from "react";
import { MousePointer2 } from "lucide-react";
import type { FormField } from "../../lib/form-types";
import GeneralSettings from "./GeneralSettings";
import ValidationSettings from "./ValidationSettings";
import OptionsSettings from "./OptionsSettings";
import LogicSettings from "./LogicSettings";
import { fieldIcon } from "./field-catalog";

export default function FieldSettings({ field, fields, onChange }: { field?: FormField; fields: FormField[]; onChange: (patch: Partial<FormField>) => void }) {
    const [tab, setTab] = useState("General");
    const tabId = useId();
    const Icon = field ? fieldIcon(field.type) : MousePointer2;
    const choice = field && ["select", "radio", "checkbox"].includes(field.type);
    const tabs = ["General", "Rules", ...(choice ? ["Options"] : []), "Logic"];
    return <aside id="studio-settings" tabIndex={-1} className="studio-panel studio-settings" aria-label="Field settings">
        {!field ? <div className="studio-empty"><MousePointer2 size={24} className="mx-auto mb-4" /><h2>Select a field</h2><p className="studio-muted mt-2">Click any card on the canvas to edit its settings.</p></div> : <>
            <div className="studio-panel-header flex items-center gap-3"><span className="studio-field-icon"><Icon size={19} /></span><div className="min-w-0"><span className="studio-eyebrow">{field.type}</span><h2 className="truncate">{field.label || "Untitled field"}</h2><p className="studio-muted truncate" title={field.id}>ID: {field.id}</p></div></div>
            <div className="studio-settings-tabs studio-tabs" role="tablist" aria-label="Settings sections">{tabs.map((item, index) => <button key={item} id={tabId + item} role="tab" aria-selected={tab === item} aria-controls={tabId + "panel"} tabIndex={tab === item ? 0 : -1} onClick={() => setTab(item)} onKeyDown={(event) => {
                const next = event.key === "ArrowRight" ? (index + 1) % tabs.length : event.key === "ArrowLeft" ? (index + tabs.length - 1) % tabs.length : event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : null;
                if (next !== null) { event.preventDefault(); setTab(tabs[next]); document.getElementById(tabId + tabs[next])?.focus(); }
            }}>{item}</button>)}</div>
            <div className="studio-settings-body" role="tabpanel" id={tabId + "panel"} aria-labelledby={tabId + tab} tabIndex={0}>
                {tab === "General" && <GeneralSettings field={field} onChange={onChange} />}
                {tab === "Rules" && <ValidationSettings field={field} onChange={onChange} />}
                {tab === "Options" && choice && <OptionsSettings field={field} onChange={onChange} />}
                {tab === "Logic" && <LogicSettings field={field} fields={fields} onChange={onChange} />}
            </div>
        </>}
    </aside>;
}
