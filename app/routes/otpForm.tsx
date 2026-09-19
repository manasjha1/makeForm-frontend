import { useEffect, useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useLocation, useNavigate, Link } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, RefreshCwIcon, ShieldCheck } from "lucide-react";
import Header from "~/src/components/Headers";
import { Button } from "~/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/src/components/ui/card";
import { Field, FieldLabel } from "~/src/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "~/src/components/ui/input-otp";
import { useOTP_Verification, useResendOTP } from "~/src/hooks/mutation";

export default function OtpForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState<string>("");

  const [otp, setOtp] = useState<string>("");
  const [cooldown, setCooldown] = useState<number>(60);

  const { mutate: verifyOtp, isPending: isVerifying } = useOTP_Verification();
  const { mutate: resendOtp, isPending: isResending } = useResendOTP();

  // Cooldown countdown timer (60s)
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Browser storage is only available after hydration.
  useEffect(() => {
    const pendingEmail = location.state?.email ||
      localStorage.getItem("pending_verification_email") || "";
    setEmail(pendingEmail);
    if (!pendingEmail) {
      toast.error("Please enter your details to receive an OTP first.");
      navigate("/create-account");
    }
  }, [location.state?.email, navigate]);

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (isVerifying) return;

    if (!/^\d{6}$/.test(otp)) {
      toast.error("Please enter a valid 6-digit OTP code.");
      return;
    }

    if (!email) {
      toast.error("Missing email address. Please register again.");
      navigate("/create-account");
      return;
    }

    verifyOtp(
      {
        otp_verification: {
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
        },
      },
      {
        onSuccess: (response: any) => {
          const resData = response?.data || response;

          // Save authentication tokens and user profile
          if (resData?.accessToken) {
            localStorage.setItem("token", resData.accessToken);
          }
          if (resData?.refreshToken) {
            localStorage.setItem("refreshToken", resData.refreshToken);
          }
          if (resData?.user) {
            localStorage.setItem("user", JSON.stringify(resData.user));
          }

          // Clean up pending email
          localStorage.removeItem("pending_verification_email");

          toast.success(resData?.message || "Email verified successfully!");

          // 👉 Navigate directly to form-builder page
          navigate("/form-builder");
        },
        onError: (error: any) => {
          toast.error(error?.message || "Invalid or expired OTP code.");
        },
      }
    );
  };

  const handleResend = () => {
    if (cooldown > 0 || isResending) return;

    if (!email) {
      toast.error("No email specified. Please register first.");
      navigate("/create-account");
      return;
    }

    resendOtp(
      {
        resend_otp: {
          email: email.trim().toLowerCase(),
        },
      },
      {
        onSuccess: (response: any) => {
          const resData = response?.data || response;
          toast.success(resData?.message || "A new verification code has been sent!");
          setCooldown(60);
          setOtp("");
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to resend verification code.");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      <Toaster position="top-right" />
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md shadow-xl border border-[#E2E8E4] bg-white rounded-xl overflow-hidden">
          {/* Top Decorative Header */}
          <div className="h-2 bg-linear-to-r from-emerald-600 via-emerald-500 to-teal-400" />

          <CardHeader className="text-center pt-8 pb-4">
            <div className="mx-auto w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mb-3 border border-emerald-100 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 tracking-tight">
              Verify your email
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-2 px-2">
              We sent a 6-digit verification code to: <br />
              <span className="font-semibold text-emerald-700 break-all">{email}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 py-4">
            <form onSubmit={handleVerify} id="otp-form" className="space-y-6">
              <Field className="space-y-3">
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="otp-input" className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                    6-Digit Code
                  </FieldLabel>

                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={handleResend}
                    disabled={cooldown > 0 || isResending}
                    className="text-xs text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 disabled:text-gray-400 gap-1.5 font-medium transition-colors"
                  >
                    <RefreshCwIcon className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
                    {cooldown > 0 ? `Resend in ${cooldown}s` : isResending ? "Sending..." : "Resend Code"}
                  </Button>
                </div>

                {/* OTP Input component */}
                <div className="flex justify-center py-2">
                  <InputOTP
                    maxLength={6}
                    id="otp-input"
                    value={otp}
                    onChange={setOtp}
                    pattern={REGEXP_ONLY_DIGITS}
                    pasteTransformer={(value) => value.replace(/[\s-]/g, "")}
                    disabled={isVerifying}
                    autoFocus
                  >
                    <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl *:data-[slot=input-otp-slot]:font-bold *:data-[slot=input-otp-slot]:border-gray-300 focus-within:*:data-[slot=input-otp-slot]:border-emerald-600">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator className="mx-2 text-gray-400 font-bold" />
                    <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl *:data-[slot=input-otp-slot]:font-bold *:data-[slot=input-otp-slot]:border-gray-300 focus-within:*:data-[slot=input-otp-slot]:border-emerald-600">
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <p className="text-xs text-center text-gray-500">
                  Code expires in <span className="font-semibold text-rose-600">60 seconds</span>.
                </p>
              </Field>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 px-6 pb-8 pt-2">
            <Button
              type="submit"
              form="otp-form"
              disabled={isVerifying || otp.length !== 6}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? "Verifying..." : "Verify & Continue"}
            </Button>

            <div className="flex items-center justify-between w-full text-xs text-gray-500 border-t border-gray-100 pt-4">
              <Link
                to="/create-account"
                className="flex items-center gap-1.5 text-gray-600 hover:text-emerald-700 transition-colors font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Change Email
              </Link>
              <Link
                to="/sign-in"
                className="text-gray-600 hover:text-emerald-700 transition-colors font-medium"
              >
                Already verified? Sign In
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
