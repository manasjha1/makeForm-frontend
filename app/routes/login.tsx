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
import { useState, type SetStateAction } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Link } from "react-router";
import { FaGoogle } from "react-icons/fa";

const formSchema = z.object({
  email: z
    .string()
    .min(5, "email must be at least 5 characters.")
    .max(32, "email must be at most 32 characters."),
  password: z
    .string()
    .min(8, "password must be at least 5 characters.")
    .max(20, "password must be at most 20 characters."),
});

interface formProps {
  viewPage: toggleBtn;
  setViewPage: React.Dispatch<React.SetStateAction<toggleBtn>>;
}

export default function Login({ viewPage, setViewPage }: formProps) {
  const [viewPassword, setViewPassword] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("response data", result);
    } catch (error) {
      console.error(error);
    }
    console.log("You submitted the following details", data);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header
        viewPage={""}
        setViewPage={function (value: SetStateAction<toggleBtn>): void {
          throw new Error("Function not implemented.");
        }}
      />
      <main className="mx-auto grid w-full max-w-2xl gap-4 px-3 py-6 sm:px-6 sm:py-10">
        {/* logo section */}
        <img
          className="mx-auto h-auto w-full max-w-[18rem] object-contain sm:max-w-[20rem]"
          src={makeForm_png}
          alt="makeForm_png"
        />
        <section className="w-full">
          <Card className="mx-auto w-full max-w-lg overflow-hidden shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <section className="mb-5">
                <div className="mb-4 flex w-full items-center rounded-sm border border-[#E2E8E4] bg-[#f9f6f0] p-1">
                  <Link className="min-w-0 flex-1" to="/sign-in">
                    <Button
                      className={`w-full rounded-sm px-2 text-[11px] font-medium transition-all sm:px-4 sm:text-xs ${viewPage !== "register" ? "bg-white text-emerald-700 shadow hover:bg-white" : "bg-transparent text-gray-500 hover:bg-transparent hover:text-black/80"}`}
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link className="min-w-0 flex-1" to="/create-account">
                    <Button
                      className={`w-full rounded-sm px-2 text-[11px] font-medium transition-all sm:px-4 sm:text-xs ${viewPage === "register" ? "bg-white text-emerald-700 shadow hover:bg-white" : "bg-transparent text-gray-500 hover:bg-transparent hover:text-black/80"}`}
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
                <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
                  <FieldGroup>
                    <Controller
                      name="email"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="login-form-email">
                            Email
                          </FieldLabel>
                          <InputGroup className="rounded-sm">
                            <InputGroupAddon>
                              <Mail />
                            </InputGroupAddon>
                            <InputGroupInput
                              {...field}
                              id="login-form-email"
                              aria-invalid={fieldState.invalid}
                              placeholder="jhon@gmail.com"
                              autoComplete="off"
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
                          <FieldLabel htmlFor="login-form-password">
                            Password
                          </FieldLabel>
                          <InputGroup className="rounded-sm">
                            <InputGroupAddon>
                              <Lock />
                            </InputGroupAddon>
                            <InputGroupInput
                              {...field}
                              type={viewPassword ? "text" : "password"}
                              id="login-form-password"
                              aria-invalid={fieldState.invalid}
                              placeholder="••••••••"
                              autoComplete="current-password"
                            />
                            <InputGroupAddon>
                              <button
                                type="button"
                                className="text-muted-foreground hover:text-foreground"
                                aria-label={viewPassword ? "Hide password" : "Show password"}
                                onClick={() => setViewPassword((visible) => !visible)}
                              >
                                {viewPassword ? <EyeOff /> : <Eye />}
                              </button>
                            </InputGroupAddon>
                          </InputGroup>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>
                  <Button type="button" className="bg-transparent px-0 text-xs text-blue-500 hover:bg-transparent hover:underline">
                    Resend verification code
                  </Button>
                </form>
              </section>
            </CardContent>
            <CardFooter className="p-4 pt-0 sm:p-6 sm:pt-0">
              <Field orientation="horizontal" className="w-full">
                <Button
                  className="rounded-sm w-full bg-emerald-700 text-white hover:bg-emerald-800"
                  type="submit"
                  form="login-form"
                >
                  Sign In
                </Button>
              </Field>
            </CardFooter>
          </Card>
        </section>
      </main>
    </div>
  );
}
