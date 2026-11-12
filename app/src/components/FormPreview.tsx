import { useEffect, useId, useRef, useState } from "react";
import type { FormTemplate } from "../lib/form-types";
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

export const formControlClass =
  "w-full rounded-lg border border-[#e1e3e4] bg-[#f8f9fa] px-3.5 py-2.5 text-sm text-[#191c1d] outline-none transition-all focus:border-[#4f46e5] focus:bg-white focus:ring-3 focus:ring-[#4f46e5]/20 aria-invalid:border-[#ba1a1a]";

export default function FormPreview({ form }: { form: FormTemplate }) {
  const prefix = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const restartFocus = useRef(false);
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

  return (
    <form
      ref={formRef}
      tabIndex={-1}
      noValidate
      className="form-preview min-w-0 overflow-hidden rounded-2xl border border-[#e1e3e4] bg-white shadow-[0_4px_20px_-2px_rgba(25,28,29,0.06),0_2px_6px_-1px_rgba(25,28,29,0.04)]"
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
      <div className="h-2 bg-linear-to-r from-primary-container to-[#06b6d4]" />
      <div className="border-b border-[#e1e3e4] bg-[#f8f9fa] px-6 py-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary-container">
          Live preview
        </p>
        <h2 className="wrap-break-word text-xl font-extrabold tracking-tight text-[#191c1d] sm:text-2xl lg:text-3xl">
          {form.title}
        </h2>
        {form.description && (
          <p className="mt-1.5 whitespace-pre-wrap wrap-break-words text-sm leading-relaxed text-on-surface-variant sm:text-base lg:text-lg">
            {form.description}
          </p>
        )}
      </div>
      <div className="space-y-5 p-4 sm:p-6 lg:p-8">
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-3 text-xs leading-snug text-amber-950 sm:px-4 sm:text-sm">
          <p className="font-semibold">This is a test preview.</p>
          <p className="mt-1">
            Fields marked * are required. Answers and files stay in this
            preview and are not uploaded or saved.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#e1e3e4] bg-[#f8f9fa] p-3 shadow-xs">
          <span className="text-xs text-on-surface-variant">Inspect form states</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-pressed={demoErrors}
            onClick={() => {
              setDemoErrors(!demoErrors);
              setSubmitted(null);
            }}
          >
            {demoErrors ? "Hide example errors" : "Show example errors"}
          </Button>
        </div>
        {visibleErrors.length > 0 && (
          <section
            aria-label="Validation summary"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"
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
                    className="text-left text-xs underline underline-offset-2"
                    onClick={() => focusField(field.id)}
                  >
                    {field.label}: {displayedErrors[field.id]}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
        <div className="grid min-w-0 grid-cols-1 gap-x-6 gap-y-5 sm:gap-y-6 lg:grid-cols-2">
          {visible.map((field) => {
            const id = `${prefix}-${field.id}`;
            const props = {
              id,
              name: field.id,
              required: field.required,
              className: formControlClass,
              "aria-invalid": !!displayedErrors[field.id],
              "aria-describedby": [
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
              <div key={field.id} className="min-w-0 space-y-1.5">
                {choices ? (
                  <fieldset className="min-w-0">
                    <legend className="mb-2 block text-sm font-semibold leading-snug text-[#191c1d] sm:text-[15px] lg:text-base">
                      {field.label}
                      {field.required && (
                        <span className="text-red-600"> *</span>
                      )}
                    </legend>
                    <div className="grid gap-2">
                      {field.options?.map((option, index) => {
                        const isChecked =
                          field.type === "radio"
                            ? value === option
                            : Array.isArray(answers[field.id]) &&
                              (answers[field.id] as string[]).includes(option);
                        return (
                          <label
                            key={index}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm shadow-xs transition-all ${
                              isChecked
                                ? "border-primary-container bg-primary-fixed/40 font-medium text-on-primary-fixed ring-1 ring-primary-container/20"
                                : "border-[#e1e3e4] bg-[#f8f9fa] text-[#191c1d] hover:border-[#c3c0ff] hover:bg-primary-fixed/20"
                            }`}
                          >
                            <input
                              type={field.type}
                              name={field.id}
                              className="size-4 shrink-0 cursor-pointer accent-primary-container"
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
                            <span className="truncate">{option}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                ) : field.type === "checkbox" ? (
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#e1e3e4] bg-[#f8f9fa] p-3 text-sm font-medium shadow-xs transition-all hover:border-[#c3c0ff]">
                    <input
                      {...props}
                      type="checkbox"
                      className="size-4 cursor-pointer accent-primary-container"
                      checked={answers[field.id] === true}
                      onChange={(event) =>
                        update(field.id, event.target.checked)
                      }
                    />
                    <span>
                      {field.label}
                      {field.required && " *"}
                    </span>
                  </label>
                ) : (
                  <>
                    <label
                      htmlFor={id}
                      className="block wrap-break-word text-sm font-semibold leading-snug text-[#191c1d] sm:text-[15px] lg:text-base"
                    >
                      {field.label}
                      {field.required && (
                        <span className="text-red-600"> *</span>
                      )}
                    </label>
                    {field.helpText && (
                      <p
                        id={`${id}-help`}
                        className="text-xs leading-relaxed text-on-surface-variant sm:text-sm"
                      >
                        {field.helpText}
                      </p>
                    )}
                    {field.type === "textarea" ? (
                      <textarea
                        {...props}
                        rows={4}
                        value={value}
                        placeholder={field.placeholder}
                        onChange={(event) =>
                          update(field.id, event.target.value)
                        }
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
                        placeholder={field.placeholder}
                        min={field.min}
                        max={field.max}
                        onChange={(event) =>
                          update(field.id, event.target.value)
                        }
                      />
                    )}
                  </>
                )}
                {(choices || field.type === "checkbox") && field.helpText && (
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
                  className="text-xs text-error"
                >
                  {displayedErrors[field.id]}
                </p>
              </div>
            );
          })}
          <Button
            type="submit"
            className="w-full bg-[#3525cd] text-white hover:bg-primary-container shadow-[0_4px_14px_0_rgba(79,70,229,0.3)] transition-all font-semibold lg:col-span-2"
          >
            Test submission
          </Button>
          {submitted && (
            <div className="lg:col-span-2">
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
    </form>
  );
}
