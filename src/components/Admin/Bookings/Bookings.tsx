'use client'
import React, { useState } from 'react';
import { Badge } from "@/src/components/ui/badge"
import TableMain from '@/src/components/Table/TableMain';
import { useBooking } from '@/src/hooks/useBooking';
import type { bookingType } from '@/src/reducers/bookingReducer';
import moment from 'moment';
import { Button } from '@/src/components/ui/button';
import { deleteBooking } from '@/src/components/Admin/Bookings/deleteBooking';
import { Booking } from '@prisma/client';

function Periods({bookings}: {bookings: Booking[]}) {

    const [loading, setLoading] = useState(false);

    const { bookingState, bookingDispatch } = useBooking();

    const formatDataToServiceTableHeader = [
        { className: "", text: 'From' },
        { className: "text-right", text: 'To' },
        { className: "", text: '' }
    ];

    const formatDataToServiceTableBody = bookings.map((booking: bookingType) => (
        [
            { className: "font-medium", text: moment(booking.startTime).format('DD/MM/YYYY - HH:mm:ss').toString() },
            { className: "text-right", text: moment(booking.endTime).format('DD/MM/YYYY - HH:mm:ss').toString() },
            { className: "text-right", text: <Button onClick={() => handleDeleteBooking(booking.id)} disabled={loading} variant="destructive">Supprimer</Button> }
        ]
    ));

    const handleDeleteBooking = (id: string | undefined) => {
        if (!id) return;
        deleteBooking({
            id,
            bookingDispatch,
            setLoading,
        });
    }

    return (
        <>
            <Badge className="w-20 m-auto">Bookings</Badge><br />
            <TableMain caption="Sélection du rendez-vous" headers={formatDataToServiceTableHeader} rows={formatDataToServiceTableBody} />
        </>
    );
}

export default Periods;