import type { FormTemplate } from "../lib/form-types";

export const businessTemplates: FormTemplate[] = [
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
    {
        id: "business-inquiry", title: "Business Inquiry", category: "Business",
        description: "Capture prospect details and the type of business inquiry they need help with.",
        fields: [
            { id: "name", label: "Full name", type: "text", required: true, placeholder: "Your name" },
            { id: "email", label: "Work email", type: "email", required: true, placeholder: "you@company.com" },
            { id: "phone", label: "Phone number", type: "tel", required: false },
            { id: "company", label: "Company name", type: "text", required: true },
            { id: "inquiry-type", label: "What can we help you with?", type: "select", required: true, options: ["Partnership", "Sales", "Product information", "Vendor request", "General inquiry"] },
            { id: "company-size", label: "Company size", type: "select", required: false, options: ["1–10 employees", "11–50 employees", "51–200 employees", "201–500 employees", "500+ employees"] },
            { id: "message", label: "Tell us more about your inquiry", type: "textarea", required: true, placeholder: "Share any relevant details, goals, or questions." },
            { id: "contact-method", label: "Preferred contact method", type: "radio", required: true, options: ["Email", "Phone"] },
        ],
    },
    {
        id: "project-brief", title: "Project Brief", category: "Business",
        description: "Gather the goals, scope, audience, budget, and timeline needed to start a project.",
        fields: [
            { id: "name", label: "Your name", type: "text", required: true },
            { id: "email", label: "Email address", type: "email", required: true },
            { id: "company", label: "Company or organization", type: "text", required: true },
            { id: "project-name", label: "Project name", type: "text", required: true },
            { id: "overview", label: "Project overview", type: "textarea", required: true, placeholder: "What are you planning to create or change?" },
            { id: "objective", label: "Primary objective", type: "textarea", required: true, placeholder: "What outcome should this project achieve?" },
            { id: "audience", label: "Target audience", type: "textarea", required: true },
            { id: "deliverables", label: "Key deliverables", type: "textarea", required: true, placeholder: "List the main items or services you need." },
            { id: "budget", label: "Estimated budget", type: "select", required: true, options: ["Under $5,000", "$5,000–$15,000", "$15,000–$30,000", "$30,000–$50,000", "$50,000+", "Not sure yet"] },
            { id: "timeline", label: "Desired completion date", type: "date", required: false },
            { id: "additional-info", label: "Additional information", type: "textarea", required: false, placeholder: "Include references, constraints, or anything else we should know." },
        ],
    },
];
