import type { FormTemplate } from "../lib/form-types";

export const blankForm: FormTemplate = {
    id: "studio-blank", category: "Personal", title: "Untitled form",
    description: "Add a description to introduce your form.", fields: [],
};

export const studioForm: FormTemplate = {
    id: "studio-onboarding", category: "Business",
    title: "Client Onboarding & Project Scope",
    description: "Please complete this brief questionnaire to help us customize your project setup and deliver optimal results.",
    fields: [
        { id: "field-1", type: "text", label: "Full Legal Name", required: true, placeholder: "e.g. Eleanor Vance", helpText: "Enter your primary contact name" },
        { id: "field-2", type: "email", label: "Corporate Email Address", required: true, placeholder: "eleanor@acme.corp", helpText: "We will send project updates to this address" },
        { id: "field-3", type: "select", label: "Primary Project Type", required: true, placeholder: "Select a project track...", helpText: "Choose the option that best fits your immediate needs", options: ["Website Design", "Web Application", "Brand Strategy", "Other"] },
        { id: "field-4", type: "number", label: "Estimated Budget Range ($USD)", required: false, placeholder: "25000", min: 10000, helpText: "Minimum project allocation starts at $10,000" },
        { id: "field-5", type: "radio", label: "Preferred Launch Timeline", required: true, options: ["Urgent (Under 30 Days)", "Standard (1 - 3 Months)", "Flexible (Q3 / Q4 Roadmap)"] },
        { id: "field-6", type: "date", label: "Target Kickoff Date", required: false, helpText: "Select your ideal team onboarding date" },
        { id: "field-7", type: "textarea", label: "Project Goals & Key Requirements", required: true, placeholder: "Describe your core objectives, target audience, and key deliverables...", helpText: "Include links to existing docs or design files if applicable" },
        { id: "field-8", type: "file", label: "Upload Brand Assets or Request Doc", required: false, helpText: "Accepted formats: PDF, ZIP, PNG, JPG up to 25MB", accept: ".pdf,.zip,.png,.jpg,.jpeg", maxFileSize: 25 },
        { id: "field-9", type: "checkbox", label: "Agreements & Compliance", required: true, options: ["I accept the Non-Disclosure Terms", "Subscribe to monthly product updates & release logs"] },
    ],
};
