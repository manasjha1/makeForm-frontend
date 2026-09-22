import type { SettingsProps } from "./GeneralSettings";

export default function ValidationSettings({ field, onChange }: SettingsProps) {
    const numeric = field.type === "number";
    const text = ["text", "email", "tel", "textarea"].includes(field.type);
    const minKey = numeric ? "min" : "minLength";
    const maxKey = numeric ? "max" : "maxLength";
    const invalid = field[minKey] !== undefined && field[maxKey] !== undefined && field[minKey]! > field[maxKey]!;
    return <>
        <div><h3 className="font-semibold">Validation Rules</h3><p className="studio-muted mt-1">Rules are checked when testing your form.</p></div>
        {(numeric || text) && <>
            <label className="studio-label">{numeric ? "Minimum Value" : "Minimum Characters"}<input type="number" min={numeric ? undefined : 0} step={numeric ? "any" : 1} className="studio-control" value={field[minKey] ?? ""} onChange={(event) => onChange({ [minKey]: event.target.value === "" ? undefined : numeric ? Number(event.target.value) : Math.max(0, Math.floor(Number(event.target.value))) })} /></label>
            <label className="studio-label">{numeric ? "Maximum Value" : "Maximum Characters"}<input type="number" min={numeric ? undefined : 0} step={numeric ? "any" : 1} className="studio-control" value={field[maxKey] ?? ""} onChange={(event) => onChange({ [maxKey]: event.target.value === "" ? undefined : numeric ? Number(event.target.value) : Math.max(0, Math.floor(Number(event.target.value))) })} /></label>
            {invalid && <p role="alert" className="studio-error">Maximum must be greater than or equal to minimum.</p>}
        </>}
        {field.type === "file" && <><label className="studio-label">Accepted File Types<input className="studio-control" value={field.accept ?? ""} placeholder=".pdf,.png,.jpg" onChange={(event) => onChange({ accept: event.target.value })} /></label><label className="studio-label">Maximum File Size (MB)<input type="number" min="1" className="studio-control" value={field.maxFileSize ?? ""} onChange={(event) => onChange({ maxFileSize: event.target.value === "" ? undefined : Math.max(1, Number(event.target.value)) })} /></label></>}
        {numeric && <label className="studio-label">Step increment<input className="studio-control" type="number" min="0" step="any" placeholder="Any increment" value={field.step ?? ""} onChange={(event) => onChange({ step: Number(event.target.value) > 0 ? Number(event.target.value) : undefined })} /><span className="studio-muted">For example, 0.01 for currency or 5 for groups of five. Leave blank to allow any value.</span></label>}
        {!numeric && !text && field.type !== "file" && <p className="studio-muted">Use the General tab to make this field required. Choice fields accept the options you define.</p>}
        <label className="studio-label">Custom Error Message<textarea rows={3} className="studio-control" value={field.errorMessage ?? ""} placeholder="Please enter a valid response." onChange={(event) => onChange({ errorMessage: event.target.value })} /></label>
    </>;
}
