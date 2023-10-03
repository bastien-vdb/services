import { useContext } from "react";
import { BookingContext } from "@/src/contexts/booking.context/booking.context";

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
