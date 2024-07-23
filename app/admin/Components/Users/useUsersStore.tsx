import { User } from "@prisma/client";
import { create } from "zustand";

type useUsersStoreType = {
  userSelected: string | undefined;
  changeUserSelected: (userId: string) => void;
};

const useUsersStore = create<useUsersStoreType>((set) => ({
  userSelected: undefined,
  changeUserSelected: async (userId) => {
    set({ userSelected: userId });
  },
}));

export default useUsersStore;
