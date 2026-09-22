import { GitBranch } from "lucide-react";
import type { FieldCondition, FormField } from "../../lib/form-types";
import type { SettingsProps } from "./GeneralSettings";

export default function LogicSettings({ field, fields, onChange }: SettingsProps & { fields: FormField[] }) {
    const preceding = fields.slice(0, fields.findIndex((item) => item.id === field.id)).filter((item) => item.type !== "file");
    const rule = field.condition;
    const source = preceding.find((item) => item.id === rule?.fieldId);
    const values = source?.options?.length ? source.options : source?.type === "checkbox" ? ["true", "false"] : null;
    const update = (patch: Partial<FieldCondition>) => rule && onChange({ condition: { ...rule, ...patch } });
    return <><div><GitBranch size={20} className="mb-3 text-emerald-700" /><h3 className="font-semibold">Conditional Logic</h3><p className="studio-muted mt-2">Show or hide this field when a previous answer matches your rule.</p></div>
        <label className="studio-toggle-row"><span className="studio-label">Enable condition</span><input className="studio-toggle" type="checkbox" disabled={!preceding.length} checked={!!rule} onChange={(event) => onChange({ condition: event.target.checked ? { fieldId: preceding[0].id, operator: "equals", value: "" } : undefined })} /></label>
        {!preceding.length && <p className="studio-muted">Add a field before this one to use it as a condition.</p>}
        {rule && <><label className="studio-label">Action<select className="studio-control" value={rule.action ?? "show"} onChange={(event) => update({ action: event.target.value as "show" | "hide" })}><option value="show">Show when matched</option><option value="hide">Hide when matched</option></select></label><label className="studio-label">Dependent field<select className="studio-control" value={rule.fieldId} onChange={(event) => update({ fieldId: event.target.value })}>{preceding.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
            <label className="studio-label">Condition<select className="studio-control" value={rule.operator} onChange={(event) => update({ operator: event.target.value as FieldCondition["operator"] })}><option value="equals">Equals</option><option value="notEquals">Does not equal</option><option value="contains">Contains</option><option value="notEmpty">Is not empty</option></select></label>
            {rule.operator !== "notEmpty" && <label className="studio-label">Comparison value{values && rule.operator !== "contains" ? <select aria-label="Comparison value" className="studio-control" value={rule.value} onChange={(event) => update({ value: event.target.value })}><option value="">Choose a value</option>{!values.includes(rule.value) && rule.value && <option value={rule.value}>{rule.value} (unavailable)</option>}{values.map((value, index) => <option key={index} value={value}>{value}</option>)}</select> : <input aria-label="Comparison value" className="studio-control" value={rule.value} onChange={(event) => update({ value: event.target.value })} />}</label>}
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-xs leading-relaxed text-emerald-900"><strong>Rule summary</strong><p className="mt-1">{rule.action === "hide" ? "Hide" : "Show"} “{field.label}” when “{source?.label || "unavailable field"}” {rule.operator === "notEmpty" ? "has an answer" : rule.operator === "notEquals" ? "does not equal" : rule.operator === "contains" ? "contains" : "equals"}{rule.operator !== "notEmpty" && <> “{rule.value || "…"}”</>}.</p></div>
            <p className="studio-muted">Hidden fields are excluded from validation and test submissions. Moving a field before its dependency clears its rule.</p>
        </>}
    </>;
}
