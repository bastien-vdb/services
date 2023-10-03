import moment from 'moment';
import { Button } from '@/src/components/ui/button';
import { useBooking } from '@/src/hooks/useBooking';
import type { slotType, bookingStateType } from '@/src/reducers/bookingReducer';
import { addBooking } from '@/src/components/SelectBooking/addBooking';
import { useState } from 'react';
import { useService } from '@/src/hooks/useService';
import { al } from 'vitest/dist/reporters-5f784f42.js';
const SelectBooking = () => {

    const [loading, setLoading] = useState(false);

    const { serviceState } = useService();

    //@ts-ignore
    const { bookingState, bookingDispatch } = useBooking();

    const handleCreateBook = (booking: any) => {
        addBooking({ daySelected: bookingState.daySelected, booking, bookingDispatch, setLoading });
    }

    return (
        <div>
            <ul className='flex flex-wrap w-80 gap-2 items-center justify-center p-2'>
                {
                    bookingState.bookings.map((booking: any, key: number) => (
                        <li key={key}><Button onClick={() => handleCreateBook(booking)}>{moment(booking.startTime).format('HH:mm:ss').toString()}</Button></li>
                    ))
                }
                <span className='m-2'>Day: {bookingState.daySelected.toString()}</span>
            </ul>
        </div>
    );
};

export default SelectBooking;