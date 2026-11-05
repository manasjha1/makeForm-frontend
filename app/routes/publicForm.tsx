import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router";
import {
  CheckCircle2,
  AlertCircle,
  FileText,
  Mail,
  Send,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "~/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/src/components/ui/card";
import {
  fetchPublicForm,
  submitPublicFormResponse,
  uploadPublicFormFile,
  type PublicFormDetail,
} from "~/src/services/forms";
import makeFormLogo from "~/assests/makeForm_indigo_logo.png";
import CustomSelect from "~/src/components/ui/custom-select";

export function meta() {
  return [
    { title: "Fill Form | makeForm" },
    { name: "description", content: "Submit your response to this makeForm form." },
  ];
}

export default function PublicForm() {
  const { adminId, slug } = useParams<{ adminId?: string; slug?: string }>();
  const [form, setForm] = useState<PublicFormDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form answer state: { [fieldId]: value }
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedAnswers, setSubmittedAnswers] = useState<Array<{ label: string; value: any }>>([]);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [uploadingFields, setUploadingFields] = useState<Record<string, boolean>>({});
  const [draftInitializedFor, setDraftInitializedFor] = useState<string | null>(null);
  const [draftStorageError, setDraftStorageError] = useState<string | null>(null);
  const formElementRef = useRef<HTMLFormElement>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const draftKey = form ? `makeform-public-draft:${form.id}` : null;

  useEffect(() => {
    if (!slug) {
      setError("No form link specified.");
      setIsLoading(false);
      return;
    }

    loadForm(slug, adminId);
  }, [slug, adminId]);

  const loadForm = async (formSlug: string, formAdminId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPublicForm(formSlug, formAdminId);
      setForm(data);
      // Initialize default values
      const initialAnswers: Record<string, any> = {};
      data.fields.forEach((f) => {
        if (f.type === "CHECKBOX") {
          initialAnswers[f.id] = [];
        } else {
          initialAnswers[f.id] = "";
        }
      });
      try {
        const savedDraft = sessionStorage.getItem(`makeform-public-draft:${data.id}`);
        if (savedDraft) {
          const parsedDraft: unknown = JSON.parse(savedDraft);
          if (parsedDraft && typeof parsedDraft === "object" && !Array.isArray(parsedDraft)) {
            for (const field of data.fields) {
              const savedValue = (parsedDraft as Record<string, unknown>)[field.id];
              if (field.type === "CHECKBOX" && Array.isArray(savedValue)) {
                initialAnswers[field.id] = savedValue.filter((value): value is string => typeof value === "string");
              } else if (field.type === "FILE" && savedValue && typeof savedValue === "object") {
                const fileAnswer = savedValue as { url?: unknown; name?: unknown; size?: unknown };
                if (typeof fileAnswer.url === "string" && typeof fileAnswer.name === "string" && typeof fileAnswer.size === "number") {
                  initialAnswers[field.id] = fileAnswer;
                }
              } else if (typeof savedValue === "string") {
                initialAnswers[field.id] = savedValue;
              }
            }
          }
        }
      } catch {
        setDraftStorageError("This browser could not restore your saved form answers. Avoid refreshing while completing this form.");
      }
      setAnswers(initialAnswers);
      setDraftInitializedFor(data.id);
    } catch (err: any) {
      setError(
        err?.message || "This form could not be found or is no longer accepting responses."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!form || !draftKey || draftInitializedFor !== form.id || isSubmitted) return;
    try {
      sessionStorage.setItem(draftKey, JSON.stringify(answers));
      setDraftStorageError(null);
    } catch {
      setDraftStorageError("This browser could not save your form answers. Avoid refreshing while completing this form.");
    }
  }, [answers, draftInitializedFor, draftKey, form, isSubmitted]);

  const hasAnswers = Object.values(answers).some((value) =>
    Array.isArray(value) ? value.length > 0 : value !== "" && value !== null && value !== undefined,
  );
  const hasActiveUpload = Object.values(uploadingFields).some(Boolean);

  useEffect(() => {
    if ((!hasAnswers && !hasActiveUpload) || isSubmitted) return;
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [hasActiveUpload, hasAnswers, isSubmitted]);

  const handleInputChange = (fieldId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
    // Clear validation error when typing
    if (fieldErrors[fieldId]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const handleFileChange = async (fieldId: string, file?: File) => {
    if (!file || !form || !slug) {
      handleInputChange(fieldId, "");
      return;
    }

    const field = form.fields.find((item) => item.id === fieldId);
    if (!field) return;
    const maxFileSize = Number(field.config?.maxFileSize);
    const acceptedExtensions = typeof field.config?.accept === "string"
      ? field.config.accept.split(",").map((item: string) => item.trim().toLowerCase()).filter((item: string) => item.startsWith("."))
      : [];
    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (maxFileSize > 0 && file.size > maxFileSize * 1024 * 1024) {
      setFieldErrors((current) => ({ ...current, [fieldId]: `File must be no larger than ${maxFileSize} MB` }));
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setFieldErrors((current) => ({ ...current, [fieldId]: "File must be no larger than 25 MB" }));
      return;
    }
    if (acceptedExtensions.length > 0 && !acceptedExtensions.includes(extension)) {
      setFieldErrors((current) => ({ ...current, [fieldId]: "Please choose a file in an accepted format" }));
      return;
    }

    setFieldErrors((current) => {
      const next = { ...current };
      delete next[fieldId];
      return next;
    });
    handleInputChange(fieldId, "");
    setUploadingFields((current) => ({ ...current, [fieldId]: true }));
    try {
      const uploadedFile = await uploadPublicFormFile(slug, fieldId, file, adminId || form.userId);
      handleInputChange(fieldId, uploadedFile);
    } catch (err: any) {
      toast.error(err?.message || "File upload failed. Please try again.");
    } finally {
      setUploadingFields((current) => ({ ...current, [fieldId]: false }));
    }
  };

  const handleCheckboxChange = (fieldId: string, option: string, checked: boolean) => {
    const current = Array.isArray(answers[fieldId]) ? [...answers[fieldId]] : [];
    const next = checked
      ? [...current, option]
      : current.filter((item: string) => item !== option);
    handleInputChange(fieldId, next);
  };

  const validateInputs = (): boolean => {
    if (!form) return false;
    const errors: Record<string, string> = {};

    form.fields.forEach((field) => {
      const val = answers[field.id];
      const isMissing =
        val === undefined ||
        val === null ||
        val === "" ||
        (Array.isArray(val) && val.length === 0);

      if (field.required && isMissing) {
        errors[field.id] = `${field.label} is required`;
        return;
      }

      if (!isMissing) {
        if (field.type === "EMAIL" && typeof val === "string") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(val.trim())) {
            errors[field.id] = "Please enter a valid email address";
          }
        }
        if (field.type === "NUMBER") {
          const num = Number(val);
          if (isNaN(num)) {
            errors[field.id] = "Please enter a valid number";
          }
        }
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !slug) return;

    if (!validateInputs()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    if (Object.values(uploadingFields).some(Boolean)) {
      toast.error("Please wait for file uploads to finish.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payloadAnswers = form.fields.map((field) => {
        const answer = answers[field.id];
        const value = field.type === "FILE" && answer && typeof answer === "object"
          ? answer.url
          : answer ?? null;
        return { fieldId: field.id, value };
      });

      // Find respondent email if provided
      let userEmail: string | null = null;
      form.fields.forEach((f) => {
        if (f.type === "EMAIL" || f.label.toLowerCase().includes("email")) {
          const val = answers[f.id];
          if (typeof val === "string" && val.includes("@")) {
            userEmail = val.trim();
          }
        }
      });
      setSubmittedEmail(userEmail);
      const effectiveAdminId = adminId || form?.userId;
      await submitPublicFormResponse(slug, payloadAnswers, effectiveAdminId);

      // Record summary for confirmation screen
      setSubmittedAnswers(
        form.fields.map((f) => ({
          label: f.label,
          value: f.type === "FILE" && answers[f.id] && typeof answers[f.id] === "object"
            ? answers[f.id].name
            : answers[f.id],
        }))
      );
      if (draftKey) {
        try {
          sessionStorage.removeItem(draftKey);
        } catch {
          setDraftStorageError("Your response was submitted, but this browser could not clear its saved draft.");
        }
      }
      setIsSubmitted(true);
      toast.success("Response recorded successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    if (!form) return;
    if (draftKey) {
      try {
        sessionStorage.removeItem(draftKey);
      } catch {
        setDraftStorageError("This browser could not clear the saved draft.");
      }
    }
    formElementRef.current?.reset();
    const initialAnswers: Record<string, any> = {};
    form.fields.forEach((f) => {
      initialAnswers[f.id] = f.type === "CHECKBOX" ? [] : "";
    });
    setAnswers(initialAnswers);
    setFieldErrors({});
    setIsSubmitted(false);
    setDraftInitializedFor(form.id);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d] flex flex-col justify-between">
      <Toaster position="top-right" />

      {/* Top Brand Bar */}
      <header className="w-full border-b border-[#e1e3e4] bg-white px-4 py-3 shadow-[0_1px_3px_0_rgba(25,28,29,0.04)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2" aria-label="makeForm home">
            <img className="h-10 w-28 object-contain" src={makeFormLogo} alt="makeForm" />
          </Link>
          <div className="flex items-center gap-2">
            {form?.user?.name && (
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-surface-container-low px-2.5 py-0.5 text-xs text-on-surface-variant border border-[#e1e3e4]">
                Admin: <strong className="font-semibold text-[#191c1d]">{form.user.name}</strong>
              </span>
            )}
            <span className="rounded-full bg-primary-fixed px-2.5 py-0.5 text-xs font-semibold text-on-primary-fixed border border-[#c3c0ff]">
              Verified Form
            </span>
          </div>
        </div>
      </header>

      {/* Form Content */}
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12 flex-1">
        {isLoading ? (
          <Card className="mx-auto max-w-2xl border-[#e1e3e4] bg-white p-12 text-center shadow-[0_4px_6px_-1px_rgba(25,28,29,0.05),0_2px_4px_-2px_rgba(25,28,29,0.04)] rounded-xl">
            <RefreshCw className="mx-auto size-8 text-[#3525cd] animate-spin mb-3" />
            <h2 className="text-lg font-bold text-[#191c1d] font-heading">Loading form...</h2>
            <p className="text-xs text-on-surface-variant mt-1">Please wait while the form is loaded.</p>
          </Card>
        ) : error ? (
          <Card className="mx-auto max-w-2xl border-[#e1e3e4] bg-white p-8 text-center shadow-[0_4px_6px_-1px_rgba(25,28,29,0.05),0_2px_4px_-2px_rgba(25,28,29,0.04)] rounded-xl">
            <AlertCircle className="mx-auto size-12 text-error mb-3" />
            <h2 className="text-xl font-bold text-[#191c1d] font-heading">Form Unavailable</h2>
            <p className="mt-2 text-sm text-on-surface-variant max-w-md mx-auto">{error}</p>
            <div className="mt-6">
              <Button asChild variant="outline" className="border-[#e1e3e4] hover:bg-surface-container-low">
                <Link to="/">Back to makeForm</Link>
              </Button>
            </div>
          </Card>
        ) : isSubmitted ? (
          /* Submission Success Screen */
          <Card className="mx-auto max-w-2xl border-[#e1e3e4] bg-white shadow-[0_10px_25px_-5px_rgba(25,28,29,0.08),0_4px_10px_-3px_rgba(25,28,29,0.04)] overflow-hidden rounded-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="h-2 bg-linear-to-r from-primary-container to-[#06b6d4]" />
            <CardHeader className="text-center pt-8 pb-4">
              <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-primary-fixed text-[#3525cd] ring-8 ring-primary-fixed/50">
                <CheckCircle2 className="size-10" />
              </div>
              <CardTitle className="text-2xl font-black text-[#191c1d] font-heading">
                Response Submitted!
              </CardTitle>
              <CardDescription className="text-sm text-on-surface-variant max-w-md mx-auto mt-2">
                Thank you! Your submission for <strong className="text-[#191c1d]">{form?.title}</strong> has been successfully received and recorded.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 sm:px-8 space-y-6">
              {/* Email notification alert banner */}
              <div className="rounded-xl border border-[#c3c0ff] bg-primary-fixed/40 p-4 text-xs text-on-primary-fixed flex items-start gap-3">
                <Mail className="size-5 shrink-0 text-[#3525cd] mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-on-tertiary-fixed">Email Confirmation Sent</p>
                  <p className="text-on-primary-fixed leading-relaxed">
                    {submittedEmail
                      ? `A copy of your submission has been emailed to ${submittedEmail}. The form organizer has also been notified.`
                      : "A confirmation notification has been dispatched to the registered form organizer."}
                  </p>
                </div>
              </div>

              {/* Answers Summary Box */}
              <div className="rounded-xl border border-[#e1e3e4] bg-[#f8f9fa] p-4 text-xs space-y-2.5">
                <p className="font-bold uppercase tracking-wider text-on-surface-variant text-[11px]">
                  Submitted Answers Summary
                </p>
                <div className="divide-y divide-[#e1e3e4]">
                  {submittedAnswers.map((item, idx) => (
                    <div key={idx} className="py-2 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                      <span className="font-semibold text-[#191c1d] sm:w-1/2">{item.label}</span>
                      <span className="text-on-surface-variant font-mono sm:w-1/2 sm:text-right wrap-break-word">
                        {item.value === null || item.value === undefined || item.value === ""
                          ? "-"
                          : Array.isArray(item.value)
                            ? item.value.join(", ")
                            : String(item.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-2">
                <Button
                  onClick={handleResetForm}
                  variant="outline"
                  className="w-full sm:w-auto border-[#e1e3e4] hover:bg-surface-container-low text-[#191c1d]"
                >
                  Submit another response
                </Button>
                <Button
                  asChild
                  className="w-full sm:w-auto bg-[#3525cd] hover:bg-primary-container text-white shadow-sm"
                >
                  <Link to="/">Create your own form on makeForm</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Active Form Fill-out Form */
          <Card className="border-[#e1e3e4] bg-white shadow-[0_4px_20px_-2px_rgba(25,28,29,0.06),0_2px_6px_-1px_rgba(25,28,29,0.04)] overflow-hidden rounded-2xl">
            <div className="h-2 bg-linear-to-r from-primary-container to-[#06b6d4]" />
            <CardHeader className="border-b border-[#e1e3e4] bg-[#f8f9fa] px-6 py-5">
              <CardTitle className="text-xl font-extrabold text-[#191c1d] tracking-tight font-heading sm:text-2xl lg:text-3xl">
                {form?.title}
              </CardTitle>
              {form?.description && (
                <CardDescription className="mt-1.5 text-sm leading-relaxed text-on-surface-variant sm:text-base lg:text-lg">
                  {form.description}
                </CardDescription>
              )}
            </CardHeader>

            <div className="mx-3 mt-4 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-3 text-xs leading-snug text-amber-950 sm:mx-6 sm:gap-3 sm:px-4 sm:text-sm lg:mx-8">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <div>
                <p className="font-semibold">Please do not refresh this page while filling out the form.</p>
                <p className="mt-1 text-xs sm:text-sm">
                  Answers and uploaded files are saved in this browser tab and restored if the page reloads.
                </p>
                {draftStorageError && <p className="mt-1 text-[0.8em] font-medium">{draftStorageError}</p>}
              </div>
            </div>

            <CardContent className="p-4 sm:p-6 lg:p-8">
              <form ref={formElementRef} noValidate onSubmit={handleSubmit} className="grid min-w-0 grid-cols-1 gap-x-6 gap-y-5 sm:gap-y-6 lg:grid-cols-2">
                {form?.fields.map((field) => {
                  const error = fieldErrors[field.id];
                  const config = field.config || {};
                  const options: string[] = Array.isArray(config.options) ? config.options : [];

                  return (
                    <div key={field.id} className="min-w-0 space-y-1.5">
                      <label className="block text-sm font-semibold leading-snug text-[#191c1d] sm:text-[15px] lg:text-base">
                        {field.label}
                        {field.required && (
                          <span className="text-error ml-1 font-bold" title="Required">*</span>
                        )}
                      </label>

                      {field.description && (
                        <p className="text-xs leading-relaxed text-on-surface-variant sm:text-sm lg:text-base">{field.description}</p>
                      )}

                      {/* Field Type Specific Controls */}
                      {field.type === "FILE" ? (
                        <div className={`rounded-lg border bg-[#f8f9fa] p-3 ${error ? "border-error" : "border-[#e1e3e4]"}`}>
                          <input
                            id={`field-${field.id}`}
                            name={field.id}
                            ref={(element) => { fileInputRefs.current[field.id] = element; }}
                            type="file"
                            accept={config.accept || undefined}
                            aria-invalid={!!error}
                            aria-describedby={error ? `field-${field.id}-error` : undefined}
                            disabled={uploadingFields[field.id]}
                            onChange={(e) => handleFileChange(field.id, e.target.files?.[0])}
                            className="w-full min-w-0 text-sm file:mr-2 file:rounded-md file:border-0 file:bg-primary-fixed file:px-2.5 file:py-2 file:text-sm file:font-medium file:text-on-primary-fixed sm:file:mr-3 sm:file:px-3 sm:text-base sm:file:text-base"
                          />
                          {!field.description && (config.accept || config.maxFileSize) && (
                            <p className="mt-2 text-xs leading-relaxed text-on-surface-variant sm:text-sm">
                              {config.accept ? `Accepted formats: ${config.accept}` : "Any file type"}
                              {config.maxFileSize ? ` up to ${config.maxFileSize}MB` : ""}
                            </p>
                          )}
                          {uploadingFields[field.id] && (
                            <p className="mt-2 text-sm font-medium text-[#3525cd]">Uploading file...</p>
                          )}
                          {answers[field.id] && typeof answers[field.id] === "object" && (
                            <div className="mt-2 flex items-center justify-between gap-3 rounded-md border border-[#e1e3e4] bg-white p-2.5">
                              <p className="min-w-0 break-all text-xs text-on-surface-variant sm:text-sm">
                                Uploaded: {answers[field.id].name} ({(answers[field.id].size / 1024).toFixed(1)} KB)
                              </p>
                              <button
                                type="button"
                                disabled={isSubmitting || uploadingFields[field.id]}
                                aria-label={`Remove uploaded file ${answers[field.id].name}`}
                                onClick={() => {
                                  const input = fileInputRefs.current[field.id];
                                  if (input) input.value = "";
                                  handleInputChange(field.id, "");
                                }}
                                className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-error transition-colors hover:bg-error/10 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                              >
                                <Trash2 className="size-4" />
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      ) : field.type === "TEXTAREA" ? (
                        <textarea
                          rows={4}
                          value={answers[field.id] || ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder={field.placeholder || "Enter your response..."}
                          className={`w-full rounded-lg border px-3.5 py-2.5 text-base transition-all focus:outline-none focus:ring-2 shadow-xs sm:text-sm lg:text-base ${error
                            ? "border-error focus:ring-error/20"
                            : "border-[#e1e3e4] bg-[#f8f9fa] text-[#191c1d] focus:border-primary-container focus:ring-primary-container/20 focus:bg-white"
                            }`}
                        />
                      ) : field.type === "SELECT" ? (
                        <CustomSelect
                          id={`field-${field.id}`}
                          name={field.id}
                          value={answers[field.id] || ""}
                          onChange={(val) => handleInputChange(field.id, val)}
                          options={options}
                          placeholder={field.placeholder || "Select an option..."}
                          error={!!error}
                          required={field.required}
                          className="[&>button]:text-base sm:[&>button]:text-sm lg:[&>button]:text-base"
                        />
                      ) : field.type === "RADIO" ? (
                        <div className="grid gap-2 pt-1">
                          {options.map((opt, i) => {
                            const isChecked = answers[field.id] === opt;
                            return (
                              <label
                                key={i}
                                className={`flex items-start gap-2.5 rounded-lg border p-2.5 text-sm leading-snug transition-all cursor-pointer sm:items-center sm:gap-3 sm:p-3 sm:text-[15px] lg:text-base ${isChecked
                                  ? "border-primary-container bg-primary-fixed/35 text-on-primary-fixed font-medium ring-1 ring-primary-container/30 shadow-xs"
                                  : "border-[#e1e3e4] bg-[#f8f9fa] text-[#191c1d] hover:border-outline-variant hover:bg-white"
                                  }`}
                              >
                                <input
                                  type="radio"
                                  name={`radio-${field.id}`}
                                  value={opt}
                                  checked={isChecked}
                                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                                  className="size-4 shrink-0 accent-[#3525cd] cursor-pointer"
                                />
                                <span className="min-w-0 flex-1 whitespace-normal break-words">{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                      ) : field.type === "CHECKBOX" ? (
                        <div className="grid gap-2 pt-1">
                          {options.map((opt, i) => {
                            const isChecked =
                              Array.isArray(answers[field.id]) &&
                              answers[field.id].includes(opt);
                            return (
                              <label
                                key={i}
                                className={`flex items-start gap-2.5 rounded-lg border p-2.5 text-sm leading-snug transition-all cursor-pointer sm:items-center sm:gap-3 sm:p-3 sm:text-[15px] lg:text-base ${isChecked
                                  ? "border-primary-container bg-primary-fixed/35 text-on-primary-fixed font-medium ring-1 ring-primary-container/30 shadow-xs"
                                  : "border-[#e1e3e4] bg-[#f8f9fa] text-[#191c1d] hover:border-outline-variant hover:bg-white"
                                  }`}
                              >
                                <input
                                  type="checkbox"
                                  value={opt}
                                  checked={isChecked}
                                  onChange={(e) =>
                                    handleCheckboxChange(field.id, opt, e.target.checked)
                                  }
                                  className="size-4 shrink-0 rounded accent-[#3525cd] cursor-pointer"
                                />
                                <span className="min-w-0 flex-1 whitespace-normal break-words">{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                      ) : (
                        <input
                          type={
                            field.type === "EMAIL"
                              ? "email"
                              : field.type === "NUMBER"
                                ? "number"
                                : field.type === "PHONE"
                                  ? "tel"
                                  : field.type === "DATE"
                                    ? "date"
                                    : field.type === "URL"
                                      ? "url"
                                      : "text"
                          }
                          value={answers[field.id] || ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder={field.placeholder || ""}
                          min={config.min}
                          max={config.max}
                          minLength={config.minLength}
                          maxLength={config.maxLength}
                          className={`w-full rounded-lg border px-3.5 py-2.5 text-base transition-all focus:outline-none focus:ring-2 shadow-xs sm:text-sm lg:text-base ${error
                            ? "border-error focus:ring-error/20"
                            : "border-[#e1e3e4] bg-[#f8f9fa] text-[#191c1d] focus:border-primary-container focus:ring-primary-container/20 focus:bg-white"
                            }`}
                        />
                      )}

                      {error && (
                        <p id={field.type === "FILE" ? `field-${field.id}-error` : undefined} className="text-xs font-medium leading-relaxed text-error sm:text-sm">{error}</p>
                      )}
                    </div>
                  );
                })}

                <div className="flex flex-col gap-3 border-t border-[#e1e3e4] pt-4 sm:flex-row sm:items-center sm:gap-4 lg:col-span-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting || Object.values(uploadingFields).some(Boolean)}
                    className="w-full rounded-lg bg-[#3525cd] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_0_rgba(79,70,229,0.35)] hover:bg-primary-container sm:w-auto sm:px-8 sm:text-[15px] lg:text-base"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="size-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="size-4" />
                        Submit Response
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting || Object.values(uploadingFields).some(Boolean)}
                    onClick={handleResetForm}
                    className="w-full gap-2 rounded-lg border-error/30 px-5 py-2.5 text-sm font-semibold text-error hover:border-error/50 hover:bg-error/10 sm:w-auto sm:text-[15px] lg:text-base"
                  >
                    <Trash2 className="size-4" />
                    Clear form
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#e1e3e4] bg-white px-3 py-4 text-center text-[11px] leading-relaxed text-on-surface-variant sm:px-4 sm:text-xs lg:text-sm">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span>Powered by</span>
          <Link to="/" className="font-semibold text-[#3525cd] hover:underline">
            makeForm
          </Link>
          <span>&bull; Intelligent Drag &amp; Drop Form Builder</span>
        </div>
      </footer>
    </div>
  );
}
