import apiFetch from "@/helpers/interceptors";

export const getAllQuestionsAPI = async (id: string) => {
  const link = `/questions/all/${id}`;
  const { data } = await apiFetch.get(link);
  return data;
};
export const createQuestionAPI = async (body: object) => {
  const link = "/questions/insert";
  const { data } = await apiFetch.post(link, body);
  return data;
};
export const replyBackOfQuestionsAPI = async (body: object) => {
  const link = "/reply/insert";
  const { data } = await apiFetch.post(link, body);
  return data;
};

export const getReplyBackQuestionAPI = async () => {
  const link = "/questions/reply-back";
  const { data } = await apiFetch.get(link);
  return data;
};
