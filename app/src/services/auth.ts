import API_URLS from "../config/apiBook";
import { apiHandler } from "./httpHandler";

export const registerAccount = async ({
  register,
}: {
  register: registerType;
}) => {
  const response = await apiHandler({
    url: `${API_URLS.AUTH.REGISTER_EMAIL}`,
    method: `POST`,
    body: register,
  });
  return response;
};

export const OTP_Verify = async ({
  otp_verification,
}: {
  otp_verification: verify_otpType;
}) => {
  const response = await apiHandler({
    url: `${API_URLS.AUTH.VERIFY_OTP}`,
    method: `POST`,
    body: otp_verification,
  });
  return response;
};
