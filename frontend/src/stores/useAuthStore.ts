import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { subscribeWithSelector } from "zustand/middleware";

type UserSlice = {
  name: string;
  setName: (name: string) => void;
};

type AuthSlice = {
  accessToken: string;
  setToken: (accessToken: string) => void;
  clearToken: () => void;
};

type Store = UserSlice & AuthSlice;

export const createUserSlice = (set: any, get: any): UserSlice => ({
  name: "",
  setName: (name: string) => set({ name }),
});

export const createAuthSlice = (set: any): AuthSlice => ({
  accessToken: "",
  setToken: (accessToken: string) => {
    set((state: { accessToken: string }) => {
      state.accessToken = accessToken;
    });
  },
  clearToken: () => {
    set({ accessToken: "" });
  },
});

// Store creation
export const useStore = create<Store>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set: any, get: any) => ({
          ...createUserSlice(set, get),
          ...createAuthSlice(set),
        }))
      ),
      {
        name: "local-storage",
        storage: createJSONStorage(() => localStorage), // sessionStorage, AsyncStorage, IndexedDB
      }
    )
  )
);
