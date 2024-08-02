import { use } from "react";
import useServerData from "@/src/hooks/useServerData";
import { Availability } from "@prisma/client";
import { create } from "zustand";
import actionCreateAvailability from "./action-createAvailability";
import actionDeleteAvailability from "./action-deleteAvailability";
import { endOfDay, startOfDay } from "date-fns";

type useAvailabilityStoreType = {
  availabilities: Availability[];
  loadingAvailability: boolean;
  createAvailability: (start: Date, end: Date, userId: string) => void;
  getAvailabilities: (userId: string, daySelected?: Date) => void;
  deleteAvailability: (availabilityId: string) => void;
};

const useAvailabilityStore = create<useAvailabilityStoreType>((set) => ({
  availabilities: [],
  loadingAvailability: false,
  createAvailability: async (startTime, endTime, userId) => {
    set({ loadingAvailability: true });
    const result = await actionCreateAvailability({
      startTime,
      endTime,
      userId,
    });
    set((state) => ({
      availabilities: [...state.availabilities, result],
    }));
    set({ loadingAvailability: false });
  },
  deleteAvailability: async (availabilityId) => {
    set({ loadingAvailability: true });
    const result = await actionDeleteAvailability(availabilityId);
    set((state) => ({
      availabilities: state.availabilities.filter((b) => b.id !== result.id),
    }));
    set({ loadingAvailability: false });
  },
  getAvailabilities: async (userId, daySelected) => {
    set({ loadingAvailability: true });
    //daySelected optional parameter for filtering availabilities
    const availabilities = await useServerData("availability", {
      ...(daySelected && {
        startTime: {
          gte: startOfDay(daySelected),
          lt: endOfDay(daySelected),
        },
      }),
      userId,
    });
    set({ availabilities });
    set({ loadingAvailability: false });
  },
}));

export default useAvailabilityStore;
