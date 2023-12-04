import { create } from "zustand";

export const useLoading = create((set: any) => ({
  isLoading: false,
  setLoading: (value: boolean) =>
    set((state: any) => ({
      ...state,
      isLoading: value,
    })),
}));
