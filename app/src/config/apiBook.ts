const AUTH_BASEURL = import.meta.env.VITE_API_BASE_URL;

const API_URLS = {
  AUTH: {
    REGISTER_EMAIL: `${AUTH_BASEURL}/auth/register`,
    VERIFY_OTP: `${AUTH_BASEURL}/auth/verify-email`,
    RESEND_OTP: `${AUTH_BASEURL}/auth/resend-verification`,
    LOGIN: `${AUTH_BASEURL}/auth/login`,
  },
};

export default API_URLS;
