import { bookingActionType } from "@/src/reducers/bookingReducer";
import { SetStateAction } from "react";

export const addBooking = async ({ daySelected, booking, bookingDispatch, setLoading }: { daySelected: Date; booking: any; bookingDispatch: React.Dispatch<bookingActionType>; setLoading: React.Dispatch<SetStateAction<boolean>> }) => {
  try {
    setLoading(true);
    //Otpimistic update
    // bookingDispatch({
    //   type: "ADD_BOOKING",
    //   payload: {
    //     date: new Date(),
    //     startTime: booking.startTime,
    //     endTime: booking.endTime,
    //     isAvailable: false,
    //     serviceId: booking.serviceId,
    //   },
    // });

    const response = await fetch("/api/bookings/add", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: booking.id,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message);
    }

    const response_bookings = await fetch(`/api/bookings?date=${daySelected}`);
    if (!response_bookings.ok) {
      const data = await response_bookings.json();
      throw new Error(data.message);
    }
    const newListOfBookings = await response_bookings.json();
    bookingDispatch({
      type: "SET_BOOKINGS",
      payload: newListOfBookings,
    });
  } catch (error: any) {
    alert(error.message);
    throw new Error(error);
  } finally {
    setLoading(false);
  }
};
