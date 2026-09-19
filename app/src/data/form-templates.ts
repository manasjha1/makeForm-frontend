import type { FormTemplate } from "../lib/form-types";
import { businessTemplates } from "./business-templates";
import { communityTemplates } from "./community-templates";

export const formTemplates: FormTemplate[] = [
    ...businessTemplates,
    ...communityTemplates,
    {
        id: "job-application", title: "Job Application", category: "Business",
        description: "Gather candidate experience and contact details in one place.",
        fields: [
            { id: "name", label: "Full name", type: "text", required: true },
            { id: "email", label: "Email address", type: "email", required: true },
            { id: "phone", label: "Phone number", type: "tel", required: false },
            { id: "role", label: "Position applied for", type: "text", required: true },
            { id: "experience", label: "Relevant experience", type: "textarea", required: true },
            { id: "portfolio", label: "Portfolio or resume link", type: "text", required: false },
        ],
    },
    {
        id: "appointment-request", title: "Appointment Request", category: "Personal",
        description: "Let people request a convenient date and time to meet.",
        fields: [
            { id: "name", label: "Full name", type: "text", required: true },
            { id: "email", label: "Email address", type: "email", required: true },
            { id: "date", label: "Preferred date", type: "date", required: true },
            { id: "time", label: "Preferred time", type: "select", required: true, options: ["Morning", "Afternoon", "Evening"] },
            { id: "notes", label: "What would you like to discuss?", type: "textarea", required: false },
            { id: "confirmation", label: "I understand this is a request, not a confirmed booking", type: "checkbox", required: true },
        ],
    },
];

export function findTemplate(id: string | null) {
    return formTemplates.find((template) => template.id === id);
}
