import { Service } from '@prisma/client';
import { create } from 'zustand';
import useServerData from '@/src/hooks/useServerData';

type ServiceStoreType = {
  services: Service[];
  serviceSelected: Service | null;
  initialiseServices: (services: Service[]) => void;
  changeServiceSelected: (service: Service | null) => void;
  reLoadServices: (userId: string) => void;
  addService: (service: Service) => void;
  removeService: (service: Service) => void;
};

const useServiceStore = create<ServiceStoreType>(set => ({
  services: [],
  serviceSelected: null,
  initialiseServices: (services) => set({ services }),
  changeServiceSelected: (service) => set({ serviceSelected: service }),
  reLoadServices: async (userId) => {
    const getServices = async () => {
      const services = await useServerData('service', { createdById: userId })
      set(({ services }));
    };
    getServices();
  },
  addService: (service) => set(state => ({ services: [...state.services, service] })),
  removeService: (service) => set(state => ({ services: state.services.filter(s => s.id !== service.id) })),
}));

export default useServiceStore;