import { useState } from "react";
import { Plus, Search, Lightbulb, X } from "lucide-react";
import { fieldCatalog } from "./field-catalog";
import type { FieldType } from "../../lib/form-types";

export default function FieldsPalette({ onAdd }: { onAdd: (type: FieldType) => void }) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const fields = fieldCatalog.filter((field) => (category === "All" || field.category === category) && `${field.label} ${field.description}`.toLowerCase().includes(search.toLowerCase()));
    return <aside className="studio-panel studio-palette" aria-label="Fields palette">
        <div className="studio-panel-header">
            <div className="flex items-center justify-between gap-2"><h2>Fields Palette</h2><span className="studio-badge">9 Fields</span></div>
            <p className="studio-muted">Click or drag to add onto canvas</p>
            <div className="studio-search"><Search size={14} /><input className="studio-control !pr-9" aria-label="Search field types" placeholder="Search field types..." value={search} onChange={(event) => setSearch(event.target.value)} />{search && <button className="studio-search-clear" aria-label="Clear field search" onClick={() => setSearch("")}><X size={13} /></button>}</div>
            <div className="studio-tabs" aria-label="Field categories">{["All", "Basic", "Choice", "Advanced"].map((item) => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
        </div>
        <div className="studio-palette-list">{fields.map(({ type, label, category, description, icon: Icon }) => <button key={type} className="studio-palette-item" draggable onDragStart={(event) => { event.dataTransfer.setData("application/makeform-type", type); event.dataTransfer.effectAllowed = "copy"; }} onClick={() => onAdd(type)} aria-label={`Add ${label} field`}>
            <span className="studio-field-icon"><Icon size={17} /></span><span className="min-w-0 flex-1"><strong>{label}</strong><span className="studio-category">{category}</span><p>{description}</p></span><Plus size={14} className="shrink-0 text-[#6b7872]" />
        </button>)}{!fields.length && <div className="studio-empty"><Search size={24} className="mx-auto mb-3" /><p>No matching fields.</p><p className="studio-muted mt-2">Try another search or category.</p><button className="studio-button mt-4" onClick={() => { setSearch(""); setCategory("All"); }}>Show all fields</button></div>}</div>
        <p className="sr-only" role="status">{fields.length} field types available</p>
        <p className="studio-tip"><Lightbulb size={13} className="mb-2" />Tip: Select any card on the canvas to configure options &amp; validation</p>
    </aside>;
}
