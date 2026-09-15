type registerType = {
  name: string;
  email: string;
  password: string;
};

type verify_otpType = {
  otp: number;
};

type resend_otpType = {
  resend_otp: number;
};

type loginType = {
  email: string;
  password: string;
};
