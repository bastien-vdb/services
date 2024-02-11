'use client'
import { useEffect, useState } from 'react';
import { Badge } from "@/src/components/ui/badge"
import TableMain from '@/src/components/Table/TableMain';
import moment from 'moment';
import { Button } from '@/src/components/ui/button';
import { Booking } from '@prisma/client';
import useBookingStore from '@/app/admin/Components/Bookings/useBookingsStore';
import useActiveBooking from '@/app/admin/Components/Bookings/useActiveBooking';
import { useSession } from 'next-auth/react';
import useCancelBookingData from '@/app/admin/Components/Bookings/useCancelBooking';
import { Switch } from "@/src/components/ui/switch"

function Bookings({ bookings }: { bookings: Booking[] }) {

    const { bookings: bookingsFromStore, reloadBookings, removeBooking, initialiseBookings } = useBookingStore();

    const session = useSession()

    useEffect(() => {
        initialiseBookings(bookings);
    }, [])

    const handleActiveBooking = (booking: Booking) => {
        if (!booking.id) return;
        useActiveBooking({ booking });
        reloadBookings(session.data?.user.id!);
    }

    const handleCancelBooking = (booking: Booking) => {
        if (!booking.id) return;
        useCancelBookingData({ booking });
        reloadBookings(session.data?.user.id!);
    }

    const formatDataToServiceTableHeader = [
        { className: "", text: 'Du', tooltip: "Du" },
        { className: "text", text: 'Au', tooltip: "Au" },
        { className: "", text: 'Actif', tooltip: "Actif" },
    ];

    const formatDataToServiceTableBody = bookingsFromStore.map((booking: Booking) => (
        [
            { className: "font-medium", text: moment(booking.startTime).format('DD/MM/YYYY - HH:mm:ss').toString() },
            { className: "", text: moment(booking.endTime).format('DD/MM/YYYY - HH:mm:ss').toString() },
            { className: "", text: <Switch checked={booking.isAvailable} onCheckedChange={() => booking.isAvailable ? handleCancelBooking(booking) : handleActiveBooking(booking)} /> },
        ]
    ));

    return (
        <>
            <Badge className="m-auto ml-2 my-10">Bookings disponibles</Badge><br />
            <TableMain caption="Sélection du rendez-vous" headers={formatDataToServiceTableHeader} rows={formatDataToServiceTableBody} />
        </>
    );
}

export default Bookings;