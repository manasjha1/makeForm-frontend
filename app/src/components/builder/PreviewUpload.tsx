import { useRef, useState } from "react";
import { Upload, FileCheck2, X } from "lucide-react";
import type { FormField } from "../../lib/form-types";
import type { UploadInfo } from "../../lib/form-validation";

export default function PreviewUpload({
  field,
  id,
  invalid,
  file,
  onChange,
}: {
  file?: UploadInfo;
  field: FormField;
  id: string;
  invalid: boolean;
  onChange: (file?: UploadInfo) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const select = (next?: File) => {
    const info = next
      ? { name: next.name, size: next.size, type: next.type }
      : undefined;
    onChange(info);
  };
  return (
    <div
      className={`preview-upload min-w-0 rounded-xl border border-dashed p-4 sm:p-5 text-center transition-all ${
        invalid
          ? "border-[#ba1a1a] bg-red-50/70"
          : dragging
          ? "border-[#4f46e5] bg-[#e2dfff]/25 ring-2 ring-[#4f46e5]/20"
          : "border-[#c7c4d8] bg-[#f8f9fa] hover:border-[#3525cd]/50 hover:bg-[#e2dfff]/10"
      }`}
      onDragOver={(event) => {
        if (event.dataTransfer.types.includes("Files")) {
          event.preventDefault();
          setDragging(true);
        }
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        if (event.dataTransfer.files.length) {
          if (input.current) input.current.value = "";
          select(event.dataTransfer.files[0]);
        }
      }}
    >
      {file ? (
        <FileCheck2 size={24} className="mx-auto mb-2 text-[#3525cd]" />
      ) : (
        <Upload size={24} className="mx-auto mb-2 text-[#3525cd]" />
      )}
      <label
        htmlFor={id}
        className="block cursor-pointer text-sm font-semibold text-[#191c1d]"
      >
        {file ? "Replace selected file" : "Drop a file here or click to upload"}
      </label>
      <p className="mt-1 text-xs text-[#464555]">
        {field.accept || "Any file type"}
        {field.maxFileSize ? ` · Up to ${field.maxFileSize} MB` : ""}
      </p>
      <input
        ref={input}
        id={id}
        name={field.id}
        aria-label={field.label}
        aria-invalid={invalid}
        aria-describedby={id + "-help " + id + "-error"}
        type="file"
        required={field.required}
        accept={field.accept}
        className="mt-3 w-full min-w-0 text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-primary-fixed file:px-3 file:py-1.5 file:font-semibold file:text-on-primary-fixed hover:file:bg-[#c3c0ff] cursor-pointer"
        onChange={(event) => select(event.target.files?.[0])}
      />
      {file && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-[#e1e3e4] bg-white p-3 text-left shadow-2xs">
          <span className="min-w-0">
            <span className="block break-all text-xs font-semibold text-[#191c1d]">
              {file.name}
            </span>
            <span className="text-xs text-[#464555]">
              {(file.size / 1024).toFixed(1)} KB · Local preview only
            </span>
          </span>
          <button
            type="button"
            className="size-8 shrink-0 rounded-lg p-1 text-[#464555] hover:bg-red-50 hover:text-[#ba1a1a] transition-colors flex items-center justify-center cursor-pointer"
            aria-label={"Remove " + file.name}
            onClick={() => {
              if (input.current) input.current.value = "";
              onChange(undefined);
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
