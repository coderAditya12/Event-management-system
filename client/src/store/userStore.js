import { devtools, persist } from "zustand/middleware";
import { create } from "zustand";

const userStore = create(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set({ user: user }),
      }),
      { name: "user-storage" }
    )
  )
);

export default userStore;
