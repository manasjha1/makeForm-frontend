import { z } from "zod";
import type { FormTemplate } from "./form-types";

const draftSchema = z.object({
    id: z.string(), title: z.string(), description: z.string(),
    category: z.enum(["Business", "Events", "Feedback", "Personal"]),
    fields: z.array(z.object({
        id: z.string(), label: z.string(), required: z.boolean(),
        type: z.enum(["text", "email", "tel", "number", "date", "textarea", "select", "checkbox", "radio", "file"]),
        placeholder: z.string().optional(), options: z.array(z.string()).optional(),
        min: z.number().optional(), max: z.number().optional(),
        step: z.number().positive().optional(),
        helpText: z.string().optional(), defaultValue: z.string().optional(),
        minLength: z.number().int().nonnegative().optional(), maxLength: z.number().int().nonnegative().optional(),
        errorMessage: z.string().optional(), accept: z.string().optional(), maxFileSize: z.number().positive().optional(),
        condition: z.object({ fieldId: z.string(), operator: z.enum(["equals", "notEquals", "contains", "notEmpty"]), value: z.string(), action: z.enum(["show", "hide"]).optional() }).optional(),
    })),
});
const key = "makeform-template-draft-v1";

export function readDraft(): FormTemplate | null {
    try {
        const result = draftSchema.safeParse(JSON.parse(sessionStorage.getItem(key) || "null"));
        return result.success ? result.data : null;
    } catch { return null; }
}

export function saveDraft(form: FormTemplate): boolean {
    try { sessionStorage.setItem(key, JSON.stringify(form)); return true; }
    catch { return false; }
}
