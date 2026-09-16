import * as React from "react";
import { cn } from "~/src/lib/utils";

const InputGroup = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        data-slot="input-group"
        className={cn(
            "flex items-center rounded-lg border border-input bg-transparent transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
            className,
        )}
        {...props}
    />
));
InputGroup.displayName = "InputGroup";

const InputGroupInput = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
    <input
        ref={ref}
        data-slot="input-group-input"
        className={cn(
            "h-10 w-full min-w-0 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground",
            className,
        )}
        {...props}
    />
));
InputGroupInput.displayName = "InputGroupInput";

const InputGroupAddon = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        data-slot="input-group-addon"
        className={cn("flex h-10 items-center justify-center border-l border-input bg-transparent px-3 text-muted-foreground", className)}
        {...props}
    />
));
InputGroupAddon.displayName = "InputGroupAddon";

const InputGroupText = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
    <span ref={ref} data-slot="input-group-text" className={cn("text-sm text-muted-foreground", className)} {...props} />
));
InputGroupText.displayName = "InputGroupText";

const InputGroupTextarea = React.forwardRef<
    HTMLTextAreaElement,
    React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
    <textarea
        ref={ref}
        data-slot="input-group-textarea"
        className={cn(
            "min-h-20 w-full resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground",
            className,
        )}
        {...props}
    />
));
InputGroupTextarea.displayName = "InputGroupTextarea";

export {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
};
