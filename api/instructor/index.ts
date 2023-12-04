import apiFetch from "@/helpers/interceptors";

export const becomeInstructorAPI = async () => {
  const link = "/instructor/insert";
  const { data } = await apiFetch.post(link);
  return data;
};

export const getCoursesOfInstructorAPI = async () => {
  const link = `/instructor/courses`;
  const { data } = await apiFetch.get(link);
  return data;
};

export const getAccountStatusAPI = async () => {
  const link = `/instructor/status`;
  const { data } = await apiFetch.get(link);
  return data;
};

export const getStudentEnrolled = async () => {
  const link = `/instructor/student-count`;
  const { data } = await apiFetch.get(link);
  return data;
};

export const getInstructorBalance = async () => {
  const link = `/instructor/balance`;
  const { data } = await apiFetch.get(link);
  return data;
};

export const instructorPayoutSettingsAPI = async () => {
  const link = `/instructor/payout-settings`;
  const { data } = await apiFetch.get(link);
  return data;
};
