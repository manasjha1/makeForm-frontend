import type { FormTemplate } from "../lib/form-types";

export const businessTemplates: FormTemplate[] = [
    {
        id: "contact", title: "Contact Us", category: "Business",
        description: "Give customers a simple way to reach your team.",
        fields: [
            { id: "name", label: "Full name", type: "text", required: true, placeholder: "Your name" },
            { id: "email", label: "Email address", type: "email", required: true },
            { id: "subject", label: "Subject", type: "select", required: true, options: ["General inquiry", "Sales", "Support"] },
            { id: "message", label: "Message", type: "textarea", required: true, placeholder: "How can we help?" },
        ],
    },
    {
        id: "client-onboarding", title: "Client Onboarding", category: "Business",
        description: "Collect project goals, timelines, and budget before your first meeting.",
        fields: [
            { id: "name", label: "Contact name", type: "text", required: true },
            { id: "email", label: "Work email", type: "email", required: true },
            { id: "company", label: "Company", type: "text", required: true },
            { id: "budget", label: "Project budget", type: "select", required: true, options: ["Under $1,000", "$1,000–$5,000", "$5,000–$10,000", "$10,000+"] },
            { id: "date", label: "Preferred start date", type: "date", required: false },
            { id: "goals", label: "Project goals", type: "textarea", required: true },
        ],
    },
];
