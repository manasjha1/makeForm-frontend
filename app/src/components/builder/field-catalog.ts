import { Type, Hash, Mail, CalendarDays, ChevronDown, CircleDot, SquareCheck, Upload, AlignLeft, Phone } from "lucide-react";
import type { FieldType, FormField } from "../../lib/form-types";

export const fieldCatalog = [
    { type: "text", label: "Text", category: "Basic", icon: Type, description: "Single-line text for names, titles, and short responses" },
    { type: "number", label: "Number", category: "Basic", icon: Hash, description: "Numeric inputs with min and max validation" },
    { type: "email", label: "Email", category: "Basic", icon: Mail, description: "Email address field with automatic syntax validation" },
    { type: "date", label: "Date", category: "Basic", icon: CalendarDays, description: "Date picker for timelines and scheduling" },
    { type: "select", label: "Select", category: "Choice", icon: ChevronDown, description: "Dropdown menu for single-choice option sets" },
    { type: "radio", label: "Radio", category: "Choice", icon: CircleDot, description: "Radio buttons for visible single-option selection" },
    { type: "checkbox", label: "Checkbox", category: "Choice", icon: SquareCheck, description: "Multi-select checkboxes or single agreement toggle" },
    { type: "file", label: "File Upload", category: "Advanced", icon: Upload, description: "File uploader supporting documents, images, and archives" },
    { type: "textarea", label: "Textarea", category: "Advanced", icon: AlignLeft, description: "Multi-line text box for feedback and descriptions" },
] satisfies { type: FieldType; label: string; category: string; icon: typeof Type; description: string }[];

export function fieldIcon(type: FieldType) { return type === "tel" ? Phone : fieldCatalog.find((item) => item.type === type)?.icon ?? Type; }
export function newField(type: FieldType): FormField {
    return {
        id: crypto.randomUUID(), type, required: false,
        label: fieldCatalog.find((item) => item.type === type)?.label ?? "Phone number",
        ...(["select", "radio"].includes(type) ? { options: ["Option 1", "Option 2"] } : {}),
        ...(type === "file" ? { accept: ".pdf,.png,.jpg,.jpeg,.zip", maxFileSize: 25 } : {}),
    };
}
