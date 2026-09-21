import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import type { FieldType, FormTemplate } from "../../lib/form-types";
import FieldCard from "./FieldCard";
import { fieldCatalog } from "./field-catalog";
import { dropTargetIndex } from "../../lib/studio-model";

type Props = { form: FormTemplate; selectedId: string | null; onSelect: (id: string) => void; onChange: (form: FormTemplate) => void; onAdd: (type: FieldType, index?: number) => void; onMove: (id: string, index: number) => void; onDuplicate: (id: string) => void; onDelete: (id: string) => void };
export default function FormCanvas({ form, selectedId, onSelect, onChange, onAdd, onMove, onDuplicate, onDelete }: Props) {
    const [editingHeader, setEditingHeader] = useState(false);
    const [dropIndex, setDropIndex] = useState<number | null>(null);
    useEffect(() => {
        const clear = () => setDropIndex(null);
        window.addEventListener("dragend", clear);
        window.addEventListener("drop", clear);
        return () => { window.removeEventListener("dragend", clear); window.removeEventListener("drop", clear); };
    }, []);
    const dragOver = (event: React.DragEvent, index: number) => {
        if (!event.dataTransfer.types.some((type) => type === "application/makeform-type" || type === "application/makeform-id")) return;
        event.preventDefault(); setDropIndex(index);
    };
    const drop = (event: React.DragEvent, index: number) => {
        event.preventDefault(); event.stopPropagation(); setDropIndex(null);
        const type = event.dataTransfer.getData("application/makeform-type") as FieldType;
        const id = event.dataTransfer.getData("application/makeform-id");
        if (fieldCatalog.some((field) => field.type === type)) onAdd(type, index);
        else if (id) onMove(id, dropTargetIndex(form.fields, id, index));
    };
    return <main id="studio-canvas" tabIndex={-1} className="studio-canvas" aria-label="Form canvas" onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDropIndex(null); }}>
        <div className="studio-canvas-inner">
            <section className="studio-form-header">
                <div className="flex items-center justify-between"><span className="studio-eyebrow">Form header <span className="studio-badge ml-2">{form.fields.length} Fields</span></span><button className="studio-icon-button" aria-label="Edit form header" aria-expanded={editingHeader} onClick={() => setEditingHeader(!editingHeader)}><Pencil size={14} /></button></div>
                {editingHeader ? <div className="mt-4 space-y-3"><label className="studio-label">Form title<input autoFocus className="studio-control" value={form.title} onChange={(event) => onChange({ ...form, title: event.target.value })} /></label><label className="studio-label">Description<textarea className="studio-control" rows={3} value={form.description} onChange={(event) => onChange({ ...form, description: event.target.value })} /></label><button className="studio-button" onClick={() => setEditingHeader(false)}>Done</button></div> : <><h1>{form.title || "Untitled form"}</h1><p>{form.description}</p></>}
            </section>
            {form.fields.map((field, index) => <FieldCard key={field.id} field={field} index={index} count={form.fields.length} selected={field.id === selectedId} dropTarget={dropIndex === index} onSelect={() => onSelect(field.id)} onMove={(target) => onMove(field.id, target)} onDuplicate={() => onDuplicate(field.id)} onDelete={() => onDelete(field.id)} onDragOver={(event) => dragOver(event, index)} onDrop={(event) => drop(event, index)} />)}
            <div className="studio-quick-add" onDragOver={(event) => dragOver(event, form.fields.length)} onDrop={(event) => drop(event, form.fields.length)} style={dropIndex === form.fields.length ? { borderColor: "#047857", background: "#d1fae5" } : undefined}>
                {!form.fields.length && <><Plus size={24} className="mx-auto mb-3 text-emerald-700" /><h2 className="mb-2 font-semibold">Your form starts here</h2><p className="studio-muted mb-4">Drag a field here, or choose one from the palette.</p></>}
                <span className="studio-muted">Quick Add Field:</span><div className="studio-actions">{(["text", "email", "select", "date", "textarea"] as FieldType[]).map((type) => <button className="studio-button" key={type} onClick={() => onAdd(type)}>+ {type}</button>)}</div>
            </div>
        </div>
    </main>;
}
