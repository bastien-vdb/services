import { Service } from "@prisma/client";
import { create } from "zustand";
import useServerData from "@/src/hooks/useServerData";
import actionCreateService from "./action-createService";
import actionDeleteService from "./action-deleteService";

type ServiceStoreType = {
  services: Service[];
  serviceSelected: Service | null;
  loadingService: boolean;
  initialiseServices: (services: Service[]) => void;
  changeServiceSelected: (service: Service | null) => void;
  getServices: (userId: string) => void;
  addService: (service: {
    name: string;
    price: number;
    duration: number;
  }) => Promise<void>;
  removeService: (service: Service) => void;
};

const useServiceStore = create<ServiceStoreType>((set) => ({
  services: [],
  serviceSelected: null,
  loadingService: false,
  initialiseServices: (services) => set({ services }),
  changeServiceSelected: (service) => set({ serviceSelected: service }),
  getServices: async (userId) => {
    const services = await useServerData("service", { createdById: userId });
    set({ services });
  },
  addService: async (service) => {
    set({ loadingService: true });
    await actionCreateService({
      name: service.name,
      price: service.price * 100,
      duration: service.duration,
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
      })
      .finally(() => set({ loadingService: false }));
  },
}));

export default useServiceStore;
