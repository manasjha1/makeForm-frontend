import type { FormTemplate } from "../lib/form-types";

export const communityTemplates: FormTemplate[] = [
    {
        id: "event-registration", title: "Event Registration", category: "Events",
        description: "Plan your guest list with attendance and dietary preferences.",
        fields: [
            { id: "name", label: "Full name", type: "text", required: true },
            { id: "email", label: "Email address", type: "email", required: true },
            { id: "guests", label: "Number of attendees", type: "number", required: true, min: 1, max: 10 },
            { id: "session", label: "Session", type: "select", required: true, options: ["Morning workshop", "Afternoon workshop", "Full day"] },
            { id: "diet", label: "Dietary requirements", type: "textarea", required: false },
        ],
    },
    {
        id: "customer-feedback", title: "Customer Feedback Survey", category: "Feedback",
        description: "Learn what customers love and where you can improve.",
        fields: [
            { id: "name", label: "Name (optional)", type: "text", required: false },
            { id: "rating", label: "How likely are you to recommend us? (0–10)", type: "number", required: true, min: 0, max: 10 },
            { id: "satisfaction", label: "Overall satisfaction", type: "select", required: true, options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"] },
            { id: "feedback", label: "What could we improve?", type: "textarea", required: false },
        ],
    },
];
