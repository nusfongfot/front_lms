import apiFetch from "@/helpers/interceptors";

export const getReviewOfCourseAPI = async (id: string) => {
  const link = `/reviews/course/${id}`;
  const { data } = await apiFetch.get(link);
  return data;
};

export const filterStarAPIOfCourse = async (courseId: string, star: number) => {
  const link = `/reviews/star?courseId=${courseId}&star=${star}`;
  const { data } = await apiFetch.get(link);
  return data;
};

export const createReviewAPI = async (body: object) => {
  const link = `/reviews/insert`;
  const { data } = await apiFetch.post(link, body);
  return data;
};
