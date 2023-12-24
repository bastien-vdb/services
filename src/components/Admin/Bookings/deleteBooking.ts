import { bookingActionType } from "@/src/reducers/bookingReducer";
import { SetStateAction } from "react";

export const deleteBooking = async ({ id, bookingDispatch, setLoading }: { id: string; bookingDispatch: React.Dispatch<bookingActionType>; setLoading: React.Dispatch<SetStateAction<boolean>> }) => {
  try {
    setLoading(true);

    //Otpimistic update
    bookingDispatch({
      type: "DELETE_BOOKING",
      payload: {
        id,
      },
    });

    const response = await fetch("/api/bookings/delete", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message);
    }

    const response_bookings = await fetch(`/api/bookings`);
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
    throw new Error(error);
  } finally {
    setLoading(false);
  }
};
