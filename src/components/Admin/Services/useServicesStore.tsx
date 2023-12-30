import { Service } from '@prisma/client';
import {create} from 'zustand';
import useServerData from '../../useServerData';

type ServiceStoreType = {
  services: Service[];
  reLoadServices: (userId: string) => void;
  addService: (service: Service) => void;
  removeService: (service: Service) => void;
};

const useServiceStore = create<ServiceStoreType>(set => ({
  services: [],
  reLoadServices: async (userId: string) => {
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