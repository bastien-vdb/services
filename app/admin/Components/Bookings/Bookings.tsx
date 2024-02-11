'use client'
import { useEffect } from 'react';
import { Badge } from "@/src/components/ui/badge"
import TableMain from '@/src/components/Table/TableMain';
import moment from 'moment';
import { Booking } from '@prisma/client';
import useBookingStore from '@/app/admin/Components/Bookings/useBookingsStore';
import useActiveBooking from '@/app/admin/Components/Bookings/useActiveBooking';
import { useSession } from 'next-auth/react';
import useCancelBookingData from '@/app/admin/Components/Bookings/useCancelBooking';
import { Switch } from "@/src/components/ui/switch"
import { DataTable } from '@/src/components/Bookings/data-table';
import { columns } from '@/src/components/Bookings/columns';

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
        removeBooking(booking); //TODO Optimistic update
        useCancelBookingData({ booking });
        reloadBookings(session.data?.user.id!);
    }

    const formatDataToServiceTableBody = bookingsFromStore.map(b => {
        return {
            id: b.id,
            du: moment(b.startTime).format('DD/MM/YYYY - HH:mm:ss').toString(),
            au: moment(b.endTime).format('DD/MM/YYYY - HH:mm:ss').toString(),
            actif: <Switch className='float-right' checked={b.isAvailable} onCheckedChange={() => b.isAvailable ? handleCancelBooking(b) : handleActiveBooking(b)} />,
        }
    })

    return (
        <>
            <Badge className="m-auto ml-2 my-10">Bookings disponibles</Badge><br />
            <DataTable columns={columns} data={formatDataToServiceTableBody} />
        </>
    );
}

export default Bookings;