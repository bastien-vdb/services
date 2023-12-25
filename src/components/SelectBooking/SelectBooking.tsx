import moment from 'moment';
import { Button } from '@/src/components/ui/button';
import { useBooking } from '@/src/hooks/useBooking';
import { addBooking } from '@/src/components/SelectBooking/addBooking';
import { useState } from 'react';
import { bookingContextType } from '@/src/contexts/booking.context/booking.context';

const SelectBooking = () => {

    const [loading, setLoading] = useState(false);

    const { bookingState, bookingDispatch } = useBooking() as bookingContextType;

    const handleCreateBook = (booking: any) => {
        if (!bookingState.daySelected) throw new Error('No day selected');
        addBooking({ daySelected: bookingState.daySelected, booking, bookingDispatch, setLoading });
    }

    return (
        <div>
            <ul className='flex flex-wrap w-80 gap-2 items-center justify-center p-2'>
                {
                    bookingState.bookings.map((booking, key) => (
                        <li key={key}><Button onClick={() => handleCreateBook(booking)}>{moment(booking.startTime).format('HH:mm:ss').toString()}</Button></li>
                    ))
                }
                <span className='m-2'>Day: {bookingState.daySelected!.toString()}</span>
            </ul>
        </div>
    );
};

export default SelectBooking;