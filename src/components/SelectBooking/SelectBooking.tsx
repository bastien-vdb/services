import moment from 'moment';
import { Button } from '@/src/components/ui/button';
import { useBooking } from '@/src/hooks/useBooking';
import { addBooking } from '@/src/components/SelectBooking/addBooking';
import { useState } from 'react';
import { Booking } from 'prisma/prisma-client'
import { useSession } from 'next-auth/react';
import useServiceStore from '@/app/admin/Components/Services/useServicesStore';

const SelectBooking = () => {

    const [loading, setLoading] = useState(false);
    const { bookingState, bookingDispatch } = useBooking();
    const { serviceSelected } = useServiceStore();
    const { data: session } = useSession();

    const handleCreateBook = async (booking: Booking) => {

        try {
            const paymentPage = await fetch(`http://localhost:3000/api/checkout/create-checkout-session`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(
                        { stripePriceId: serviceSelected?.stripePriceId, startTime: booking.startTime, userId: session?.user.id, serviceId: serviceSelected?.id }
                    ),
                });

            const paymentPageJson = await paymentPage.json();

            window.location.assign(paymentPageJson);
        } catch (error) {
            console.error("error: ", error);
            throw new Error("Une erreur est survenue lors de la prise de rendez-vous");
        }

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