import { useMutation } from "@tanstack/react-query";
import API_URLS from "~/src/config/apiBook";
import { OTP_Verify, registerAccount } from "~/src/services/auth";

export const useRegisterAccount = () => {
  return useMutation({
    mutationKey: [API_URLS.AUTH.REGISTER_EMAIL],
    mutationFn: ({ register }: { register: registerType }) =>
      registerAccount({ register }),
  });
};

export const useOTP_Verification = () => {
  return useMutation({
    mutationKey: [API_URLS.AUTH.VERIFY_OTP],
    mutationFn: ({ otp_verification }: { otp_verification: verify_otpType }) =>
      OTP_Verify({ otp_verification }),
  });
};
