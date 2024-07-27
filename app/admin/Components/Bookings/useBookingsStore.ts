import { toast } from "@/src/components/ui/use-toast";
import { Booking, BookingStatus } from "@prisma/client";
import { create } from "zustand";
import actionDeleteBooking from "./action-deleteBooking";
import actionGetBooking from "./action-getBooking";
import actionSetBookingUser from "./action-setBookingUser";

type useBookingsStoreType = {
  bookings: Booking[];
  loadingBookings: boolean;
  bookingSelected: Booking | undefined;
  setBookingSelected: (booking: Booking) => void;
  initialiseBookings: (bookings: Booking[]) => void;
  changeStatusBooking: ({
    bookingId,
    status,
  }: {
    bookingId: string;
    status: BookingStatus;
  }) => Promise<Booking>;
  deleteBooking: (bookingId: string) => void;
  getBookings: (userId: string) => void;
};

const useBookingsStore = create<useBookingsStoreType>((set) => ({
  bookings: [],
  loadingBookings: false,
  initialiseBookings: (bookings) => set({ bookings }),
  bookingSelected: undefined,
  setBookingSelected: (booking) => set({ bookingSelected: booking }),
  changeStatusBooking: async ({ bookingId, status }) => {
    set({ loadingBookings: true });
    return actionSetBookingUser({ bookingId, status })
      .then((r) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, status } : b
          ),
        }));
        return r;
      })
      .catch((error) => {
        console.error(error);
        throw new Error("Erreur lors de la mise à jour de la réservation");
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
        toast({
          description: "Réservation supprimée",
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          description: error,
        });
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
