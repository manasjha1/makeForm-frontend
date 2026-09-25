import type { FormField } from "./form-types";
import type { Answers } from "./studio-model";

export type UploadInfo = { name: string; size: number; type: string };
export function validateAnswers(fields: FormField[], answers: Answers, files: Record<string, UploadInfo | undefined> = {}): Record<string, string> {
    const errors: Record<string, string> = {};
    for (const field of fields) {
        const value = answers[field.id];
        const text = typeof value === "string" ? value : "";
        const empty = field.type === "file" ? !files[field.id] : Array.isArray(value) ? !value.length : !value || !String(value).trim();
        let error = field.required && empty ? "This field is required." : "";
        if (!empty) {
            if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) error = "Enter a valid email address.";
            if (field.type === "date") {
                const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
                const date = new Date(text + "T00:00:00Z");
                if (!match || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== text) error = "Enter a valid date.";
            }
            if (field.type === "number") {
                const number = Number(text);
                if (!Number.isFinite(number)) error = "Enter a valid number.";
                else if (field.min !== undefined && number < field.min) error = `Enter a value of at least ${field.min}.`;
                else if (field.max !== undefined && number > field.max) error = `Enter a value of at most ${field.max}.`;
                else if (field.step && field.step > 0) {
                    const steps = (number - (field.min ?? 0)) / field.step;
                    if (Math.abs(steps - Math.round(steps)) > 1e-7) error = `Use increments of ${field.step} starting at ${field.min ?? 0}.`;
                }
            }
            if (["text", "email", "tel", "textarea"].includes(field.type)) {
                if (field.minLength !== undefined && text.length < field.minLength) error = `Use at least ${field.minLength} characters.`;
                if (field.maxLength !== undefined && text.length > field.maxLength) error = `Use at most ${field.maxLength} characters.`;
            }
            if (["select", "radio"].includes(field.type) && !field.options?.includes(text)) error = "Choose an available option.";
            if (field.type === "checkbox" && Array.isArray(value) && value.some((item) => !field.options?.includes(item))) error = "Choose available options.";
            if (field.type === "file" && files[field.id]) {
                const file = files[field.id]!;
                if (field.maxFileSize && file.size > field.maxFileSize * 1024 * 1024) error = `Choose a file smaller than ${field.maxFileSize} MB.`;
                const accept = field.accept?.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
                if (accept?.length && !accept.some((item) => item.startsWith(".") ? file.name.toLowerCase().endsWith(item) : item.endsWith("/*") ? file.type.startsWith(item.slice(0, -1)) : file.type === item)) error = "Choose an accepted file type.";
            }
        }
        if (error) errors[field.id] = field.errorMessage || error;
    }
    return errors;
}
