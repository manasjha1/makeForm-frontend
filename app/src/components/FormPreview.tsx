import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { FormTemplate } from "../lib/form-types";
import { inspectFormLayout } from "../lib/form-layout";
import {
  initialAnswers,
  visibleFields,
  type Answers,
} from "../lib/studio-model";
import { validateAnswers, type UploadInfo } from "../lib/form-validation";
import { Button } from "./ui/button";
import PreviewUpload from "./builder/PreviewUpload";
import PreviewSuccess from "./builder/PreviewSuccess";
import CustomSelect from "./ui/custom-select";
import { RotateCcw, Send, Trash2, SlidersHorizontal, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { FieldLabelHeader } from "../lib/field-icons";

export const formControlClass =
  "w-full min-h-12 rounded-xl border border-[#e1e3e4] bg-[#f8f9fa] px-4 py-3 text-sm sm:text-base text-[#191c1d] placeholder:text-[#8d8ba0] outline-none transition-all duration-150 hover:border-outline-variant focus:border-primary-container focus:bg-white focus:ring-3 focus:ring-primary-container/15 aria-invalid:border-error";

export default function FormPreview({ form }: { form: FormTemplate }) {
  const prefix = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const restartFocus = useRef(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [answers, setAnswers] = useState<Answers>(() =>
    initialAnswers(form.fields),
  );
  const [files, setFiles] = useState<Record<string, UploadInfo | undefined>>(
    {},
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(
    null,
  );
  const [attempt, setAttempt] = useState(0);
  const [validationStarted, setValidationStarted] = useState(false);
  const [demoErrors, setDemoErrors] = useState(false);
  const visible = visibleFields(form.fields, answers);
  useEffect(() => {
    if (validationStarted)
      setErrors(
        validateAnswers(visibleFields(form.fields, answers), answers, files),
      );
  }, [answers, files, form.fields, validationStarted]);
  const displayedErrors: Record<string, string> = demoErrors
    ? Object.fromEntries(
      visible.map((field) => [
        field.id,
        field.errorMessage || "Example validation error.",
      ]),
    )
    : errors;
  const visibleErrors = visible.filter((field) => displayedErrors[field.id]);
  const focusField = (id: string) => {
    const target = formRef.current?.elements.namedItem(id);
    if (target instanceof HTMLElement) target.focus();
    else if (target instanceof RadioNodeList)
      (target[0] as HTMLElement)?.focus();
  };
  useEffect(() => {
    if (!restartFocus.current) return;
    restartFocus.current = false;
    const first = visibleFields(form.fields, initialAnswers(form.fields))[0];
    if (first) focusField(first.id);
    else formRef.current?.focus();
  }, [attempt]);
  const update = (id: string, value: Answers[string]) => {
    setAnswers((current) => ({ ...current, [id]: value }));
    setSubmitted(null);
  };

  const layout = useMemo(() => inspectFormLayout(form.fields), [form.fields]);

  const isFormDirty = useMemo(() => {
    const init = initialAnswers(form.fields);
    const hasAnswerChanged = Object.entries(answers).some(([key, val]) => {
      const defaultVal = init[key];
      if (Array.isArray(val)) {
        return val.length > 0;
      }
      return val !== defaultVal && val !== "" && val !== false;
    });
    const hasFiles = Object.values(files).some(Boolean);
    return hasAnswerChanged || hasFiles;
  }, [answers, files, form.fields]);

  const handleResetForm = () => {
    restartFocus.current = true;
    setDemoErrors(false);
    setAnswers(initialAnswers(form.fields));
    setFiles({});
    setErrors({});
    setValidationStarted(false);
    setSubmitted(null);
    setAttempt((value) => value + 1);
    formRef.current?.reset();
  };

  return (
    <form
      ref={formRef}
      tabIndex={-1}
      noValidate
      className={`form-preview ${layout.cardClass} min-w-0 overflow-hidden rounded-3xl border border-[#e1e3e4] bg-white shadow-[0_25px_60px_-15px_rgba(53,37,205,0.08),0_8px_20px_-6px_rgba(25,28,29,0.04)] transition-all duration-300`}
      onSubmit={(event) => {
        event.preventDefault();
        setDemoErrors(false);
        setValidationStarted(true);
        const next = validateAnswers(visible, answers, files);
        setErrors(next);
        setSubmitted(null);
        if (Object.keys(next).length) {
          focusField(Object.keys(next)[0]);
          return;
        }
        setSubmitted(
          Object.fromEntries(
            visible.map((field) => [
              field.id,
              field.type === "file"
                ? (files[field.id] ?? null)
                : (answers[field.id] ?? ""),
            ]),
          ),
        );
      }}
    >
      {/* Redesigned Premium Header matching reference image */}
      <div className="border-b border-[#e1e3e4] bg-white px-6 py-6 sm:px-8 sm:py-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary-fixed/70 border border-[#c3c0ff] text-[#3525cd] shadow-2xs">
              <SlidersHorizontal className="size-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="font-heading text-xl font-bold tracking-tight text-[#191c1d] sm:text-2xl">
                  {form.title || "Inspect Form States"}
                </h2>
                <span className="hidden sm:inline-flex rounded-full border border-[#c3c0ff] bg-primary-fixed/40 px-2.5 py-0.5 text-[11px] font-semibold text-[#3525cd]">
                  {layout.badgeLabel} &bull; {layout.fieldsCount}{" "}
                  {layout.fieldsCount === 1 ? "field" : "fields"}
                </span>
              </div>
              <p className="mt-1 text-sm text-on-surface-variant">
                {form.description || "Preview and manage how your form looks and behaves."}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-pressed={demoErrors}
            onClick={() => {
              setDemoErrors(!demoErrors);
              setSubmitted(null);
            }}
            className="self-start sm:self-auto gap-2 rounded-xl border-[#c3c0ff] bg-white px-4 py-2.5 text-xs font-semibold text-[#3525cd] hover:bg-primary-fixed/30 hover:border-[#3525cd] shadow-2xs transition-all cursor-pointer"
          >
            <Sparkles className="size-3.5 text-[#3525cd]" />
            {demoErrors ? "Hide Example Errors" : "Show Example Errors"}
          </Button>
        </div>
      </div>

      <div className="space-y-6 p-6 sm:p-8 lg:p-10">
        {visibleErrors.length > 0 && (
          <section
            aria-label="Validation summary"
            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800"
          >
            <h3 className="text-sm font-semibold">
              {demoErrors
                ? "Example error styling — your answers are unchanged"
                : `Check ${visibleErrors.length} ${visibleErrors.length === 1 ? "field" : "fields"} before continuing`}
            </h3>
            <ul className="mt-2 space-y-1">
              {visibleErrors.map((field) => (
                <li key={field.id}>
                  <button
                    type="button"
                    className="text-left text-xs underline underline-offset-2 hover:text-red-900 cursor-pointer"
                    onClick={() => focusField(field.id)}
                  >
                    {field.label}: {displayedErrors[field.id]}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className={layout.gridClass}>
          {visible.map((field) => {
            const id = `${prefix}-${field.id}`;
            const props = {
              id,
              name: field.id,
              required: field.required,
              className: formControlClass,
              "aria-invalid": !!displayedErrors[field.id],
              "aria-describedby":
                [
                  field.helpText ? `${id}-help` : null,
                  displayedErrors[field.id] ? `${id}-error` : null,
                ]
                  .filter(Boolean)
                  .join(" ") || undefined,
            };
            const value =
              typeof answers[field.id] === "string"
                ? (answers[field.id] as string)
                : "";
            const choices =
              field.type === "radio" ||
              (field.type === "checkbox" && !!field.options?.length);

            return (
              <div
                key={field.id}
                className={`min-w-0 space-y-1.5 ${layout.getFieldSpanClass(field)}`}
              >
                {choices ? (
                  <div className="min-w-0">
                    <FieldLabelHeader field={field} />
                    <div className="grid gap-2.5">
                      {field.options?.map((option, index) => {
                        const isChecked =
                          field.type === "radio"
                            ? value === option
                            : Array.isArray(answers[field.id]) &&
                            (answers[field.id] as string[]).includes(option);
                        return (
                          <label
                            key={index}
                            className={`flex min-h-11.5 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm sm:text-base shadow-2xs transition-all ${
                              isChecked
                                ? "border-primary-container bg-primary-fixed/25 font-medium text-[#191c1d] ring-1 ring-primary-container/30"
                                : "border-[#e1e3e4] bg-[#f8f9fa] text-[#191c1d] hover:border-outline-variant hover:bg-primary-fixed/10"
                            }`}
                          >
                            <input
                              type={field.type}
                              name={field.id}
                              className="size-4 shrink-0 cursor-pointer accent-[#3525cd]"
                              aria-invalid={!!displayedErrors[field.id]}
                              aria-describedby={props["aria-describedby"]}
                              checked={isChecked}
                              onChange={(event) => {
                                const current = Array.isArray(answers[field.id])
                                  ? (answers[field.id] as string[])
                                  : [];
                                update(
                                  field.id,
                                  field.type === "radio"
                                    ? option
                                    : event.target.checked
                                      ? [...current, option]
                                      : current.filter(
                                        (item) => item !== option,
                                      ),
                                );
                              }}
                            />
                            <span className="min-w-0 flex-1 whitespace-normal wrap-break-word">
                              {option}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ) : field.type === "checkbox" ? (
                  <div className="min-w-0">
                    <FieldLabelHeader field={field} htmlFor={id} />
                    <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-[#e1e3e4] bg-[#f8f9fa] px-4 py-3 text-sm sm:text-base font-medium shadow-2xs transition-all hover:border-outline-variant hover:bg-primary-fixed/10">
                      <input
                        {...props}
                        type="checkbox"
                        className="size-4.5 rounded-md border-outline-variant text-[#3525cd] accent-[#3525cd] cursor-pointer"
                        checked={answers[field.id] === true}
                        onChange={(event) =>
                          update(field.id, event.target.checked)
                        }
                      />
                      <span className="text-[#191c1d]">
                        {field.placeholder || field.label}
                      </span>
                    </label>
                  </div>
                ) : (
                  <>
                    <FieldLabelHeader field={field} htmlFor={id} />
                    {field.helpText && (
                      <p
                        id={`${id}-help`}
                        className="text-xs leading-relaxed text-on-surface-variant mb-1.5"
                      >
                        {field.helpText}
                      </p>
                    )}
                    {field.type === "textarea" ? (
                      <textarea
                        {...props}
                        rows={4}
                        value={value}
                        placeholder={field.placeholder || "Share your suggestions..."}
                        onChange={(event) =>
                          update(field.id, event.target.value)
                        }
                        className="w-full min-h-30 rounded-xl border border-[#e1e3e4] bg-[#f8f9fa] p-4 text-sm sm:text-base text-[#191c1d] placeholder:text-[#8d8ba0] outline-none transition-all duration-150 hover:border-outline-variant focus:border-primary-container focus:bg-white focus:ring-3 focus:ring-primary-container/15 resize-y aria-invalid:border-error"
                      />
                    ) : field.type === "select" ? (
                      <CustomSelect
                        id={id}
                        name={field.id}
                        value={value}
                        onChange={(val) => update(field.id, val)}
                        options={field.options || []}
                        placeholder={field.placeholder || "Choose an option"}
                        error={!!displayedErrors[field.id]}
                        required={field.required}
                      />
                    ) : field.type === "file" ? (
                      <PreviewUpload
                        key={attempt}
                        file={files[field.id]}
                        field={field}
                        id={id}
                        invalid={!!displayedErrors[field.id]}
                        onChange={(file) => {
                          setFiles((current) => ({
                            ...current,
                            [field.id]: file,
                          }));
                          update(field.id, file?.name ?? "");
                        }}
                      />
                    ) : (
                      <input
                        {...props}
                        type={field.type}
                        value={value}
                        step={
                          field.type === "number"
                            ? (field.step ?? "any")
                            : undefined
                        }
                        placeholder={
                          field.placeholder ||
                          (field.type === "number"
                            ? "Enter number"
                            : field.type === "email"
                            ? "Enter your email"
                            : "Enter text")
                        }
                        min={field.min}
                        max={field.max}
                        onChange={(event) =>
                          update(field.id, event.target.value)
                        }
                      />
                    )}
                  </>
                )}
                {field.helpText && choices && (
                  <p
                    id={`${id}-help`}
                    className="text-xs leading-relaxed text-on-surface-variant"
                  >
                    {field.helpText}
                  </p>
                )}
                <p
                  id={`${id}-error`}
                  role={displayedErrors[field.id] ? "alert" : undefined}
                  className="text-xs text-error font-medium"
                >
                  {displayedErrors[field.id]}
                </p>
              </div>
            );
          })}
          <div className="col-span-full flex flex-col gap-3 pt-6 border-t border-[#e1e3e4] sm:flex-row sm:items-center sm:gap-4">
            <Button
              type="submit"
              className="rounded-xl bg-linear-to-r from-[#3525cd] to-primary-container px-7 py-3 text-sm sm:text-base font-semibold text-white shadow-[0_8px_20px_-4px_rgba(53,37,205,0.35)] hover:shadow-[0_10px_24px_-4px_rgba(53,37,205,0.45)] hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer min-h-11.5"
            >
              <Send className="size-4" />
              Submit Form
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!isFormDirty}
              onClick={() => setIsResetModalOpen(true)}
              className="rounded-xl border border-[#e1e3e4] bg-white px-5 py-3 text-sm sm:text-base font-medium text-on-surface-variant hover:border-red-200 hover:bg-red-50/50 hover:text-error shadow-2xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed min-h-11.5"
            >
              <Trash2 className="size-4" />
              Clear form
            </Button>
          </div>
          {submitted && (
            <div className="col-span-full">
              <PreviewSuccess
                response={submitted}
                onRestart={() => {
                  restartFocus.current = true;
                  setDemoErrors(false);
                  setAnswers(initialAnswers(form.fields));
                  setFiles({});
                  setErrors({});
                  setValidationStarted(false);
                  setSubmitted(null);
                  setAttempt((value) => value + 1);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Reset Form Confirmation Modal */}
      {isResetModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-reset-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#e1e3e4] bg-white p-6 shadow-[0_20px_50px_rgba(25,28,29,0.15)] animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3.5">
              {/* <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-error border border-red-100">
                <RotateCcw className="size-5" />
              </div> */}
              <div className="flex-1 min-w-0">
                <h3
                  id="preview-reset-modal-title"
                  className="text-lg font-bold text-[#191c1d] font-heading"
                >
                  Are you sure you want to clear all inputs?
                </h3>
                <p className="mt-1.5 text-sm text-on-surface-variant leading-relaxed">
                  Your form information and attached files will be lost if you
                  continue.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsResetModalOpen(false)}
                className="w-full sm:w-auto border-[#e1e3e4] text-[#191c1d] hover:bg-surface-container-low font-medium"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  handleResetForm();
                  setIsResetModalOpen(false);
                  toast.success("All filled inputs have been reset.");
                }}
                className="w-full sm:w-auto bg-error text-white hover:bg-on-error-container shadow-xs font-semibold"
              >
                Yes, Reset Form
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
