import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import {
  CheckCircle2,
  AlertCircle,
  FileText,
  Mail,
  Send,
  RefreshCw,
  Sparkles,
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
  type PublicFormDetail,
} from "~/src/services/forms";
import makeFormLogo from "~/assests/makeForm_logo.png";
import CustomSelect from "~/src/components/ui/custom-select";

export function meta() {
  return [
    { title: "Fill Form | makeForm" },
    { name: "description", content: "Submit your response to this makeForm form." },
  ];
}

export default function PublicForm() {
  const { slug } = useParams<{ slug: string }>();
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

  useEffect(() => {
    if (!slug) {
      setError("No form link specified.");
      setIsLoading(false);
      return;
    }

    loadForm(slug);
  }, [slug]);

  const loadForm = async (formSlug: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPublicForm(formSlug);
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
      setAnswers(initialAnswers);
    } catch (err: any) {
      setError(
        err?.message || "This form could not be found or is no longer accepting responses."
      );
    } finally {
      setIsLoading(false);
    }
  };

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

    setIsSubmitting(true);
    try {
      const payloadAnswers = form.fields.map((f) => ({
        fieldId: f.id,
        value: answers[f.id] ?? null,
      }));

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

      await submitPublicFormResponse(slug, payloadAnswers);

      // Record summary for confirmation screen
      setSubmittedAnswers(
        form.fields.map((f) => ({
          label: f.label,
          value: answers[f.id],
        }))
      );
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
    const initialAnswers: Record<string, any> = {};
    form.fields.forEach((f) => {
      initialAnswers[f.id] = f.type === "CHECKBOX" ? [] : "";
    });
    setAnswers(initialAnswers);
    setFieldErrors({});
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1C2925] flex flex-col justify-between">
      <Toaster position="top-right" />

      {/* Top Brand Bar */}
      <header className="w-full border-b border-[#E2E8E4] bg-white px-4 py-3 shadow-xs">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2" aria-label="makeForm home">
            <img className="h-10 w-28 object-contain" src={makeFormLogo} alt="makeForm" />
          </Link>
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
            Public Form
          </span>
        </div>
      </header>

      {/* Form Content */}
      <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12 flex-1">
        {isLoading ? (
          <Card className="border-[#E2E8E4] bg-white p-12 text-center shadow-sm">
            <RefreshCw className="mx-auto size-8 text-emerald-700 animate-spin mb-3" />
            <h2 className="text-lg font-bold text-gray-800">Loading form...</h2>
            <p className="text-xs text-gray-500 mt-1">Please wait while the form is loaded.</p>
          </Card>
        ) : error ? (
          <Card className="border-[#E2E8E4] bg-white p-8 text-center shadow-sm">
            <AlertCircle className="mx-auto size-12 text-amber-600 mb-3" />
            <h2 className="text-xl font-bold text-gray-900">Form Unavailable</h2>
            <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">{error}</p>
            <div className="mt-6">
              <Button asChild variant="outline" className="border-gray-300">
                <Link to="/">Back to makeForm</Link>
              </Button>
            </div>
          </Card>
        ) : isSubmitted ? (
          /* Submission Success Screen */
          <Card className="border-[#E2E8E4] bg-white shadow-md overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="h-2 bg-gradient-to-r from-emerald-600 to-teal-500" />
            <CardHeader className="text-center pt-8 pb-4">
              <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 ring-8 ring-emerald-50">
                <CheckCircle2 className="size-10" />
              </div>
              <CardTitle className="text-2xl font-black text-[#1C2925]">
                Response Submitted!
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 max-w-md mx-auto mt-2">
                Thank you! Your submission for <strong className="text-gray-900">{form?.title}</strong> has been successfully received and recorded.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 sm:px-8 space-y-6">
              {/* Email notification alert banner */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-emerald-900 flex items-start gap-3">
                <Mail className="size-5 shrink-0 text-emerald-700 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-emerald-950">Email Confirmation Sent</p>
                  <p className="text-emerald-800 leading-relaxed">
                    {submittedEmail
                      ? `A copy of your submission has been emailed to ${submittedEmail}. The form organizer has also been notified.`
                      : "A confirmation notification has been dispatched to the registered form organizer."}
                  </p>
                </div>
              </div>

              {/* Answers Summary Box */}
              <div className="rounded-xl border border-gray-200 bg-[#FAF9F6] p-4 text-xs space-y-2.5">
                <p className="font-bold uppercase tracking-wider text-gray-500 text-[11px]">
                  Submitted Answers Summary
                </p>
                <div className="divide-y divide-gray-200">
                  {submittedAnswers.map((item, idx) => (
                    <div key={idx} className="py-2 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                      <span className="font-semibold text-gray-700 sm:w-1/2">{item.label}</span>
                      <span className="text-gray-900 font-mono sm:w-1/2 sm:text-right break-words">
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

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button
                  onClick={handleResetForm}
                  variant="outline"
                  className="w-full sm:w-auto border-gray-300 text-gray-700"
                >
                  Submit another response
                </Button>
                <Button
                  asChild
                  className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white"
                >
                  <Link to="/">Create your own form on makeForm</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Active Form Fill-out Form */
          <Card className="border-[#E2E8E4] bg-white shadow-sm overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-500" />
            <CardHeader className="border-b border-[#E2E8E4] bg-[#FAF9F6] px-6 py-5">
              <CardTitle className="text-2xl sm:text-3xl font-extrabold text-[#1C2925] tracking-tight">
                {form?.title}
              </CardTitle>
              {form?.description && (
                <CardDescription className="text-sm text-gray-600 mt-1.5 leading-relaxed">
                  {form.description}
                </CardDescription>
              )}
            </CardHeader>

            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {form?.fields.map((field) => {
                  const error = fieldErrors[field.id];
                  const config = field.config || {};
                  const options: string[] = Array.isArray(config.options) ? config.options : [];

                  return (
                    <div key={field.id} className="space-y-1.5">
                      <label className="block text-sm font-semibold text-gray-800">
                        {field.label}
                        {field.required && (
                          <span className="text-red-600 ml-1 font-bold" title="Required">*</span>
                        )}
                      </label>

                      {field.description && (
                        <p className="text-xs text-gray-500">{field.description}</p>
                      )}

                      {/* Field Type Specific Controls */}
                      {field.type === "TEXTAREA" ? (
                        <textarea
                          rows={4}
                          value={answers[field.id] || ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder={field.placeholder || "Enter your response..."}
                          className={`w-full rounded-lg border px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                            error
                              ? "border-red-400 focus:ring-red-300"
                              : "border-gray-200 focus:border-emerald-600 focus:ring-emerald-100"
                          }`}
                        />
                      ) : field.type === "SELECT" ? (
                        <select
                          value={answers[field.id] || ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                            error
                              ? "border-red-400 focus:ring-red-300"
                              : "border-gray-200 focus:border-emerald-600 focus:ring-emerald-100"
                          }`}
                        >
                          <option value="">
                            {field.placeholder || "Select an option..."}
                          </option>
                          {options.map((opt, i) => (
                            <option key={i} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : field.type === "RADIO" ? (
                        <div className="space-y-2 pt-1">
                          {options.map((opt, i) => (
                            <label
                              key={i}
                              className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name={`radio-${field.id}`}
                                value={opt}
                                checked={answers[field.id] === opt}
                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                className="size-4 text-emerald-700 focus:ring-emerald-500"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      ) : field.type === "CHECKBOX" ? (
                        <div className="space-y-2 pt-1">
                          {options.map((opt, i) => {
                            const isChecked = Array.isArray(answers[field.id]) && answers[field.id].includes(opt);
                            return (
                              <label
                                key={i}
                                className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  value={opt}
                                  checked={isChecked}
                                  onChange={(e) =>
                                    handleCheckboxChange(field.id, opt, e.target.checked)
                                  }
                                  className="size-4 rounded text-emerald-700 focus:ring-emerald-500"
                                />
                                <span>{opt}</span>
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
                          className={`w-full rounded-lg border px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                            error
                              ? "border-red-400 focus:ring-red-300"
                              : "border-gray-200 focus:border-emerald-600 focus:ring-emerald-100"
                          }`}
                        />
                      )}

                      {error && (
                        <p className="text-xs font-medium text-red-600">{error}</p>
                      )}
                    </div>
                  );
                })}

                <div className="pt-4 border-t border-gray-100">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 px-8 shadow-sm flex items-center justify-center gap-2"
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
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#E2E8E4] bg-white py-4 text-center text-xs text-gray-500">
        <div className="mx-auto flex max-w-2xl items-center justify-center gap-2">
          <span>Powered by</span>
          <Link to="/" className="font-semibold text-emerald-800 hover:underline">
            makeForm
          </Link>
          <span>&bull; Intelligent Drag &amp; Drop Form Builder</span>
        </div>
      </footer>
    </div>
  );
}
