import { MoveLeft, RefreshCwIcon } from "lucide-react";
import type { SetStateAction } from "react";
import Header from "~/src/components/Header";
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

export default function OtpForm() {
  return (
    <div>
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
              <InputOTP maxLength={6} id="otp-verification" required>
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
              <FieldDescription></FieldDescription>
            </Field>
          </CardContent>
          <CardFooter>
            <Field>
              <Button
                type="submit"
                className="w-full bg-emerald-700 text-white hover:bg-emerald-800"
              >
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
