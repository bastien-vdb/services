import useServerData from "@/src/hooks/useServerData";
import { Booking } from "@prisma/client";
import { now } from "moment";
import { create } from "zustand";

type useBookingStoreType = {
  bookings: Booking[];
  initialiseBookings: (bookings: Booking[]) => void;
  removeBooking: (booking: Booking) => void;
  reloadBookings: (createdById: string) => void;
};

const useBookingStore = create<useBookingStoreType>((set) => ({
  bookings: [],
  initialiseBookings: (bookings) => set({ bookings }),
  removeBooking: (booking) => {
    set((state) => ({
      bookings: state.bookings.map((b) => {
        if (b.id === booking.id) b.isAvailable = !b.isAvailable;
        return b;
      }),
    }));
  },
  reloadBookings: async (userId: string) => {
    const getBookings = async () => {
      const bookings = await useServerData("booking", { userId });
      set({ bookings });
    };
    getBookings();
  },
}));

export default useBookingStore;
