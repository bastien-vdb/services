import useServerData from "@/src/hooks/useServerData";
import { Availability, BookingStatus } from "@prisma/client";
import { create } from "zustand";
import actionCreateAvailability from "./action-createAvailability";
import actionDeleteAvailability from "./action-deleteAvailability";

type useAvailabilityStoreType = {
  availabilities: Availability[];
  loadingAvailability: boolean;
  initialiseAvailabilities: (availabilities: Availability[]) => void;
  createAvailability: (start: Date, end: Date) => void;
  getAvailabilities: (userId: string) => void;
  deleteAvailability: (availabilityId: string) => void;
};

const useAvailabilityStore = create<useAvailabilityStoreType>((set) => ({
  availabilities: [],
  loadingAvailability: false,
  initialiseAvailabilities: (availabilities) => set({ availabilities }),
  createAvailability: async (startTime, endTime) => {
    const result = await actionCreateAvailability({
      startTime,
      endTime,
    });
    set((state) => ({
      availabilities: [...state.availabilities, result],
    }));
  },
  deleteAvailability: async (availabilityId) => {
    const result = await actionDeleteAvailability(availabilityId);
    set((state) => ({
      availabilities: state.availabilities.filter((b) => b.id !== result.id),
    }));
  },
  getAvailabilities: async (userId: string) => {
    set({ loadingAvailability: true });
    const availabilities = await useServerData("availability", { userId });
    set({ availabilities });
    set({ loadingAvailability: false });
  },
}));

export default useAvailabilityStore;
