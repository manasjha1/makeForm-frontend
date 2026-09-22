import { ArrowUp, ArrowDown, Copy, Trash2, GripVertical, CheckCircle2, Upload, ChevronDown, CalendarDays, Check } from "lucide-react";
import type { FormField } from "../../lib/form-types";
import { useEffect, useRef } from "react";
import { fieldIcon } from "./field-catalog";

export function FieldSample({ field }: { field: FormField }) {
    if (field.type === "radio" || field.type === "checkbox") return <div>{(field.options?.length ? field.options : [field.label]).map((option, index) => {
        const checked = field.type === "radio" ? field.defaultValue === option : !field.options?.length && field.defaultValue === "true";
        return <div className="studio-mock-choice" key={index}><span className={`studio-choice-dot ${field.type === "checkbox" ? "square" : ""} ${checked ? "checked" : ""}`}>{checked && (field.type === "checkbox" ? <Check size={10} /> : <span />)}</span>{option || "Untitled option"}</div>;
    })}</div>;
    if (field.type === "file") return <div className="studio-upload"><Upload size={22} /><span>Drop files here or click to upload</span><small>{field.accept || "Any file type"}{field.maxFileSize ? ` up to ${field.maxFileSize}MB` : ""}</small></div>;
    if (field.type === "textarea") return <div className="studio-control min-h-20 whitespace-pre-wrap break-words text-[#6b7872]">{field.defaultValue || field.placeholder || "Enter your response..."}</div>;
    return <div className="studio-control flex items-center justify-between text-[#6b7872]">{field.defaultValue || field.placeholder || (field.type === "select" ? "Choose an option..." : field.type === "date" ? "YYYY-MM-DD" : "Enter a value...")}{field.type === "select" && <ChevronDown size={14} />}{field.type === "date" && <CalendarDays size={14} />}</div>;
}

type Props = { field: FormField; index: number; count: number; selected: boolean; dropTarget: boolean; onSelect: () => void; onMove: (target: number) => void; onDuplicate: () => void; onDelete: () => void; onDrop: (event: React.DragEvent) => void; onDragOver: (event: React.DragEvent) => void };
export default function FieldCard({ field, index, count, selected, dropTarget, onSelect, onMove, onDuplicate, onDelete, onDrop, onDragOver }: Props) {
    const Icon = fieldIcon(field.type);
    const card = useRef<HTMLElement>(null);
    useEffect(() => {
        if (!selected || !card.current || !window.matchMedia("(min-width:1024px)").matches) return;
        const canvas = card.current.closest(".studio-canvas");
        if (!canvas) return;
        const bounds = card.current.getBoundingClientRect();
        const viewport = canvas.getBoundingClientRect();
        if (bounds.top < viewport.top || bounds.bottom > viewport.bottom) card.current.scrollIntoView({ block: "nearest" });
    }, [selected]);
    return <article ref={card} aria-current={selected ? "true" : undefined} className={`studio-card ${selected ? "selected" : ""} ${dropTarget ? "drop-target" : ""}`} aria-label={`${field.label}, field ${index + 1}`} tabIndex={0} onFocus={onSelect} onClick={onSelect} onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onSelect(); } }} draggable onDragStart={(event) => { event.dataTransfer.setData("application/makeform-id", field.id); event.dataTransfer.effectAllowed = "move"; }} onDragOver={onDragOver} onDrop={onDrop}>
        <div className="studio-card-top"><span className="studio-card-kind"><GripVertical size={14} /><Icon size={13} />{field.type}<span className="opacity-60">#{index + 1}</span></span>
            <div className="flex" onClick={(event) => event.stopPropagation()}>
                <button className="studio-icon-button" aria-label={`Move ${field.label} up`} title="Move Up" disabled={index === 0} onClick={() => onMove(index - 1)}><ArrowUp size={14} /></button>
                <button className="studio-icon-button" aria-label={`Move ${field.label} down`} title="Move Down" disabled={index === count - 1} onClick={() => onMove(index + 1)}><ArrowDown size={14} /></button>
                <button className="studio-icon-button" aria-label={`Duplicate ${field.label}`} title="Duplicate Field" onClick={onDuplicate}><Copy size={14} /></button>
                <button className="studio-icon-button danger" aria-label={`Delete ${field.label}`} title="Delete Field" onClick={onDelete}><Trash2 size={14} /></button>
            </div>
        </div>
        <span className="studio-card-label">{field.label || "Untitled field"}{field.required && <span className="studio-required">*</span>}</span>
        {field.helpText && <p className="studio-muted">{field.helpText}</p>}
        <FieldSample field={field} />
        {field.condition && <p className="studio-muted mt-2">Conditional field</p>}
        {selected && <div className="studio-selected-note"><CheckCircle2 size={12} />Selected Field Card</div>}
    </article>;
}
