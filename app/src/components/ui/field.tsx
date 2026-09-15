import * as React from "react";
import { cn } from "~/src/lib/utils";

type FieldProps = React.HTMLAttributes<HTMLDivElement> & {
    orientation?: "horizontal" | "vertical";
};

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
    ({ className, orientation = "vertical", ...props }, ref) => (
        <div
            ref={ref}
            data-slot="field"
            className={cn(
                "grid gap-2",
                orientation === "horizontal" && "flex items-center justify-between gap-3",
                className,
            )}
            {...props}
        />
    ),
);
Field.displayName = "Field";

const FieldGroup = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} data-slot="field-group" className={cn("grid gap-4", className)} {...props} />
));
FieldGroup.displayName = "FieldGroup";

const FieldSet = React.forwardRef<
    HTMLFieldSetElement,
    React.FieldsetHTMLAttributes<HTMLFieldSetElement>
>(({ className, ...props }, ref) => (
    <fieldset ref={ref} data-slot="field-set" className={cn("grid gap-2", className)} {...props} />
));
FieldSet.displayName = "FieldSet";

const FieldLegend = React.forwardRef<
    HTMLLegendElement,
    React.HTMLAttributes<HTMLLegendElement>
>(({ className, ...props }, ref) => (
    <legend ref={ref} data-slot="field-legend" className={cn("text-sm font-medium", className)} {...props} />
));
FieldLegend.displayName = "FieldLegend";

const FieldLabel = React.forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
    <label ref={ref} data-slot="field-label" className={cn("text-sm font-medium leading-none", className)} {...props} />
));
FieldLabel.displayName = "FieldLabel";

const FieldDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p ref={ref} data-slot="field-description" className={cn("text-sm text-muted-foreground", className)} {...props} />
));
FieldDescription.displayName = "FieldDescription";

const FieldError = ({
    className,
    errors,
}: {
    className?: string;
    errors?: Array<{ message?: string } | null | undefined>;
}) => {
    const message = errors?.find((error) => error?.message)?.message;

    if (!message) return null;

    return (
        <p data-slot="field-error" className={cn("text-sm font-medium text-destructive", className)}>
            {message}
        </p>
    );
};

export {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
};
