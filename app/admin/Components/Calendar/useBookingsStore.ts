import useServerData from "@/src/hooks/useServerData";
import { Booking, BookingStatus } from "@prisma/client";
import { create } from "zustand";
import actionCreateBooking from "./action-createBooking";
import actionDeleteBooking from "./action-deleteBooking";
import actionStatusBooking from "../Bookings/action-statusBooking";

type useBookingStoreType = {
  bookings: Booking[];
  initialiseBookings: (bookings: Booking[]) => void;
  createBooking: (start: Date, end: Date) => void;
  changeStatus: (id: string, status: BookingStatus) => void;
  reloadBookings: (createdById: string) => void;
  deleteBooking: (bookindId: string) => void;
};

const useBookingStore = create<useBookingStoreType>((set) => ({
  bookings: [],
  initialiseBookings: (bookings) => set({ bookings }),
  createBooking: async (start, end) => {
    const result = await actionCreateBooking({
      start,
      end,
    });
    set((state) => ({
      bookings: [...state.bookings, result],
    }));
  },
  changeStatus: async (id, status) => {
    const result = await actionStatusBooking(id, status);
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
