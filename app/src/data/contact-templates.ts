import type { FormTemplate } from "../lib/form-types";

export const contactTemplates: FormTemplate[] = [
    {
        id: "contact", title: "Contact Us", category: "Contact",
        description: "Give visitors an easy way to send questions or comments to your team.",
        fields: [
            { id: "name", label: "Full name", type: "text", required: true, placeholder: "Your name" },
            { id: "email", label: "Email address", type: "email", required: true, placeholder: "you@example.com" },
            { id: "phone", label: "Phone number", type: "tel", required: false },
            { id: "subject", label: "Subject", type: "text", required: true, placeholder: "What is this about?" },
            { id: "message", label: "Message", type: "textarea", required: true, placeholder: "How can we help?" },
            { id: "contact-method", label: "Preferred contact method", type: "radio", required: false, options: ["Email", "Phone"] },
        ],
    },
    {
        id: "support-request", title: "Support Request", category: "Contact",
        description: "Collect the details your support team needs to investigate and resolve a request.",
        fields: [
            { id: "name", label: "Full name", type: "text", required: true },
            { id: "email", label: "Email address", type: "email", required: true },
            { id: "account", label: "Account or customer ID", type: "text", required: false },
            { id: "category", label: "Issue category", type: "select", required: true, options: ["Account access", "Billing", "Technical issue", "Bug report", "Feature request", "Other"] },
            { id: "priority", label: "Priority", type: "select", required: true, options: ["Low", "Medium", "High", "Urgent"] },
            { id: "subject", label: "Request summary", type: "text", required: true },
            { id: "description", label: "Describe the issue", type: "textarea", required: true, placeholder: "Include steps to reproduce the issue and any error messages." },
            { id: "attachments", label: "Screenshots or supporting files", type: "file", required: false },
        ],
    },
    {
        id: "sales-inquiry", title: "Sales Inquiry", category: "Contact",
        description: "Qualify sales leads and capture their needs, company size, and timeline.",
        fields: [
            { id: "name", label: "Full name", type: "text", required: true },
            { id: "email", label: "Work email", type: "email", required: true },
            { id: "phone", label: "Phone number", type: "tel", required: false },
            { id: "company", label: "Company name", type: "text", required: true },
            { id: "company-size", label: "Company size", type: "select", required: true, options: ["1–10 employees", "11–50 employees", "51–200 employees", "201–500 employees", "500+ employees"] },
            { id: "interest", label: "What are you interested in?", type: "textarea", required: true, placeholder: "Tell us which product or service you are considering." },
            { id: "timeline", label: "Expected purchase timeline", type: "select", required: true, options: ["Immediately", "Within 1 month", "1–3 months", "3–6 months", "More than 6 months", "Just researching"] },
            { id: "budget", label: "Estimated budget", type: "select", required: false, options: ["Under $1,000", "$1,000–$5,000", "$5,000–$10,000", "$10,000–$25,000", "$25,000+", "Not sure"] },
            { id: "message", label: "Additional notes", type: "textarea", required: false },
        ],
    },
];
