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
    InputGroupText,
    InputGroupTextarea,
} from "~/src/components/ui/input-group"
import toast, { Toaster } from 'react-hot-toast';
import Header from "~/src/components/Header"
import type { SetStateAction } from "react"
import { LayoutFreeform, LucideForm } from "lucide-react"
import { Link } from "react-router"

const formSchema = z.object({
    title: z
        .string()
        .min(5, "Bug title must be at least 5 characters.")
        .max(32, "Bug title must be at most 32 characters."),
    description: z
        .string()
        .min(20, "Description must be at least 20 characters.")
        .max(100, "Description must be at most 100 characters."),
})

interface formProps {
    viewPage: toggleBtn;
    setViewPage: React.Dispatch<React.SetStateAction<toggleBtn>>;
}

export default function Login({ viewPage, setViewPage }: formProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
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
                            visual form architect
                        </p>
                    </div>
                </section>
                <section>
                    <Card className="w-full mx-auto sm:max-w-md">
                        <CardHeader className="grid items-center-safe justify-center">
                            <div className="flex items-center bg-[#f9f6f0] p-1 rounded-sm border border-[#E2E8E4]">
                                <Link to="/sign-in">
                                    <Button
                                        onClick={() => setViewPage("login")}
                                        className={`text-[12px] font-medium transition-all px-5 md:px-10 lg:px-20 rounded-sm ${viewPage !== "login" ? "bg-white hover:bg-white text-emerald-700 shadow" : "bg-transparent hover:bg-transparent text-gray-500 hover:text-black/80"}`}
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                                <Link to="/create-account">
                                    <Button
                                        onClick={() => setViewPage("register")}
                                        className={`text-[12px] font-medium transition-all px-5 md:px-10 lg:px-15 rounded-sm ${viewPage === "register" ? "bg-white hover:bg-white text-emerald-700 shadow" : "bg-transparent hover:bg-transparent text-gray-500 hover:text-black/80"}`}
                                    >
                                        Create Account
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                                <FieldGroup>
                                    <Controller
                                        name="title"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="form-rhf-demo-title">
                                                    Bug Title
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    id="form-rhf-demo-title"
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="Login button not working on mobile"
                                                    autoComplete="off"
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                    <Controller
                                        name="description"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="form-rhf-demo-description">
                                                    Description
                                                </FieldLabel>
                                                <InputGroup>
                                                    <InputGroupTextarea
                                                        {...field}
                                                        id="form-rhf-demo-description"
                                                        placeholder="I'm having an issue with the login button on mobile."
                                                        rows={6}
                                                        className="min-h-24 resize-none"
                                                        aria-invalid={fieldState.invalid}
                                                    />
                                                    <InputGroupAddon align="block-end">
                                                        <InputGroupText className="tabular-nums">
                                                            {field.value.length}/100 characters
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                                <FieldDescription>
                                                    Include steps to reproduce, expected behavior, and what
                                                    actually happened.
                                                </FieldDescription>
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
                            <Field orientation="horizontal">
                                <Button type="button" variant="outline" onClick={() => form.reset()}>
                                    Reset
                                </Button>
                                <Button type="submit" form="form-rhf-demo">
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
