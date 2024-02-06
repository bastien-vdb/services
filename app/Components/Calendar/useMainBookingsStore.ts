import useServerData from "@/src/hooks/useServerData";
import { Booking } from "@prisma/client";
import moment from "moment";
import { create } from "zustand";

type useMainBookingsStoreType = {
  bookings: Booking[];
  daySelected: Date | undefined;
  selectDay: (daySelected: Date) => void;
  initialiseBookings: (bookings: Booking[]) => void;
  removeBooking: (booking: Booking) => void;
  reloadBookings: (createdById: string, dateSelected: Date) => void;
  loading: boolean;
};

const useMainBookingsStore = create<useMainBookingsStoreType>((set) => ({
  bookings: [],
  loading: false,
  daySelected: undefined,
  selectDay: (daySelected) => set({ daySelected }),
  initialiseBookings: (bookings) => set({ bookings }),
  removeBooking: (booking) => {
    set((state) => ({ bookings: state.bookings.filter((b) => b.id !== booking.id) }));
  },
  reloadBookings: async (userId, dateSelected) => {
    const getBookings = async () => {
      set({ loading: true });
      const bookings = await useServerData("booking", {
        startTime: {
          gte: moment(dateSelected).startOf("day").toDate(),
          lt: moment(dateSelected).endOf("day").toDate(),
        },
        isAvailable: true,
        payed:false,
        userId,
      });
      set({ bookings });
      set({ loading: false });
    };
    getBookings();
  },
}));

export default useMainBookingsStore;
