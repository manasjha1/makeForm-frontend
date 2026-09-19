export type FieldType = "text" | "email" | "tel" | "number" | "date" | "textarea" | "select" | "checkbox";

export type FormField = {
    id: string;
    label: string;
    type: FieldType;
    required: boolean;
    placeholder?: string;
    options?: string[];
    min?: number;
    max?: number;
};

export type FormTemplate = {
    id: string;
    title: string;
    description: string;
    category: "Business" | "Events" | "Feedback" | "Personal";
    fields: FormField[];
};

// Each editable form owns its fields, so edits never mutate the catalog.
export function createForm(template: FormTemplate): FormTemplate {
    return structuredClone(template);
}
