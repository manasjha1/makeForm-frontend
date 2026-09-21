import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { CheckCircle2, LayoutGrid, Eye, ArrowLeft } from "lucide-react";
import FormPreview from "~/src/components/FormPreview";
import TemplateGallery from "~/src/components/TemplateGallery";
import FieldsPalette from "~/src/components/builder/FieldsPalette";
import FormCanvas from "~/src/components/builder/FormCanvas";
import FieldSettings from "~/src/components/builder/FieldSettings";
import StudioHeader from "~/src/components/builder/StudioHeader";
import StudioFooter from "~/src/components/builder/StudioFooter";
import StudioPanelNav from "~/src/components/builder/StudioPanelNav";
import { newField } from "~/src/components/builder/field-catalog";
import { findTemplate } from "~/src/data/form-templates";
import { studioForm } from "~/src/data/studio-form";
import {
  createForm,
  type FieldType,
  type FormField,
  type FormTemplate,
} from "~/src/lib/form-types";
import { readDraft, saveDraft } from "~/src/lib/form-draft";
import {
  duplicateField,
  moveField,
  normalizeConditions,
  removeField,
} from "~/src/lib/studio-model";
import "~/src/components/builder/builder.css";

export function meta() {
  return [
    { title: "Form Studio | makeForm" },
    {
      name: "description",
      content: "Build and preview your form in the makeForm visual studio.",
    },
  ];
}

export default function FormBuilder() {
  const [params, setParams] = useSearchParams();
  const templateId = params.get("template");
  const [form, setForm] = useState<FormTemplate | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [gallery, setGallery] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [history, setHistory] = useState<FormTemplate[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const draft = readDraft();
    const template =
      templateId === studioForm.id ? studioForm : findTemplate(templateId);
    const next = template
      ? draft?.id === template.id
        ? draft
        : createForm(template)
      : templateId
        ? null
        : (draft ?? createForm(studioForm));
    setForm(next);
    setSelectedId(next?.fields[0]?.id ?? null);
    setGallery(!next);
    setPreview(false);
    setHistory([]);
    setMessage(
      templateId && !next
        ? "That template is unavailable. Choose one below."
        : "",
    );
    if (next) setSaveError(!saveDraft(next));
  }, [templateId]);
  const change = (next: FormTemplate) => {
    if (form) setHistory((current) => [...current.slice(-29), form]);
    const normalized = normalizeConditions(next);
    setForm(normalized);
    setSaveError(!saveDraft(normalized));
    setMessage("");
  };
  const add = (type: FieldType, index = form?.fields.length ?? 0) => {
    if (!form) return;
    const field = newField(type);
    const fields = [...form.fields];
    fields.splice(index, 0, field);
    change({ ...form, fields });
    setSelectedId(field.id);
    setMessage(`Added ${field.label} field.`);
  };
  const updateField = (patch: Partial<FormField>) =>
    form &&
    change({
      ...form,
      fields: form.fields.map((field) =>
        field.id === selectedId ? { ...field, ...patch } : field,
      ),
    });
  const showPreview = () => {
    if (form) {
      setSaveError(!saveDraft(form));
      setGallery(false);
      setPreview(true);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };
  const undo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setForm(previous);
    setHistory((current) => current.slice(0, -1));
    setSelectedId(previous.fields[0]?.id ?? null);
    setSaveError(!saveDraft(previous));
    setMessage("Last edit undone.");
  };
  return (
    <div className="studio">
      <StudioHeader
        count={form?.fields.length ?? 0}
        preview={preview}
        onPreview={showPreview}
        onEdit={() => {
          setPreview(false);
          setGallery(!form);
        }}
        onReset={() => {
          const template = findTemplate(form?.id ?? null) ?? studioForm;
          change(createForm(template));
          setSelectedId(template.fields[0]?.id ?? null);
          setPreview(false);
          setGallery(false);
          setMessage("Template restored. Use Undo to recover your edits.");
        }}
        onUndo={undo}
        canUndo={!!history.length}
      />
      {saveError && (
        <p role="alert" className="bg-red-50 px-6 py-3 text-sm text-red-800">
          Your browser could not save this draft. Keep this page open to
          preserve your current edits.
        </p>
      )}
      {gallery ? (
        <main className="mx-auto max-w-6xl px-5 py-8">
          {form && (
            <button
              className="studio-button mb-6"
              onClick={() => setGallery(false)}
            >
              <ArrowLeft size={14} />
              Back to editor
            </button>
          )}
          {message && (
            <p role="status" className="mb-4">
              {message}
            </p>
          )}
          <TemplateGallery
            onSelect={(template) => {
              if (templateId === template.id) {
                const next = createForm(template);
                change(next);
                setSelectedId(next.fields[0]?.id ?? null);
              } else setParams({ template: template.id });
              setGallery(false);
              setPreview(false);
            }}
          />
        </main>
      ) : !form ? (
        <main className="studio-empty" role="status">
          Loading your form studio…
        </main>
      ) : preview ? (
        <main className="studio-preview">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <button className="studio-button" onClick={() => setPreview(false)}>
              <ArrowLeft size={14} />
              Back to editor
            </button>
            <span className="studio-muted">Test your form before sharing</span>
          </div>
          <FormPreview key={JSON.stringify(form)} form={form} />
        </main>
      ) : (
        <div className="studio-workspace">
          <FieldsPalette onAdd={add} />
          <FormCanvas
            form={form}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onChange={change}
            onAdd={add}
            onMove={(id, index) => {
              const next = moveField(form, id, index);
              if (next !== form) change(next);
            }}
            onDuplicate={(id) => {
              const index = form.fields.findIndex((field) => field.id === id);
              const field = duplicateField(form.fields[index]);
              const fields = [...form.fields];
              fields.splice(index + 1, 0, field);
              change({ ...form, fields });
              setSelectedId(field.id);
            }}
            onDelete={(id) => {
              const next = removeField(form, id);
              change(next);
              if (selectedId === id) setSelectedId(next.fields[0]?.id ?? null);
              setMessage("Field removed. Use Undo to restore it.");
            }}
          />
          <FieldSettings
            key={selectedId}
            field={form.fields.find((field) => field.id === selectedId)}
            fields={form.fields}
            onChange={updateField}
          />
        </div>
      )}
      <div className="studio-status">
        <span role="status" className="flex items-center gap-2">
          <CheckCircle2 size={12} />
          {message ||
            (saveError ? "Draft not saved" : "Draft saved in this browser tab")}
        </span>
        <div className="studio-actions">
          <button
            className="studio-button"
            onClick={() => {
              setGallery(true);
              setPreview(false);
            }}
          >
            <LayoutGrid size={12} />
            Templates
          </button>
          <button
            className="studio-button primary"
            disabled={!form}
            onClick={showPreview}
          >
            <Eye size={12} />
            Preview Form
          </button>
        </div>
      </div>
      <StudioFooter
        onTemplates={() => {
          setGallery(true);
          setPreview(false);
          window.scrollTo({ top: 0 });
        }}
        onPreview={showPreview}
      />
    </div>
  );
}
