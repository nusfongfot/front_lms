import apiFetch from "@/helpers/interceptors";

export const getAllCoursesAPI = async () => {
  const link = "course/all";
  const { data } = await apiFetch.get(link);
  return data;
};

export const getCourseByFillterAPI = async (type: string, cate: string) => {
  const link = `/user/course/filter?type=${type}&cate=${cate}`;
  const { data } = await apiFetch.get(link);
  return data;
};

export const getCourseBySearch = async (type: string) => {
  const link = `/user/course/search?q=${type}`;
  const { data } = await apiFetch.get(link);
  return data;
};

export const createCourseAPI = async (body: object) => {
  const link = "/course/insert";
  const { data } = await apiFetch.post(link, body);
  return data;
};

export const deleteCourseAPI = async (id: string) => {
  const link = `/course/${id}`;
  const { data } = await apiFetch.delete(link);
  return data;
};

export const updateCourseAPI = async (id: string, body: object) => {
  const link = `/course/update/${id}`;
  const { data } = await apiFetch.put(link, body);
  return data;
};

export const getCourseByIdAPI = async (id: string) => {
  const link = `/course/${id}`;
  const { data } = await apiFetch.get(link);
  return data;
};

export const createLessionOfCourseAPI = async (body: object) => {
  const link = "/lession/insert";
  const { data } = await apiFetch.post(link, body);
  return data;
};

export const updateLessionOfCourseAPI = async (id: string, body: object) => {
  const link = `/lession/update/${id}`;
  const { data } = await apiFetch.put(link, body);
  return data;
};

export const getLessionOfCourseAPI = async (
  courseId: string,
  userId: number
) => {
  const link = `/lession/q?courseId=${courseId}&userId=${userId}`;
  const { data } = await apiFetch.get(link);
  return data;
};

export const deleteLessionOfCourseAPI = async (id: number) => {
  const link = `/lession/delete/${id}`;
  const { data } = await apiFetch.delete(link);
  return data;
};

export const publishCourseAPI = async (id: string) => {
  const link = `/course/publish?publish=${id}`;
  const { data } = await apiFetch.put(link);
  return data;
};

export const unPublishCourseAPI = async (id: string) => {
  const link = `/course/publish?unpublish=${id}`;
  const { data } = await apiFetch.put(link);
  return data;
};

// payment
export const freeEnrollmentCourseAPI = async (id: string) => {
  const link = `/check-enrollment/${id}`;
  const { data } = await apiFetch.get(link);
  return data;
};

export const paidStripeCourseAPI = async (id: string) => {
  const link = `/paid-enrollment/${id}`;
  const { data } = await apiFetch.post(link);
  return data;
};

export const stripePaidSuccussAPI = async (id: string) => {
  const link = `/stripe-success/${id}`;
  const { data } = await apiFetch.get(link);
  return data;
};

// end payment

export const getCourseUserByIdAPI = async (id: string) => {
  const link = `/user/course/${id}`;
  const { data } = await apiFetch.get(link);
  return data;
};

export const getCourseBrowseByIdAPI = async (id: string) => {
  const link = `/user/browse/${id}`;
  const { data } = await apiFetch.get(link);
  return data;
};

export const markCompleteAPI = async (body: object) => {
  const link = `/user/complete`;
  const { data } = await apiFetch.put(link, body);
  return data;
};

export const getLessonCompleteOfUser = async (courseId: string) => {
  const link = `/user/complete/${courseId}`;
  const { data } = await apiFetch.get(link);
  return data;
};

export const createLessonOfCourseAPI = async (body: object) => {
  const link = `/user/complete`;
  const { data } = await apiFetch.post(link, body);
  return data;
};
