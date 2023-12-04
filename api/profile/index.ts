import apiFetch from "@/helpers/interceptors";

export const getProfileAPI = async () => {
  const link = "/profile";
  const { data } = await apiFetch.get(link);
  return data;
};

export const updateImageProfileAPI = async (body: object) => {
  const link = "/profile/image";
  const { data } = await apiFetch.post(link, body);
  return data;
};

export const updateValuesProfileAPI = async (body: object) => {
  const link = "/profile/update";
  const { data } = await apiFetch.post(link, body);
  return data;
};
