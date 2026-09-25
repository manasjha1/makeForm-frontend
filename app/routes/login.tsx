import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "~/src/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "~/src/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/src/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/src/components/ui/input-group";
import makeForm_png from "~/assests/makeForm_login.png";
import toast, { Toaster } from "react-hot-toast";
import Header from "~/src/components/Headers";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { FaGoogle } from "react-icons/fa";
import { useLoginAccount } from "~/src/hooks/mutation";

const formSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(50, "Password must be at most 50 characters."),
});

export default function Login() {
  const [viewPassword, setViewPassword] = useState(false);
  const navigate = useNavigate();
  const { mutate: loginAccount, isPending } = useLoginAccount();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    loginAccount(
      {
        login: {
          email: data.email.trim().toLowerCase(),
          password: data.password,
        },
      },
      {
        onSuccess: (response: any) => {
          const resData = response?.data || response;

          if (resData?.accessToken) {
            localStorage.setItem("token", resData.accessToken);
          }
          if (resData?.refreshToken) {
            localStorage.setItem("refreshToken", resData.refreshToken);
          }
          if (resData?.user) {
            localStorage.setItem("user", JSON.stringify(resData.user));
          }

          toast.success("Welcome back!");
          navigate("/form-builder");
        },
        onError: (err: any) => {
          toast.error(err?.message || "Invalid email or password.");
          if (err?.message?.toLowerCase().includes("verify")) {
            localStorage.setItem("pending_verification_email", data.email);
            setTimeout(() => {
              navigate("/verify-otp", { state: { email: data.email } });
            }, 1500);
          }
        },
      }
    );
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#faf8f5]">
      <Toaster position="top-right" />
      <Header />
      <main className="mx-auto grid w-full max-w-2xl gap-4 px-3 py-6 sm:px-6 sm:py-10">
        {/* logo section */}
        <img
          className="mx-auto h-auto w-full max-w-[18rem] object-contain sm:max-w-[20rem]"
          src={makeForm_png}
          alt="makeForm_png"
        />
        <section className="w-full">
          <Card className="mx-auto w-full max-w-lg overflow-hidden shadow-lg border border-[#E2E8E4] bg-white rounded-xl">
            <CardContent className="p-4 sm:p-6">
              <section className="mb-5">
                <div className="mb-4 flex w-full items-center rounded-sm border border-[#E2E8E4] bg-[#f9f6f0] p-1">
                  <Link className="min-w-0 flex-1" to="/sign-in">
                    <Button
                      className={`w-full rounded-sm px-2 text-[11px] font-medium transition-all sm:px-4 sm:text-xs ${
                        viewPage !== "register"
                          ? "bg-white text-emerald-700 shadow hover:bg-white"
                          : "bg-transparent text-gray-500 hover:bg-transparent hover:text-black/80"
                      }`}
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link className="min-w-0 flex-1" to="/create-account">
                    <Button
                      className={`w-full rounded-sm px-2 text-[11px] font-medium transition-all sm:px-4 sm:text-xs ${
                        viewPage === "register"
                          ? "bg-white text-emerald-700 shadow hover:bg-white"
                          : "bg-transparent text-gray-500 hover:bg-transparent hover:text-black/80"
                      }`}
                    >
                      Create Account
                    </Button>
                  </Link>
                </div>
                <Button className="flex w-full items-center justify-center gap-2 rounded-sm border border-gray-300 bg-white text-sm font-medium text-black hover:bg-gray-50">
                  <FaGoogle /> Continue with Google
                </Button>
              </section>

              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E2E8E4]" />
                </div>
                <span className="relative bg-white px-3 text-[11px] font-semibold uppercase text-[#6B7872]">
                  Or with work email
                </span>
              </div>

              <section>
                <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
                  <FieldGroup>
                    <Controller
                      name="email"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="login-form-email">
                            Email Address
                          </FieldLabel>
                          <InputGroup className="rounded-sm">
                            <InputGroupInput
                              {...field}
                              id="login-form-email"
                              aria-invalid={fieldState.invalid}
                              placeholder="enter your email"
                              autoComplete="email"
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
                          <FieldLabel htmlFor="login-form-password">
                            Password
                          </FieldLabel>
                          <InputGroup className="rounded-sm">
                            <InputGroupInput
                              type={viewPassword ? "text" : "password"}
                              {...field}
                              id="login-form-password"
                              aria-invalid={fieldState.invalid}
                              placeholder="••••••••"
                              autoComplete="current-password"
                            />
                            <InputGroupAddon>
                              {!viewPassword ? (
                                <Eye onClick={() => setViewPassword(!viewPassword)} className="cursor-pointer" />
                              ) : (
                                <EyeOff onClick={() => setViewPassword(!viewPassword)} className="cursor-pointer" />
                              )}
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
              </section>
            </CardContent>

            <CardFooter className="p-4 pt-0 sm:p-6 sm:pt-0">
              <Field orientation="horizontal" className="w-full">
                <Button
                  className="rounded-sm w-full bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-60"
                  type="submit"
                  form="login-form"
                  disabled={isPending}
                >
                  {isPending ? "Signing In..." : "Sign In"}
                </Button>
              </Field>
            </CardFooter>
          </Card>
        </section>
      </main>
    </div>
  );
}
