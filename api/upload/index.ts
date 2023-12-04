import apiFetch from "@/helpers/interceptors";

export const uploadImageAPI = async (body: object) => {
  const link = "/upload/single";
  const { data } = await apiFetch.post(link, body);
  return data;
};

export const uploadVideoAPI = async (body: object) => {
  const link = "/upload/single/video";
  const { data } = await apiFetch.post(link, body);
  return data;
};
