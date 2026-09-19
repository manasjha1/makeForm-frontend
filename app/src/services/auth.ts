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
  return response.data;
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
  return response.data;
};

export const resendOTP = async ({
  resend_otp,
}: {
  resend_otp: resend_otpType;
}) => {
  const response = await apiHandler({
    url: `${API_URLS.AUTH.RESEND_OTP}`,
    method: `POST`,
    body: resend_otp,
  });
  return response.data;
};

export const loginAccount = async ({
  login,
}: {
  login: loginType;
}) => {
  const response = await apiHandler({
    url: `${API_URLS.AUTH.LOGIN}`,
    method: `POST`,
    body: login,
  });
  return response.data;
};
