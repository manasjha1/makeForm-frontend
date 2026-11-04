import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "~/src/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/src/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "~/src/components/ui/field";
import { Input } from "~/src/components/ui/input";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
} from "~/src/components/ui/input-group";
import makeForm_png from "~/assests/makeForm_login.png";
import toast, { Toaster } from "react-hot-toast";
import Header from "~/src/components/Headers";
import { useState } from "react";
import {
    Eye,
    EyeOff,
    LayoutFreeform,
    Lock,
    LucideForm,
    Mail,
    Minus,
    User,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { FaGoogle, FaLine } from "react-icons/fa";
import { useRegisterAccount } from "~/src/hooks/mutation";

const formSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters.")
        .max(50, "Name must be at most 50 characters."),
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Please enter a valid email address."),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters.")
        .max(50, "Password must be at most 50 characters."),
});

export function meta() {
    return [{ title: "Create Account | makeForm" }, { name: "description", content: "Create your makeForm account and verify your email." }];
}

export default function Register() {
    const { mutate: registerAccount, isPending } = useRegisterAccount()
    const [viewPassword, setViewPassword] = useState(false);
    const navigate = useNavigate()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        registerAccount(
            {
                register: {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                },
            },
            {
                onSuccess: (response: any) => {
                    const resData = response?.data || response;
                    localStorage.setItem("pending_verification_email", data.email);
                    if (resData?.user) {
                        localStorage.setItem("user", JSON.stringify(resData.user));
                    }
                    toast.success(resData?.message || "Verification code sent to your email!");
                    navigate("/verify-otp", {
                        state: {
                            email: data.email,
                            name: data.name,
                        },
                    });
                },
                onError: (err: any) => {
                    toast.error(err?.message || "Registration failed. Please try again.");
                },
            },
        );
    }

    return (
        <div className="auth-page min-h-screen bg-[#f8f9fa]">
            <Toaster />
            <Header />
            <main className="mx-auto grid w-full max-w-xl gap-4 px-3 py-6 sm:px-6 sm:py-10">
                {/* logo section */}
                <img
                    className="mx-auto h-auto w-full max-w-56 object-contain sm:max-w-[18rem]"
                    src={makeForm_png}
                    alt="makeForm"
                />
                <section className="w-full">
                    <Card className="mx-auto w-full max-w-lg overflow-hidden shadow-[0_10px_25px_-5px_rgba(25,28,29,0.08),0_4px_10px_-3px_rgba(25,28,29,0.04)] border border-[#e1e3e4] bg-white rounded-2xl">
                        <CardContent className="p-4 sm:p-6">
                            <section className="mb-5">
                                <div className="mb-4 flex w-full items-center rounded-lg border border-[#e1e3e4] bg-surface-container-low p-1">
                                    <Button asChild variant="ghost" className="min-w-0 flex-1 rounded-md text-xs text-on-surface-variant hover:text-[#191c1d]">
                                        <Link to="/sign-in">Sign In</Link>
                                    </Button>
                                    <Button asChild variant="ghost" className="min-w-0 flex-1 rounded-md text-xs bg-white text-[#3525cd] shadow-xs font-semibold">
                                        <Link to="/create-account" aria-current="page">Create Account</Link>
                                    </Button>
                                </div>
                                <Button disabled type="button" title="Google sign-in is not configured" className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#e1e3e4] bg-white text-sm font-medium text-on-surface-variant hover:bg-surface-container-low">
                                    <FaGoogle /> Google sign-in unavailable
                                </Button>
                            </section>
                            <div className="relative my-6 text-center">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[#e1e3e4]" />
                                </div>
                                <span className="relative bg-white px-3 text-[11px] font-semibold text-on-surface-variant uppercase">
                                    Or with work email
                                </span>
                            </div>{" "}
                            <section>
                                <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
                                    <FieldGroup>
                                        <Controller
                                            name="name"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="register-form-name">
                                                        Full Name
                                                    </FieldLabel>
                                                    <InputGroup className="rounded-lg border-[#e1e3e4] focus-within:border-primary-container focus-within:ring-2 focus-within:ring-primary-container/20">
                                                        <InputGroupAddon>
                                                            <User />
                                                        </InputGroupAddon>
                                                        <InputGroupInput
                                                            {...field}
                                                            id="register-form-name"
                                                            aria-invalid={fieldState.invalid}
                                                            placeholder="e.g. Jordan Lee"
                                                            autoComplete="name"
                                                        />

                                                    </InputGroup>
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            name="email"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="register-form-email">
                                                        Email Address
                                                    </FieldLabel>
                                                    <InputGroup className="rounded-lg border-[#e1e3e4] focus-within:border-primary-container focus-within:ring-2 focus-within:ring-primary-container/20">
                                                        <InputGroupAddon>
                                                            <Mail />
                                                        </InputGroupAddon>
                                                        <InputGroupInput
                                                            {...field}
                                                            id="register-form-email"
                                                            aria-invalid={fieldState.invalid}
                                                            placeholder="you@example.com"
                                                            type="email"
                                                            autoComplete="email"
                                                            autoCapitalize="none"
                                                            spellCheck={false}
                                                        />

                                                    </InputGroup>
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            name="password"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="register-form-password">
                                                        Password
                                                    </FieldLabel>
                                                    <InputGroup className="rounded-lg border-[#e1e3e4] focus-within:border-primary-container focus-within:ring-2 focus-within:ring-primary-container/20">
                                                        <InputGroupAddon>
                                                            <Lock />
                                                        </InputGroupAddon>
                                                        <InputGroupInput
                                                            type={viewPassword ? "text" : "password"}
                                                            {...field}
                                                            id="register-form-password"
                                                            aria-invalid={fieldState.invalid}
                                                            placeholder="••••••••"
                                                            autoComplete="new-password"
                                                        />
                                                        <InputGroupAddon>
                                                            <button type="button" className="rounded p-1 focus-visible:outline-2 focus-visible:outline-primary-container" aria-label={viewPassword ? "Hide password" : "Show password"} aria-pressed={viewPassword} onClick={() => setViewPassword((visible) => !visible)}>{viewPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</button>
                                                        </InputGroupAddon>
                                                    </InputGroup>
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                    </FieldGroup>
                                    <Link to="/verify-otp" className="inline-block py-2 text-xs text-[#3525cd] hover:text-primary-container underline underline-offset-4">Already have a verification code?</Link>
                                </form>
                            </section>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 sm:p-6 sm:pt-0">
                            <Field orientation="horizontal" className="w-full">
                                <Button
                                    className="rounded-lg w-full bg-[#3525cd] text-white hover:bg-primary-container disabled:opacity-60 shadow-[0_4px_14px_0_rgba(79,70,229,0.35)] font-semibold py-2.5"
                                    type="submit"
                                    form="register-form"
                                    disabled={isPending}
                                >
                                    {isPending ? "Sending verification code..." : "Send verification code"}
                                </Button>
                            </Field>
                        </CardFooter>
                    </Card>
                </section>
            </main>
        </div>
    );
}
