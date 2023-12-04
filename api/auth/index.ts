import apiFetch from "@/helpers/interceptors";

export const registerAPI = async (body: object) => {
  const link = "/auth/register";
  const { data } = await apiFetch.post(link, body);
  return data;
};

export const loginAPI = async (body: object) => {
  let link = "/auth/login";
  const { data } = await apiFetch.post(link, body);
  return data;
};

export const resetPassAPI = async (body: object) => {
  let link = "/auth/reset_pass";
  const { data } = await apiFetch.post(link, body);
  return data;
};
