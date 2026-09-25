import type { FormField, FormTemplate } from "./form-types";

export type Answers = Record<string, string | string[] | boolean>;

// A drop marker describes an insertion slot before a card, not its final index.
export function dropTargetIndex(fields: FormField[], id: string, slot: number): number {
    const from = fields.findIndex((field) => field.id === id);
    return Math.max(0, Math.min(fields.length - 1, slot - (from >= 0 && from < slot ? 1 : 0)));
}

export function moveField(form: FormTemplate, id: string, target: number): FormTemplate {
    const from = form.fields.findIndex((field) => field.id === id);
    if (from < 0 || target < 0 || target >= form.fields.length || from === target) return form;
    const fields = [...form.fields];
    fields.splice(target, 0, fields.splice(from, 1)[0]);
    return { ...form, fields };
}

export function removeField(form: FormTemplate, id: string): FormTemplate {
    return { ...form, fields: form.fields.filter((field) => field.id !== id).map((field) => {
        if (field.condition?.fieldId !== id) return field;
        const { condition, ...rest } = field;
        return rest;
    }) };
}

export function duplicateField(field: FormField): FormField {
    return { ...structuredClone(field), id: crypto.randomUUID(), label: `${field.label} (copy)` };
}

export function visibleFields(fields: FormField[], answers: Answers): FormField[] {
    const visible = new Set<string>();
    // Rules only reference preceding fields, so hidden parents cannot activate children.
    return fields.filter((field) => {
        const rule = field.condition;
        let show = !rule;
        if (rule && visible.has(rule.fieldId)) {
            const value = answers[rule.fieldId] ?? "";
            const values = Array.isArray(value) ? value : [String(value)];
            const equals = values.includes(rule.value);
            show = rule.operator === "equals" ? equals : rule.operator === "notEquals" ? !equals
                : rule.operator === "contains" ? values.some((item) => item.includes(rule.value))
                    : values.some((item) => item !== "" && item !== "false");
            if (rule.action === "hide") show = !show;
        }
        if (show) visible.add(field.id);
        return show;
    });
}

export function initialAnswers(fields: FormField[]): Answers {
    return Object.fromEntries(fields.map((field) => [field.id, field.type === "checkbox"
        ? field.options?.length ? [] : field.defaultValue === "true"
        : field.type === "file" ? "" : field.defaultValue ?? ""]));
}

export function normalizeConditions(form: FormTemplate): FormTemplate {
    const preceding = new Set<string>();
    return { ...form, fields: form.fields.map((field) => {
        const valid = !field.condition || preceding.has(field.condition.fieldId);
        if (field.type !== "file") preceding.add(field.id);
        if (valid) return field;
        const { condition, ...rest } = field;
        return rest;
    }) };
}

// Keep exact choice comparisons attached to a renamed option.
export function updateFormField(form: FormTemplate, id: string, patch: Partial<FormField>): FormTemplate {
    const source = form.fields.find((field) => field.id === id);
    const before = source?.options;
    const after = patch.options;
    const renamed = before && after && before.length === after.length
        ? before.map((value, index) => ({ value, next: after[index] })).filter(({ value, next }) => value !== next)
        : [];
    const rename = renamed.length === 1 && before?.filter((value) => value === renamed[0].value).length === 1 ? renamed[0] : null;
    return { ...form, fields: form.fields.map((field) => {
        if (field.id === id) return { ...field, ...patch };
        const rule = field.condition;
        if (rename && rule?.fieldId === id && ["equals", "notEquals"].includes(rule.operator) && rule.value === rename.value) {
            return { ...field, condition: { ...rule, value: rename.next } };
        }
        return field;
    }) };
}
