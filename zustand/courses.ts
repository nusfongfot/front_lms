import { create } from "zustand";

export const useCourseStore = create((set: any) => ({
  courses: [],
  setCourses: (value: any[]) =>
    set((state: any[]) => ({
      ...state,
      courses: value,
    })),
}));
