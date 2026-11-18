import React from "react";
import {
  User,
  Star,
  Trophy,
  Lightbulb,
  Hash,
  Type,
  CircleDot,
  CheckSquare,
  ListFilter,
  Mail,
  Phone,
  Calendar,
  Paperclip,
  FileText,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

export interface FieldIconLookup {
  type?: string;
  label?: string;
}

/**
 * Returns a contextual Lucide icon matching the field type and label context,
 * exactly matching the MakeForm Precision Flow reference design.
 */
export function getFieldIcon(field: FieldIconLookup): LucideIcon {
  const t = (field.type || "").toLowerCase();
  const label = (field.label || "").toLowerCase();

  // Name / User
  if (label.includes("name") || label.includes("user") || label.includes("author") || label.includes("person") || label.includes("contact")) {
    return User;
  }

  // Rating / Recommendation / Star
  if (
    label.includes("recommend") ||
    label.includes("rating") ||
    label.includes("rate") ||
    label.includes("score") ||
    label.includes("star") ||
    label.includes("0-10") ||
    label.includes("nps")
  ) {
    return Star;
  }

  // Satisfaction / Overall / Achievement
  if (
    label.includes("satisfaction") ||
    label.includes("overall") ||
    label.includes("experience") ||
    label.includes("feeling") ||
    label.includes("quality")
  ) {
    return Trophy;
  }

  // Improvements / Feedback / Suggestions
  if (
    label.includes("improve") ||
    label.includes("suggest") ||
    label.includes("feedback") ||
    label.includes("idea") ||
    label.includes("thought") ||
    label.includes("what could")
  ) {
    return Lightbulb;
  }

  // Email
  if (t === "email" || label.includes("email") || label.includes("e-mail")) {
    return Mail;
  }

  // Phone
  if (t === "tel" || label.includes("phone") || label.includes("mobile") || label.includes("tel")) {
    return Phone;
  }

  // Number / Age / Quantity
  if (
    t === "number" ||
    label.includes("number") ||
    label.includes("age") ||
    label.includes("count") ||
    label.includes("amount") ||
    label.includes("quantity") ||
    label.includes("price") ||
    label.includes("cost")
  ) {
    return Hash;
  }

  // Date / Time / Appointment
  if (t === "date" || t === "time" || label.includes("date") || label.includes("time") || label.includes("appointment") || label.includes("when")) {
    return Calendar;
  }

  // File upload / Attachments
  if (t === "file" || label.includes("file") || label.includes("upload") || label.includes("document") || label.includes("resume") || label.includes("attachment")) {
    return Paperclip;
  }

  // Choice / Selection types
  if (t === "radio" || label.includes("radio")) {
    return CircleDot;
  }
  if (t === "checkbox" || label.includes("checkbox") || label.includes("agree") || label.includes("consent")) {
    return CheckSquare;
  }
  if (t === "select" || label.includes("select") || label.includes("choose") || label.includes("category") || label.includes("dropdown")) {
    return ListFilter;
  }

  // Textarea / Comments
  if (t === "textarea" || label.includes("comment") || label.includes("message") || label.includes("description") || label.includes("note") || label.includes("details")) {
    return Lightbulb;
  }

  // Default text field
  return Type;
}

/**
 * Standardized field label with contextual icon and required/optional badge
 */
export function FieldLabelHeader({
  field,
  htmlFor,
}: {
  field: { label: string; type?: string; required?: boolean };
  htmlFor?: string;
}) {
  const Icon = getFieldIcon(field);

  return (
    <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
      <label
        htmlFor={htmlFor}
        className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-[#191c1d] sm:text-[15px]"
      >
        <span className="flex size-5 shrink-0 items-center justify-center text-[#3525cd]">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 wrap-break-word">{field.label}</span>
      </label>

      {field.required ? (
        <span className="text-xs font-semibold text-[#ba1a1a] select-none">
          Required *
        </span>
      ) : (
        <span className="text-xs font-medium text-[#777587] select-none">
          Optional
        </span>
      )}
    </div>
  );
}
