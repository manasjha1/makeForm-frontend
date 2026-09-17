type registerType = {
  name: string;
  email: string;
  password: string;
};

type verify_otpType = {
  otp: string;
};

type resend_otpType = {
  resend_otp: string;
};

type loginType = {
  email: string;
  password: string;
};
