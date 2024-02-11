'use client'
import { useEffect } from 'react';
import { Badge } from "@/src/components/ui/badge"
import TableMain from '@/src/components/Table/TableMain';
import moment from 'moment';
import { Booking } from '@prisma/client';
import useBookingStore from '@/app/admin/Components/Bookings/useBookingsStore';
import { columns } from '@/src/components/Bookings/columns';
import { DataTable } from '@/src/components/Bookings/data-table';
import { Switch } from '@/src/components/ui/switch';

function BookingsPayed({ bookings }: { bookings: Booking[] }) {

    const { bookings: bookingsFromStore, initialiseBookings } = useBookingStore();

    useEffect(() => {
        initialiseBookings(bookings);
    }, [])

    const formatDataToServiceTableHeader = [
        { className: "", text: 'Du', tooltip: "Du" },
        {
            className: "text", text: 'Au', tooltip: "Au",
        },
    ];

    const formatDataToServiceTableBody = bookingsFromStore.filter(booking => booking.payed).map((booking) => (
        [
            { className: "font-medium", text: moment(booking.startTime).format('DD/MM/YYYY - HH:mm:ss').toString() },
            { className: "", text: moment(booking.endTime).format('DD/MM/YYYY - HH:mm:ss').toString() },
        ]
    ));

    const bookingsForTable = bookings.map(b => (
        {
            id: b.id,
            du: moment(b.startTime).format('DD/MM/YYYY - HH:mm:ss').toString(),
            au: moment(b.endTime).format('DD/MM/YYYY - HH:mm:ss').toString(),
            actif: <Switch className='float-right' checked={b.isAvailable} />
        }
    ))

    return (
        <>
            <DataTable columns={columns} data={bookingsForTable} />

            <Badge className="m-auto ml-2 my-10">Bookings facturés</Badge><br />
            <TableMain caption="Liste des bookings facturés aux clients" headers={formatDataToServiceTableHeader} rows={formatDataToServiceTableBody} />
        </>
    );
}

export default BookingsPayed;