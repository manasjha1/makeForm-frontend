import * as React from "react";
import { cn } from "~/src/lib/utils";

type InputOTPProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> & {
    maxLength?: number;
    value?: string;
    onChange?: (value: string) => void;
    required?: boolean;
};

const InputOTP = React.forwardRef<HTMLDivElement, InputOTPProps>(
    ({ className, maxLength, value, onChange, required, ...props }, ref) => {
        const digits = Array.from({ length: maxLength ?? 6 }, (_, index) => (value ?? "")[index] ?? "");

        return (
            <div
                ref={ref}
                data-slot="input-otp"
                className={cn("flex items-center gap-2", className)}
                data-required={required ? "true" : undefined}
                {...props}
            >
                {digits.map((digit, index) => (
                    <div key={index} data-slot="input-otp-slot" className="flex h-10 w-10 items-center justify-center rounded-md border border-input text-center text-base font-medium">
                        {digit}
                    </div>
                ))}
            </div>
        );
    },
);
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} data-slot="input-otp-group" className={cn("flex items-center", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSeparator = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} data-slot="input-otp-separator" className={cn("mx-1 text-muted-foreground", className)} {...props} />
));
InputOTPSeparator.displayName = "InputOTPSeparator";

const InputOTPSlot = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { index?: number }
>(({ className, index = 0, ...props }, ref) => (
    <div
        ref={ref}
        data-slot="input-otp-slot"
        className={cn(
            "flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background text-base font-medium text-foreground",
            className,
        )}
        {...props}
    >
        {index}
    </div>
));
InputOTPSlot.displayName = "InputOTPSlot";

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
