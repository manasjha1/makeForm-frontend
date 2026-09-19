import { z } from "zod";
import type { FormTemplate } from "./form-types";

const draftSchema = z.object({
    id: z.string(), title: z.string(), description: z.string(),
    category: z.enum(["Business", "Events", "Feedback", "Personal"]),
    fields: z.array(z.object({
        id: z.string(), label: z.string(), required: z.boolean(),
        type: z.enum(["text", "email", "tel", "number", "date", "textarea", "select", "checkbox"]),
        placeholder: z.string().optional(), options: z.array(z.string()).optional(),
        min: z.number().optional(), max: z.number().optional(),
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
