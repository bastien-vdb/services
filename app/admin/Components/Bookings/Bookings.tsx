'use client'
import { useEffect, useState } from 'react';
import { Badge } from "@/src/components/ui/badge"
import TableMain from '@/src/components/Table/TableMain';
import moment from 'moment';
import { Button } from '@/src/components/ui/button';
import { Booking } from '@prisma/client';
import useBookingStore from '@/app/admin/Components/Bookings/useBookingsStore';
import { useSession } from 'next-auth/react';
import useCancelBookingData from '@/app/admin/Components/Bookings/useCancelBookingData';

function Bookings({ bookings }: { bookings: Booking[] }) {

    const [loading, setLoading] = useState(false);
    const { bookings: bookingsFromStore, reloadBookings, removeBooking, initialiseBookings } = useBookingStore();

    const session = useSession()

    useEffect(() => {
        initialiseBookings(bookings);
    }, [])

    const handleCancelBooking = (booking: Booking) => {
        if (!booking.id) return;
        setLoading(true);
        removeBooking(booking); //Optimistic update
        useCancelBookingData({ booking });
        reloadBookings(session.data?.user.id!);
        setLoading(false);

    }

    const formatDataToServiceTableHeader = [
        { className: "", text: 'From' },
        { className: "text-right", text: 'To' },
        { className: "", text: '' }
    ];

    const formatDataToServiceTableBody = bookingsFromStore.filter(booking => booking.isAvailable).map((booking: Booking) => (
        [
            { className: "font-medium", text: moment(booking.startTime).format('DD/MM/YYYY - HH:mm:ss').toString() },
            { className: "text-right", text: moment(booking.endTime).format('DD/MM/YYYY - HH:mm:ss').toString() },
            { className: "text-right", text: <Button onClick={() => handleCancelBooking(booking)} disabled={loading} variant="destructive">Supprimer</Button> }
        ]
    ));

    return (
        <>
            <Badge className="w-20 m-auto">Bookings</Badge><br />
            <TableMain caption="Sélection du rendez-vous" headers={formatDataToServiceTableHeader} rows={formatDataToServiceTableBody} />
        </>
    );
}

export default Bookings;