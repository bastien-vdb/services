import { Booking, BookingStatus } from "@prisma/client";
import { create } from "zustand";
import actionDeleteBooking from "./action-deleteBooking";
import actionGetBooking from "./action-getBooking";
import actionSetBookingUser from "./action-setBookingUser";
import { promises } from "dns";

type useBookingsStoreType = {
  bookings: Booking[];
  loadingBookings: boolean;
  initialiseBookings: (bookings: Booking[]) => void;
  changeStatusBooking: ({
    bookingId,
    status,
  }: {
    bookingId: string;
    status: BookingStatus;
  }) => Promise<void>;
  deleteBooking: (bookingId: string) => void;
  getBookings: (userId: string) => void;
};

const useBookingsStore = create<useBookingsStoreType>((set) => ({
  bookings: [],
  loadingBookings: false,
  initialiseBookings: (bookings) => set({ bookings }),
  changeStatusBooking: async ({ bookingId, status }) => {
    set({ loadingBookings: true });
    return await actionSetBookingUser({ bookingId, status })
      .then((r) => {
        console.log("Réservation mise à jour", r);
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, status } : b
          ),
        }));
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        set({ loadingBookings: false });
      });
  },
  deleteBooking: async (bookingId) => {
    set({ loadingBookings: true });
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
