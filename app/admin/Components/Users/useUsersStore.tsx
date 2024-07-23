import useServerData from "@/src/hooks/useServerData";
import { User } from "@prisma/client";
import { create } from "zustand";

type useUsersStoreType = {
  userSelected: string | undefined;
  userSelectedFront: User | undefined;
  users: User[];
  changeUserSelected: (userId: string) => void;
  changeUserSelectedFront: (userSelectedFront: User) => void;
  getUsers: (userId: string) => Promise<void>;
};

const useUsersStore = create<useUsersStoreType>((set) => ({
  userSelected: undefined,
  userSelectedFront: undefined,
  users: [],
  changeUserSelectedFront: async (userSelectedFront) => {
    set({ userSelectedFront });
  },
  changeUserSelected: async (userId) => {
    set({ userSelected: userId });
  },
  getUsers: async (userId) => {
    const users = await useServerData("user", { ownerId: userId });
    //Pour ajouter aussi l'utilisateur principal (celui dont l'ID est userId)
    const user = await useServerData("user", { id: userId });
    set({ users: [...users, ...user] });
  },
}));

export default useUsersStore;
