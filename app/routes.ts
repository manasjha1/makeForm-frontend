import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("form-builder", "./routes/formBuilder.tsx"),
  route("live-preview", "./routes/livePreview.tsx"),
  route("create-account", "./routes/register.tsx"),
  route("sign-in", "./routes/login.tsx"),
  route("verify-otp", "./routes/otpForm.tsx"),
] satisfies RouteConfig;
