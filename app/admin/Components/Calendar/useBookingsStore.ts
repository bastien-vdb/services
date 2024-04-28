import useServerData from "@/src/hooks/useServerData";
import { Booking } from "@prisma/client";
import { create } from "zustand";
import actionCreateBooking from "./action-createBooking";
import actionDeleteBooking from "./action-deleteBooking";

type useBookingStoreType = {
  bookings: Booking[];
  initialiseBookings: (bookings: Booking[]) => void;
  createBooking: (start: Date, end: Date) => void;
  isAvailableSwitchBooking: (booking: Booking) => void;
  reloadBookings: (createdById: string) => void;
  deleteBooking: (bookindId: string) => void;
};

const useBookingStore = create<useBookingStoreType>((set) => ({
  bookings: [],
  initialiseBookings: (bookings) => set({ bookings }),
  isAvailableSwitchBooking: (booking) => {
    set((state) => ({
      bookings: state.bookings.map((b) => {
        if (b.id === booking.id) b.isAvailable = !b.isAvailable;
        return b;
      }),
    }));
  },
  createBooking: async (start, end) => {
    const result = await actionCreateBooking({
      start,
      end,
    });
    set((state) => ({
      bookings: [...state.bookings, result],
    }));
  },
  deleteBooking: async (bookindId) => {
    const result = await actionDeleteBooking(bookindId);
    set((state) => ({
      bookings: state.bookings.filter((b) => b.id !== result.id),
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
