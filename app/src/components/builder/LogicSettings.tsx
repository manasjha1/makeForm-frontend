import { GitBranch } from "lucide-react";
import type { FieldCondition, FormField } from "../../lib/form-types";
import type { SettingsProps } from "./GeneralSettings";

export default function LogicSettings({ field, fields, onChange }: SettingsProps & { fields: FormField[] }) {
    const preceding = fields.slice(0, fields.findIndex((item) => item.id === field.id)).filter((item) => item.type !== "file");
    const rule = field.condition;
    const update = (patch: Partial<FieldCondition>) => rule && onChange({ condition: { ...rule, ...patch } });
    return <><div><GitBranch size={20} className="mb-3 text-emerald-700" /><h3 className="font-semibold">Conditional Logic</h3><p className="studio-muted mt-2">Show this field only when a previous answer matches your rule.</p></div>
        <label className="studio-toggle-row"><span className="studio-label">Enable condition</span><input className="studio-toggle" type="checkbox" disabled={!preceding.length} checked={!!rule} onChange={(event) => onChange({ condition: event.target.checked ? { fieldId: preceding[0].id, operator: "equals", value: "" } : undefined })} /></label>
        {!preceding.length && <p className="studio-muted">Add a field before this one to use it as a condition.</p>}
        {rule && <><label className="studio-label">Show field if<select className="studio-control" value={rule.fieldId} onChange={(event) => update({ fieldId: event.target.value })}>{preceding.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
            <label className="studio-label">Condition<select className="studio-control" value={rule.operator} onChange={(event) => update({ operator: event.target.value as FieldCondition["operator"] })}><option value="equals">Equals</option><option value="notEquals">Does not equal</option><option value="contains">Contains</option><option value="notEmpty">Is not empty</option></select></label>
            {rule.operator !== "notEmpty" && <label className="studio-label">Comparison value<input className="studio-control" value={rule.value} onChange={(event) => update({ value: event.target.value })} /><span className="studio-muted">Use true or false for a single checkbox.</span></label>}
            <p className="studio-muted">Hidden fields are excluded from validation and test submissions. Moving a field before its dependency clears its rule.</p>
        </>}
    </>;
}
