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
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(50, "Password must be at most 50 characters."),
});

export function meta() {
    return [{ title: "Sign In | makeForm" }, { name: "description", content: "Sign in to your makeForm account." }];
}

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
    <div className="auth-page min-h-screen bg-[#f8f9fa]">
      <Toaster position="top-right" />
      <Header />
      <main className="mx-auto grid w-full max-w-xl gap-4 px-3 py-6 sm:px-6 sm:py-10">
        {/* logo section */}
        <img
          className="mx-auto h-auto w-full max-w-[14rem] object-contain sm:max-w-[18rem]"
          src={makeForm_png}
          alt="makeForm"
        />
        <section className="w-full">
          <Card className="mx-auto w-full max-w-lg overflow-hidden shadow-[0_10px_25px_-5px_rgba(25,28,29,0.08),0_4px_10px_-3px_rgba(25,28,29,0.04)] border border-[#e1e3e4] bg-white rounded-2xl">
            <CardContent className="p-4 sm:p-6">
              <section className="mb-5">
                <div className="mb-4 flex w-full items-center rounded-lg border border-[#e1e3e4] bg-[#f3f4f5] p-1">
                  <Button asChild variant="ghost" className="min-w-0 flex-1 rounded-md text-xs bg-white text-[#3525cd] shadow-xs font-semibold">
                    <Link to="/sign-in" aria-current="page">Sign In</Link>
                  </Button>
                  <Button asChild variant="ghost" className="min-w-0 flex-1 rounded-md text-xs text-[#464555] hover:text-[#191c1d]">
                    <Link to="/create-account">Create Account</Link>
                  </Button>
                </div>
                <Button disabled type="button" title="Google sign-in is not configured" className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#e1e3e4] bg-white text-sm font-medium text-[#464555] hover:bg-[#f3f4f5]">
                  <FaGoogle /> Google sign-in unavailable
                </Button>
              </section>

              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#e1e3e4]" />
                </div>
                <span className="relative bg-white px-3 text-[11px] font-semibold uppercase text-[#464555]">
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
                          <InputGroup className="rounded-lg border-[#e1e3e4] focus-within:border-[#4f46e5] focus-within:ring-2 focus-within:ring-[#4f46e5]/20">
                            <InputGroupInput
                              {...field}
                              id="login-form-email"
                              type="email"
                              autoCapitalize="none"
                              spellCheck={false}
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
                          <InputGroup className="rounded-lg border-[#e1e3e4] focus-within:border-[#4f46e5] focus-within:ring-2 focus-within:ring-[#4f46e5]/20">
                            <InputGroupInput
                              type={viewPassword ? "text" : "password"}
                              {...field}
                              id="login-form-password"
                              aria-invalid={fieldState.invalid}
                              placeholder="••••••••"
                              autoComplete="current-password"
                            />
                            <InputGroupAddon>
                              <button type="button" className="rounded p-1 focus-visible:outline-2 focus-visible:outline-[#4f46e5]" aria-label={viewPassword ? "Hide password" : "Show password"} aria-pressed={viewPassword} onClick={() => setViewPassword((visible) => !visible)}>{viewPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</button>
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
                  className="rounded-lg w-full bg-[#3525cd] text-white hover:bg-[#4f46e5] disabled:opacity-60 shadow-[0_4px_14px_0_rgba(79,70,229,0.35)] font-semibold py-2.5"
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
