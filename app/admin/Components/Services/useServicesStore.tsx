import { Service } from "@prisma/client";
import { create } from "zustand";
import useServerData from "@/src/hooks/useServerData";
import actionCreateService from "./action-createService";
import actionDeleteService from "./action-deleteService";
import { toast } from "@/src/components/ui/use-toast";

type ServiceStoreType = {
  services: Service[];
  serviceSelected: Service | null;
  optionSelected: { name: string; price: number } | undefined;
  loadingService: boolean;
  changeServiceSelected: (service: Service | null) => void;
  changeOptionSelected: (
    option: { name: string; price: number } | undefined
  ) => void;
  getServices: (userId: string) => void;
  addService: (service: {
    name: string;
    price: number;
    duration: number;
    userId: string;
  }) => Promise<void>;
  removeService: (service: Service) => void;
};

const useServiceStore = create<ServiceStoreType>((set) => ({
  services: [],
  serviceSelected: null,
  optionSelected: undefined,
  loadingService: false,
  changeServiceSelected: (service) => set({ serviceSelected: service }),
  changeOptionSelected: (option) => set({ optionSelected: option }),
  getServices: async (userId) => {
    const services = await useServerData("service", { userId });
    set({ services });
  },
  addService: async (service) => {
    set({ loadingService: true });
    await actionCreateService({
      name: service.name,
      price: service.price * 100,
      duration: service.duration,
      userId: service.userId,
    }).then((service) => {
      set((state) => ({ services: [...state.services, service] }));
      set({ loadingService: false });
    });
  },
  removeService: async (service) => {
    set({ loadingService: true });
    await actionDeleteService({ service })
      .then((s) => {
        set((state) => ({
          services: state.services.filter((service) => service.id !== s.id),
        }));
        toast({
          description: "Service supprimé",
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          description: error.message,
        });
      })
      .finally(() => set({ loadingService: false }));
  },
}));

export default useServiceStore;
