import useServerData from "@/src/hooks/useServerData";
import { User } from "@prisma/client";
import { create } from "zustand";
import actionCreateUser from "./action-createUser";
import { toast } from "@/src/components/ui/use-toast";
import actionDeleteUser from "./action-deleteUser";

type useUsersStoreType = {
  userSelected: string | undefined;
  userSelectedFront: User | undefined;
  users: User[];
  changeUserSelected: (userId: string) => void;
  changeUserSelectedFront: (userSelectedFront: User) => void;
  getUsers: (userId: string) => Promise<void>;
  addUser: (user: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
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
  getUsers: async (ownerId) => {
    set({ users: await useServerData("user", { ownerId }) });
  },
  addUser: async (user) => {
    if (!user.ownerId || !user.name || !user.firstname || !user.email) return;
    actionCreateUser({
      name: user.name,
      firstname: user.firstname,
      email: user.email,
      ownerId: user.ownerId,
    })
      .then((user) => {
        set((state) => ({ users: [...state.users, user] }));
        toast({
          description: "Profil collabotateur créé avec succès",
        });
      })
      .catch((e) => {
        toast({
          variant: "destructive",
          description: e.message,
        });
      });
  },
  deleteUser: async (userId) => {
    await actionDeleteUser(userId)
      .then(() => {
        set((state) => ({
          users: state.users.filter((user) => user.id !== userId),
        }));
        toast({
          description: "Collaborateur supprimé",
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          description: error.message,
        });
      });
  },
}));

export default useUsersStore;
