export type FormLayoutTier = "small" | "medium" | "large";

export interface FormFieldLike {
  type?: string;
  options?: any[];
  config?: {
    options?: any[];
  };
}

export interface FormLayoutConfig {
  tier: FormLayoutTier;
  fieldsCount: number;
  distinctTypesCount: number;
  hasWideFields: boolean;
  containerClass: string;
  brandBarClass: string;
  gridClass: string;
  cardClass: string;
  isFullScreen: boolean;
  badgeLabel: string;
  getFieldSpanClass: (field: FormFieldLike) => string;
}

/**
 * Inspects a form's fields to determine its optimal responsive layout.
 *
 * Rules:
 * - Small Form (< 5 fields): Compact width (max-w-xl) and 1 column.
 * - Medium Form (5 to 8 fields): Standard balanced width (max-w-4xl) with 2 columns.
 * - Big Form (> 8 fields): Full screen device width with a 3-column grid.
 * - Advanced fields (textarea and file uploads) occupy a single column.
 */
export function inspectFormLayout(fields: FormFieldLike[] = []): FormLayoutConfig {
  const fieldsCount = fields.length;

  const normalizedTypes = fields.map((f) => (f.type || "").toLowerCase());
  const distinctTypes = new Set(normalizedTypes.filter(Boolean));
  const distinctTypesCount = distinctTypes.size;

  const hasWideFields = fields.some((f) => {
    const t = (f.type || "").toLowerCase();
    const opts = f.options || f.config?.options;
    const hasManyOptions = Array.isArray(opts) && opts.length > 2;
    return t === "textarea" || t === "file" || (t === "radio" && hasManyOptions) || (t === "checkbox" && hasManyOptions);
  });

  const tier: FormLayoutTier =
    fieldsCount < 5 ? "small" : fieldsCount > 8 ? "large" : "medium";

  if (tier === "small") {
    return {
      tier,
      fieldsCount,
      distinctTypesCount,
      hasWideFields,
      containerClass: "mx-auto w-full max-w-xl transition-all duration-300",
      brandBarClass: "mx-auto flex max-w-xl items-center justify-between transition-all duration-300",
      gridClass: "grid min-w-0 grid-cols-1 gap-y-5",
      cardClass: "mx-auto w-full max-w-xl",
      isFullScreen: false,
      badgeLabel: "Compact Layout",
      getFieldSpanClass: () => "col-span-1",
    };
  }

  if (tier === "large") {
    return {
      tier,
      fieldsCount,
      distinctTypesCount,
      hasWideFields,
      containerClass: "mx-auto w-full max-w-7xl xl:max-w-screen-2xl px-2 sm:px-4 lg:px-6 transition-all duration-300",
      brandBarClass: "mx-auto flex w-full max-w-7xl xl:max-w-screen-2xl items-center justify-between px-2 sm:px-4 lg:px-6 transition-all duration-300",
      gridClass: "grid min-w-0 grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3",
      cardClass: "mx-auto w-full max-w-7xl xl:max-w-screen-2xl",
      isFullScreen: true,
      badgeLabel: "Full-Width Layout",
      getFieldSpanClass: (field: FormFieldLike) => {
        const t = (field.type || "").toLowerCase();
        const opts = field.options || field.config?.options;
        const optionsCount = Array.isArray(opts) ? opts.length : 0;

        if (t === "textarea" || t === "file") {
          return "col-span-1";
        }
        if ((t === "radio" || t === "checkbox") && optionsCount >= 3) {
          return "col-span-1 md:col-span-2 lg:col-span-2";
        }
        return "col-span-1";
      },
    };
  }

  // Medium tier
  return {
    tier,
    fieldsCount,
    distinctTypesCount,
    hasWideFields,
    containerClass: "mx-auto w-full max-w-4xl transition-all duration-300",
    brandBarClass: "mx-auto flex max-w-4xl items-center justify-between transition-all duration-300",
    gridClass: "grid min-w-0 grid-cols-1 gap-x-6 gap-y-5 sm:gap-y-6 md:grid-cols-2",
    cardClass: "mx-auto w-full max-w-4xl",
    isFullScreen: false,
    badgeLabel: "Standard Layout",
    getFieldSpanClass: (field: FormFieldLike) => {
      const t = (field.type || "").toLowerCase();
      const opts = field.options || field.config?.options;
      const optionsCount = Array.isArray(opts) ? opts.length : 0;

      if (t === "textarea" || t === "file") {
        return "col-span-1";
      }
      if ((t === "radio" || t === "checkbox") && optionsCount >= 3) {
        return "col-span-1 md:col-span-2";
      }
      return "col-span-1";
    },
  };
}
