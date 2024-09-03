import useServerData from "@/src/hooks/useServerData";
import { User } from "@prisma/client";
import { create } from "zustand";
import actionCreateUser from "./action-createUser";
import { toast } from "@/src/components/ui/use-toast";
import actionDeleteUser from "./action-deleteUser";
import actionSwitchActiveUser from "./action-switchActiveUser";

type useUsersStoreType = {
  userSelected: User | undefined;
  userSelectedFront: User | undefined;
  users: User[];
  connectedSessionUserFull: User | undefined;
  setConnectedSessionUserFull: (userId: string) => void;
  findUser: (userId: string) => Promise<User> | never;
  changeUserSelected: (userId: string) => void;
  changeUserSelectedFront: (userSelectedFront: User) => void;
  getUsersByOwnerId: (userId: string) => Promise<void>;
  addUser: (user: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  switchActiveUser: (userId: string, activate: boolean) => Promise<void>;
  loadingUsers: boolean;
};

const useUsersStore = create<useUsersStoreType>((set, get) => ({
  userSelected: undefined,
  userSelectedFront: undefined,
  users: [],
  connectedSessionUserFull: undefined,
  loadingUsers: false,
  setConnectedSessionUserFull: async (userId) => {
    const userFound = await get().findUser(userId);
    set({ connectedSessionUserFull: userFound });
  },
  findUser: async (userId) => {
    try {
      const [user] = await useServerData("user", { id: userId });
      return user;
    } catch (error) {
      throw new Error("Erreur lors de la récupération de l'utilisateur");
    }
  },
  changeUserSelectedFront: async (userSelectedFront) => {
    set({ userSelectedFront });
  },
  changeUserSelected: async (userId) => {
    const userFound = await get().findUser(userId);
    set({ userSelected: userFound });
  },
  getUsersByOwnerId: async (ownerId) => {
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
  switchActiveUser: async (userId, activate) => {
    set({ loadingUsers: true });
    await actionSwitchActiveUser({
      id: userId,
      active: activate,
    })
      .then(() => {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, active: activate } : u
          ),
        }));
        toast({
          description: "Collaborateur modifié",
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          description: error.message,
        });
      })
      .finally(() => set({ loadingUsers: false }));
  },
}));

export default useUsersStore;
