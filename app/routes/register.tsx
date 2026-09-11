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
import Header from "~/src/components/Header";
import { useState, type SetStateAction } from "react";
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

const formSchema = z.object({
    name: z
        .string()
        .min(5, "name must be at least 5 characters")
        .max(20, "name must be at least 20 characters."),
    email: z
        .string()
        .min(10, "email must be at least 10 characters.")
        .max(32, "email must be at most 32 characters."),
    password: z
        .string()
        .min(8, "password must be at least 8 characters.")
        .max(50, "password must be at most 50 characters."),
});

interface formProps {
    viewPage: toggleBtn;
    setViewPage: React.Dispatch<React.SetStateAction<toggleBtn>>;
}

export default function Register({ viewPage, setViewPage }: formProps) {
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
        try {
            const response = await fetch(
                "http://localhost:5000/api/v1/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );
            const result = await response.json()
            console.log("response data", result);
            if (result) {
                navigate("/verify-otp")
                console.log("form submmited", result);

            } else {
                toast.error("Invailid credentials")
            }

        } catch (error) {
            console.error(error)
        }
        console.log("You submitted the following details", data);
    }

    return (
        <div>
            <Header
                viewPage={""}
                setViewPage={function (value: SetStateAction<toggleBtn>): void {
                    throw new Error("Function not implemented.");
                }}
            />
            <div className="grid gap-4">
                {/* logo section */}
                <img
                    className="w-fit h-30 mx-auto mt-20 object-cover overflow-hidden"
                    src={makeForm_png}
                    alt="makeForm_png"
                />
                <section className="p-2 m-2">
                    <Card className="w-full mx-auto sm:max-w-md shadow-lg">
                        <CardContent>
                            <section className="mb-5">
                                <div className="flex items-center justify-center w-full m-auto bg-[#f9f6f0] p-1 mb-4 rounded-sm border border-[#E2E8E4]">
                                    <Link to="/sign-in">
                                        <Button
                                            onClick={() => setViewPage("login")}
                                            className={`text-[12px] font-medium transition-all px-8 md:px-17 rounded-sm ${viewPage === "login" ? "bg-white hover:bg-white text-emerald-700 shadow" : "bg-transparent hover:bg-transparent text-gray-500 hover:text-black/80"}`}
                                        >
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link to="/create-account">
                                        <Button
                                            onClick={() => setViewPage("register")}
                                            className={`text-[12px] font-medium transition-all px-6 md:px-17 w-full rounded-sm ${viewPage !== "register" ? "bg-white hover:bg-white text-emerald-700 shadow" : "bg-transparent hover:bg-transparent text-gray-500 hover:text-black/80"}`}
                                        >
                                            Create Account
                                        </Button>
                                    </Link>
                                </div>
                                <Button className="bg-white text-black text-sm font-medium hover:bg-white/20 border border-gray-300 w-full rounded-sm flex items-center justify-center gap-2">
                                    <FaGoogle /> Continue with Google
                                </Button>
                            </section>
                            <div className="relative my-6 text-center">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[#E2E8E4]" />
                                </div>
                                <span className="relative bg-white px-3 text-[11px] font-semibold text-[#6B7872] uppercase">
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
                                                    <InputGroup className="rounded-sm">
                                                        <InputGroupInput
                                                            {...field}
                                                            id="register-form-name"
                                                            aria-invalid={fieldState.invalid}
                                                            placeholder="enter your name"
                                                            autoComplete="off"
                                                        />
                                                        <InputGroupAddon>
                                                            <User />
                                                        </InputGroupAddon>
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
                                                    <InputGroup className="rounded-sm">
                                                        <InputGroupInput
                                                            {...field}
                                                            id="login-form-email"
                                                            aria-invalid={fieldState.invalid}
                                                            placeholder="enter your email"
                                                            autoComplete="off"
                                                        />
                                                        <InputGroupAddon>
                                                            <Mail />
                                                        </InputGroupAddon>
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
                                                    <InputGroup className="rounded-sm">

                                                        <InputGroupInput
                                                            type={viewPassword ? "text" : "password"}
                                                            {...field}
                                                            id="login-form-password"
                                                            aria-invalid={fieldState.invalid}
                                                            placeholder="••••••••"
                                                            autoComplete="off"
                                                        />
                                                        <InputGroupAddon>
                                                            <Lock />
                                                        </InputGroupAddon>
                                                    </InputGroup>
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                    </FieldGroup>
                                    <Button className="bg-transparent hover:bg-transparent text-xs text-blue-500 hover:underline">
                                        Resend verification code
                                    </Button>
                                </form>
                            </section>
                        </CardContent>
                        <CardFooter>
                            <Field orientation="horizontal">
                                {/* <Link to="/verify-otp"> */}
                                <Button
                                    className="rounded-sm w-full bg-emerald-700 text-white hover:bg-emerald-800"
                                    type="submit"
                                    form="register-form"
                                >
                                    Send verification code
                                </Button>
                                {/* </Link> */}

                            </Field>
                        </CardFooter>
                    </Card>
                </section>
            </div>
        </div>
    );
}
