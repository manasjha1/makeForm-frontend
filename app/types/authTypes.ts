type registerType = {
  name: string;
  email: string;
  password: string;
  otp?: string;
};

type verify_otpType = {
  email: string;
  otp: string;
};

type resend_otpType = {
  email: string;
};

type loginType = {
  email: string;
  password: string;
};
