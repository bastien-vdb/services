'use client'
import { createContext, useEffect, useReducer } from "react";
import { bookingReducer } from "@/src/reducers/bookingReducer";
import type { bookingStateType, bookingActionType } from "@/src/reducers/bookingReducer";
import { formatDay } from "@/src/contexts/booking.context/formatDay";

export type bookingContextType = {
    bookingState: bookingStateType;
    bookingDispatch: React.Dispatch<bookingActionType>;
};

const bookingStateInit: bookingStateType = {
    daySelected: formatDay(new Date()),
    bookings: [],
}

export const BookingContext = createContext<bookingContextType | null>(null);

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
    const [bookingState, bookingDispatch] = useReducer(bookingReducer, bookingStateInit);

    useEffect(() => {
        fetch(`/api/bookings?available=${false}`)
            .then(async (bookings) => await bookings.json())
            .then(bookings => {
                bookingDispatch({
                    type: 'SET_BOOKINGS',
                    payload: bookings
                })
            });
    }, []);

    return <BookingContext.Provider value={{ bookingState, bookingDispatch }}>{children}</BookingContext.Provider>;
};