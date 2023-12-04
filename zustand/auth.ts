import { create } from "zustand";

const useInfo = create((set: any) => ({
  accInfo: {
    id: 0,
    email: "",
    name: "",
    picture: "",
    role: "",
    stripe_account_id: "",
    stripe_seller: {},
    stripe_session: "",
    courses: [],
  },
  setInfo: (value: object) =>
    set((state: any) => ({
      accInfo: value,
    })),
}));

export default useInfo;
