import type { FormField } from "./form-types";

export function nextOptionLabel(options: string[]): string {
    let number = 1;
    while (options.includes(`Option ${number}`)) number++;
    return `Option ${number}`;
}

export function renameOption(field: FormField, index: number, label: string): Partial<FormField> {
    const options = field.options ?? [];
    return {
        options: options.map((value, position) => position === index ? label : value),
        ...(field.defaultValue === options[index] ? { defaultValue: label } : {}),
    };
}
