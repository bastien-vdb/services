'use client'
import { useEffect } from 'react';
import moment from 'moment';
import { Booking } from '@prisma/client';
import useBookingStore from '@/app/admin/Components/Bookings/useBookingsStore';
import { DataTable } from '@/src/components/bookings_payed_table/data-table';
import { columns } from '@/src/components/bookings_payed_table/columns';
import { Badge } from '@/src/components/ui/badge';

function BookingsPayed({ bookings }: { bookings: Booking[] }) {

    const { bookings: bookingsFromStore, initialiseBookings } = useBookingStore();

    useEffect(() => {
        initialiseBookings(bookings);
    }, [])

    const data = bookingsFromStore.filter((booking) => booking.payed).map((booking) => {
        return {
            id: booking.id,
            du: moment(booking.startTime).format('DD/MM/YYYY - HH:mm:ss').toString(),
            au: moment(booking.endTime).format('DD/MM/YYYY - HH:mm:ss').toString(),
            userEmail: String(booking.payedBy) ?? 'Non renseigné',
        }
    });

    console.log('data', data)

    return (
        <>
            <Badge className="m-auto ml-2 my-10">Bookings facturés</Badge><br />
            <DataTable columns={columns} data={data} />
        </>
    );
}

export default BookingsPayed;