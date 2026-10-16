import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import {
  CheckCircle2,
  LayoutGrid,
  Eye,
  ArrowLeft,
  Share2,
  Copy,
  ExternalLink,
  X,
  RefreshCw,
  BarChart2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import FormPreview from "~/src/components/FormPreview";
import TemplateGallery from "~/src/components/TemplateGallery";
import FieldsPalette from "~/src/components/builder/FieldsPalette";
import FormCanvas from "~/src/components/builder/FormCanvas";
import FieldSettings from "~/src/components/builder/FieldSettings";
import Header from "~/src/components/Headers";
import StudioFooter from "~/src/components/builder/StudioFooter";
import StudioPanelNav from "~/src/components/builder/StudioPanelNav";
import { newField } from "~/src/components/builder/field-catalog";
import { findTemplate } from "~/src/data/form-templates";
import { studioForm, blankForm } from "~/src/data/studio-form";
import {
  createForm,
  type FieldType,
  type FormField,
  type FormTemplate,
} from "~/src/lib/form-types";
import { readDraft, saveDraft } from "~/src/lib/form-draft";
import {
  duplicateField,
  updateFormField,
  moveField,
  normalizeConditions,
  removeField,
} from "~/src/lib/studio-model";
import { saveAndPublishForm } from "~/src/services/forms";
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
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const templateId = params.get("template");
  const galleryRequested = params.get("view") === "templates";
  const [form, setForm] = useState<FormTemplate | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [gallery, setGallery] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [history, setHistory] = useState<FormTemplate[]>([]);
  const [future, setFuture] = useState<FormTemplate[]>([]);
  const [message, setMessage] = useState("");

  const [isPublishing, setIsPublishing] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [publicShareUrl, setPublicShareUrl] = useState<string>("");
  const [publishedSlug, setPublishedSlug] = useState<string>("");
  useEffect(() => {
    const draft = readDraft();
    const template =
      templateId === studioForm.id
        ? studioForm
        : templateId === blankForm.id
          ? blankForm
          : findTemplate(templateId);
    const next = template
      ? draft?.id === template.id
        ? draft
        : createForm(template)
      : templateId
        ? null
        : (draft ?? createForm(studioForm));
    setForm(next);
    setSelectedId(next?.fields[0]?.id ?? null);
    setGallery(!next || galleryRequested);
    setPreview(false);
    setHistory([]);
    setFuture([]);
    setMessage(
      templateId && !next
        ? "That template is unavailable. Choose one below."
        : "",
    );
    if (next) setSaveError(!saveDraft(next));
  }, [templateId]);
  useEffect(() => {
    if (galleryRequested) setGallery(true);
  }, [galleryRequested]);
  const change = (next: FormTemplate) => {
    if (form) setHistory((current) => [...current.slice(-29), form]);
    setFuture([]);
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
  const updateField = (patch: Partial<FormField>) => {
    if (form && selectedId) change(updateFormField(form, selectedId, patch));
  };
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
    if (form) setFuture((current) => [...current.slice(-29), form]);
    setForm(previous);
    setHistory((current) => current.slice(0, -1));
    setSelectedId((current) =>
      previous.fields.some((field) => field.id === current)
        ? current
        : (previous.fields[0]?.id ?? null),
    );
    setSaveError(!saveDraft(previous));
    setMessage("Last edit undone.");
  };
  const redo = () => {
    const next = future.at(-1);
    if (!next || !form) return;
    setHistory((current) => [...current.slice(-29), form]);
    setFuture((current) => current.slice(0, -1));
    setForm(next);
    setSelectedId((current) =>
      next.fields.some((field) => field.id === current)
        ? current
        : (next.fields[0]?.id ?? null),
    );
    setSaveError(!saveDraft(next));
    setMessage("Edit reapplied.");
  };

  const handlePublishAndShare = async () => {
    if (!form) return;
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error(
        "Please sign in to publish and generate a permanent public link!",
      );
      setTimeout(() => navigate("/sign-in"), 1200);
      return;
    }

    if (form.fields.length === 0) {
      toast.error(
        "Please add at least one field before generating a public link.",
      );
      return;
    }

    setIsPublishing(true);
    try {
      const result = await saveAndPublishForm(form);
      const slug =
        result?.slug ||
        (form.title
          ? form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
          : "form");
      const url = `${window.location.origin}/form/${slug}`;
      setPublishedSlug(slug);
      setPublicShareUrl(url);
      setShareModalOpen(true);
      toast.success("Form published! Public share link generated.");
    } catch (err: any) {
      toast.error(
        err?.message ||
          "Failed to publish form. Please check your backend connection.",
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const copyShareLink = () => {
    if (!publicShareUrl) return;
    navigator.clipboard.writeText(publicShareUrl);
    toast.success("Public link copied to clipboard!");
  };
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        preview ||
        gallery ||
        !(event.ctrlKey || event.metaKey) ||
        event.altKey ||
        (target instanceof HTMLElement &&
          (target.isContentEditable ||
            target.closest("input, textarea, select")))
      )
        return;
      const key = event.key.toLowerCase();
      if (key === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      } else if (key === "y" && event.ctrlKey) {
        event.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [form, history, future, preview, gallery]);
  return (
    <div className="studio">
      <Toaster position="top-right" />
      <Header
        count={form?.fields.length ?? 0}
        preview={preview}
        onPreview={showPreview}
        onEdit={() => {
          setPreview(false);
          setGallery(!form);
        }}
        onReset={() => {
          const template =
            form?.id === blankForm.id
              ? blankForm
              : (findTemplate(form?.id ?? null) ?? studioForm);
          change(createForm(template));
          setSelectedId(template.fields[0]?.id ?? null);
          setPreview(false);
          setGallery(false);
          setMessage("Template restored. Use Undo to recover your edits.");
        }}
        onUndo={undo}
        canUndo={!!history.length}
        onRedo={redo}
        canRedo={!!future.length}
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
          <section className="studio-quick-add mt-8">
            <h2 className="text-lg font-semibold">Prefer a blank canvas?</h2>
            <p className="studio-muted my-3">
              Start from scratch and add only the questions you need.
            </p>
            <button
              className="studio-button primary"
              onClick={() => {
                change(createForm(blankForm));
                setSelectedId(null);
                setParams({ template: blankForm.id });
                setGallery(false);
                setPreview(false);
              }}
            >
              Start a blank form
            </button>
          </section>
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
          <StudioPanelNav />
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
              if (index < 0) return;
              const field = duplicateField(form.fields[index]);
              const fields = [...form.fields];
              fields.splice(index + 1, 0, field);
              change({ ...form, fields });
              setSelectedId(field.id);
            }}
            onDelete={(id) => {
              const index = form.fields.findIndex((field) => field.id === id);
              if (index < 0) return;
              const next = removeField(form, id);
              change(next);
              if (selectedId === id)
                setSelectedId(
                  next.fields[Math.min(index, next.fields.length - 1)]?.id ??
                    null,
                );
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
            className="studio-button"
            disabled={!form}
            onClick={showPreview}
          >
            <Eye size={12} />
            Preview Form
          </button>
          <button
            className="studio-button"
            disabled={!form || isPublishing}
            onClick={handlePublishAndShare}
            style={{
              backgroundColor: "#047857",
              color: "#ffffff",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {isPublishing ? (
              <RefreshCw size={12} className="animate-spin" />
            ) : (
              <Share2 size={12} />
            )}
            Publish &amp; Share
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

      {/* Share Modal Dialog */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-gray-100">
            <button
              onClick={() => setShareModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                LIVE &amp; PUBLISHED
              </span>
            </div>

            <h3 className="text-xl font-black text-gray-900">
              Your Form is Live &amp; Ready to Share!
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Anyone with this link can fill out your form. After submission,
              responses and email confirmations will be sent automatically.
            </p>

            <div className="mt-5 space-y-3">
              <label className="text-xs font-semibold text-gray-700 block">
                Public Form Link:
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-[#FAF9F6] p-1.5 pl-3">
                <input
                  type="text"
                  readOnly
                  value={publicShareUrl}
                  className="w-full bg-transparent text-xs text-gray-900 font-mono focus:outline-none"
                />
                <button
                  onClick={copyShareLink}
                  className="shrink-0 flex items-center gap-1.5 rounded-md bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors"
                >
                  <Copy size={13} />
                  Copy Link
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                <Link
                  to={publicShareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  <ExternalLink size={14} />
                  Open Form in New Tab
                </Link>

                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  <BarChart2 size={14} />
                  View in Admin Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
