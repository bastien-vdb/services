import useServerData from "@/src/hooks/useServerData";
import { Booking } from "@prisma/client";
import { create } from "zustand";
import actionDeleteBooking from "./action-deleteBooking";
import actionGetBooking from "./action-getBooking";

type useBookingsStoreType = {
  bookings: Booking[];
  loadingBookings: boolean;
  initialiseBookings: (bookings: Booking[]) => void;
  deleteBooking: (bookingId: string) => void;
  getBookings: (userId: string) => void;
};

const useBookingsStore = create<useBookingsStoreType>((set) => ({
  bookings: [],
  loadingBookings: false,
  initialiseBookings: (bookings) => set({ bookings }),
  deleteBooking: async (bookingId) => {
    return await actionDeleteBooking(bookingId)
      .then(() => {
        set((state) => ({
          bookings: state.bookings.filter((b) => b.id !== bookingId),
        }));
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => set({ loadingBookings: false }));
  },
  getBookings: async (userId: string) => {
    set({ loadingBookings: true });
    return await actionGetBooking(userId)
      .then((bookings) => set({ bookings }))
      .finally(() => set({ loadingBookings: false }));
  },
}));

export default useBookingsStore;
