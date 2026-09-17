import { zodResolver } from "@hookform/resolvers/zod";
import { MoveLeft, RefreshCwIcon } from "lucide-react";
import { useState, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import z, { minLength } from "zod";
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
import { Field, FieldDescription, FieldLabel } from "~/src/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "~/src/components/ui/input-otp";
import { useOTP_Verification } from "~/src/hooks/mutation";

const otpSchema = z.object({
  otp: z
    .string()
    .trim()
    .min(1, "otp is required")
    .length(6, "otp must be 6 digits")
    .regex(/^\d{6}$/, "Please enter the 6-digit verification code"),
});

type otpFormType = z.infer<typeof otpSchema>

export default function OtpForm() {
  const navigate = useNavigate()
  const verify_otp = useOTP_Verification()
  const [otp, setOtp] = useState("")

  const onSubmit = async (data: z.infer<typeof otpSchema>) => {
    verify_otp(
      {
        otp_verification: {
          otp: data.otp
        }
      },
      {
        onSuccess: (data: any) => {
          console.log("result goted", data);
          data.cookie("refreshToken", data?.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
          toast.success("OTP Verified")

        },
        onError: () => {
          toast.error("Invailid OTP")
          console.log("otp validation", data);

        }
      }
    )
    console.log("otp result ", verify_otp);
  }

  return (
    <div className="min-h-screen">
      <Header viewPage={""} setViewPage={function (value: SetStateAction<toggleBtn>): void {
        throw new Error("Function not implemented.");
      }} />
      <div className="w-full h-screen grid grid-cols-1 gap-0 items-center justify-center">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Verify your login</CardTitle>
            <CardDescription>
              Enter the verification code we sent to your email address:{" "}
              <span className="font-medium">m@example.com</span>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="otp-verification">
                  Verification code
                </FieldLabel>
                <Button variant="outline" size="xs">
                  <RefreshCwIcon />
                  Resend Code
                </Button>
              </div>
              <InputOTP maxLength={6} id="otp-verification" typeof="number" required>
                <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator className="mx-2" />
                <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <FieldDescription>
              </FieldDescription>
            </Field>
          </CardContent>
          <CardFooter>
            <Field>
              <Button type="submit" onClick={() => onSubmit({ otp })} className="w-full">
                Verify
              </Button>
              <div className="text-sm text-muted-foreground">
                Having trouble signing in?{" "}
                <a
                  href="#"
                  className="underline underline-offset-4 transition-colors hover:text-primary"
                >
                  Contact support
                </a>
              </div>
            </Field>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
