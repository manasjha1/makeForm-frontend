import { useMutation } from "@tanstack/react-query";
import API_URLS from "~/src/config/apiBook";
import { registerAccount } from "~/src/services/auth";

export const useRegisterAccount = () => {
  return useMutation({
    mutationKey: [API_URLS.AUTH.REGISTER_EMAIL],
    mutationFn: ({ register }: { register: registerType }) =>
      registerAccount({ register }),
  });
};
