import React from 'react';
import { Calendar } from "@/src/components/ui/calendar"
import moment from 'moment';
import { useBooking } from '@/src/hooks/useBooking';
import { createSetOfSLots } from '@/src/contexts/booking.context/createSetOfSlots';

const ServiceCalendar = React.memo(() => {

    //@ts-ignore
    const { bookingState, bookingDispatch } = useBooking();

    const today = new Date();
    const nbOfDaysInMonth = moment(today).daysInMonth();
    const lastDay = new Date(today.getFullYear(), today.getMonth(), nbOfDaysInMonth);

    const handleSelectDate = (date: Date | undefined) => {

        // let slots: {
        //     from: Date;
        //     to: Date;
        // }[] = [];
        // if (date) slots = createSetOfSLots(date);

        bookingDispatch({
            type: 'SET_DAY',
            payload: date
        });

        console.log('error step 1');

        fetch(`/api/bookings?date=${date}`)
            .then(async (bookings) => await bookings.json())
            .then(bookings => {
                console.log('coté client: booking: ', bookings);
                bookingDispatch({
                    type: 'SET_BOOKINGS',
                    payload: bookings
                })
            });
            console.log('error step 2');


    }

    return (
        <Calendar
            fromDate={new Date()}
            toDate={lastDay}
            mode="single"
            selected={bookingState.daySelected}
            onSelect={(date) => handleSelectDate(date)}
            className="rounded-md border p-10"
        />
    )

})

export default ServiceCalendar;