import React from 'react';
import { Calendar } from "@/src/components/ui/calendar"
import moment from 'moment';
import { useBooking } from '@/src/hooks/useBooking';

const ServiceCalendar = React.memo(() => {

    const { bookingState, bookingDispatch } = useBooking();

    const today = new Date();
    const nbOfDaysInMonth = moment(today).daysInMonth();
    const lastDay = new Date(today.getFullYear(), today.getMonth(), nbOfDaysInMonth);

    const handleSelectDate = (date: Date) => {
        bookingDispatch({
            type: 'SET_DAY',
            payload: date
        });

        fetch(`/api/bookings?date=${date}`)
            .then(async (bookings) => await bookings.json())
            .then(bookings => {
                bookingDispatch({
                    type: 'SET_BOOKINGS',
                    payload: bookings
                })
            });
    }

    return (
        <Calendar
            fromDate={new Date()}
            toDate={lastDay}
            mode="single"
            selected={bookingState.daySelected ?? new Date()}
            onSelect={(date) => handleSelectDate(date!)}
            className="rounded-md border p-10"
        />
    )

})

export default ServiceCalendar;