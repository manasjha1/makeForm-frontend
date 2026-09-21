import { useRef, useState } from "react";
import { Upload, FileCheck2, X } from "lucide-react";
import type { FormField } from "../../lib/form-types";
import type { UploadInfo } from "../../lib/form-validation";

export default function PreviewUpload({ field, id, invalid, onChange }: { field: FormField; id: string; invalid: boolean; onChange: (file?: UploadInfo) => void }) {
    const input = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<UploadInfo>();
    const [dragging, setDragging] = useState(false);
    const select = (next?: File) => {
        const info = next ? { name: next.name, size: next.size, type: next.type } : undefined;
        setFile(info); onChange(info);
    };
    return <div className={`rounded-xl border border-dashed p-5 text-center transition-colors ${invalid ? "border-red-500 bg-red-50" : dragging ? "border-emerald-700 bg-emerald-50" : "border-[#cbd5ce] bg-[#FAF9F6]"}`}
        onDragOver={(event) => { if (event.dataTransfer.types.includes("Files")) { event.preventDefault(); setDragging(true); } }}
        onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false); }}
        onDrop={(event) => { event.preventDefault(); setDragging(false); if (event.dataTransfer.files.length) { if (input.current) input.current.value = ""; select(event.dataTransfer.files[0]); } }}>
        {file ? <FileCheck2 size={24} className="mx-auto mb-3 text-emerald-700" /> : <Upload size={24} className="mx-auto mb-3 text-emerald-700" />}
        <label htmlFor={id} className="block cursor-pointer text-sm font-medium text-[#1C2925]">{file ? "Replace selected file" : "Drop a file here or click to upload"}</label>
        <p className="mt-1 text-xs text-[#6B7872]">{field.accept || "Any file type"}{field.maxFileSize ? ` · Up to ${field.maxFileSize} MB` : ""}</p>
        <input ref={input} id={id} name={field.id} aria-label={field.label} aria-invalid={invalid} aria-describedby={id + "-help " + id + "-error"} type="file" accept={field.accept} className="mt-3 w-full min-w-0 rounded-lg text-xs file:mr-3 file:rounded-md file:border-0 file:bg-emerald-100 file:px-3 file:py-2 file:text-emerald-800" onChange={(event) => select(event.target.files?.[0])} />
        {file && <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-emerald-100 bg-white p-3 text-left"><span className="min-w-0"><span className="block break-all text-xs font-medium">{file.name}</span><span className="text-xs text-[#6B7872]">{(file.size / 1024).toFixed(1)} KB · Local preview only</span></span><button type="button" className="rounded p-2 text-[#6B7872] hover:bg-red-50 hover:text-red-700" aria-label={"Remove " + file.name} onClick={() => { if (input.current) input.current.value = ""; setFile(undefined); onChange(undefined); }}><X size={15} /></button></div>}
    </div>;
}
