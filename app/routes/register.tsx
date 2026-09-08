import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "~/src/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/src/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "~/src/components/ui/field"
import { Input } from "~/src/components/ui/input"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
} from "~/src/components/ui/input-group"
import toast, { Toaster } from 'react-hot-toast';
import Header from "~/src/components/Header"
import type { SetStateAction } from "react"
import { LayoutFreeform, Lock, LucideForm, Mail, User } from "lucide-react"
import { Link } from "react-router"

const formSchema = z.object({
    name: z
        .string()
        .min(5, "name must be at least 5 characters")
        .max(20, "name must be at least 20 characters."),
    email: z
        .string()
        .min(22, "email must be at least 22 characters.")
        .max(32, "email must be at most 32 characters."),
    password: z
        .string()
        .min(20, "password must be at least 20 characters.")
        .max(50, "password must be at most 50 characters."),
})

interface formProps {
    viewPage: toggleBtn;
    setViewPage: React.Dispatch<React.SetStateAction<toggleBtn>>;
}

export default function Register({ viewPage, setViewPage }: formProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })
    function onSubmit(data: z.infer<typeof formSchema>) {
        toast.success("You submitted the following details")
        console.log("You submitted the following details", data);

    }


    return (
        <div>
            <Header viewPage={""} setViewPage={function (value: SetStateAction<toggleBtn>): void {
                throw new Error("Function not implemented.")
            }} />
            <div className="grid gap-6">
                {/* logo section */}
                <section className="flex-1 items-center justify-center m-auto gap-2 mt-20">
                    <div className="bg-emerald-700 rounded-lg inset-shadow-2xs p-2 w-fit mx-auto mb-3">
                        <LucideForm className="size-6 text-white" />
                    </div>
                    <div className="flex-col items-baseline">
                        <h4 className="text-black text-center text-xl font-bold">
                            make
                            <span className="text-emerald-700 text-xl font-bold">
                                Form
                            </span>
                        </h4>
                        <p className="text-center text-[10px] text-gray-700 font-normal uppercase">
                            create your account to start building custom forms
                        </p>
                    </div>
                </section>
                <section className="p-2 m-2">
                    <Card className="w-full mx-auto sm:max-w-md shadow-lg">
                        <CardContent>
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
                                                    <InputGroupInput  {...field}
                                                        id="register-form-name"
                                                        aria-invalid={fieldState.invalid}
                                                        placeholder="enter your name"
                                                        autoComplete="off" />
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
                                                    <InputGroupInput  {...field}
                                                        id="login-form-email"
                                                        aria-invalid={fieldState.invalid}
                                                        placeholder="enter your email"
                                                        autoComplete="off" />
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
                                                    <InputGroupInput {...field}
                                                        id="login-form-password"
                                                        aria-invalid={fieldState.invalid}
                                                        placeholder="••••••••"
                                                        autoComplete="off" />
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
                            </form>
                        </CardContent>
                        <CardFooter>
                            <Field className="grid items-center mx-auto" orientation="horizontal">
                                <Button className="rounded-sm border border-emerald-700 text-emerald-700 hover:bg-gray-500/5 hover:text-emerald-700" type="button" variant="outline" onClick={() => form.reset()}>
                                    Reset
                                </Button>
                                <Button className="rounded-sm bg-emerald-700 text-white hover:bg-emerald-800" type="submit" form="register-form">
                                    Submit
                                </Button>
                            </Field>
                        </CardFooter>
                    </Card>
                </section>
            </div>
        </div>
    )
}
