'use client'
import { useEffect } from 'react';
import { Badge } from "@/src/components/ui/badge"
import moment from 'moment';
import { Booking } from '@prisma/client';
import useBookingStore from '@/app/admin/Components/Bookings/useBookingsStore';
import useActiveBooking from '@/app/admin/Components/Bookings/useActiveBooking';
import { useSession } from 'next-auth/react';
import useCancelBookingData from '@/app/admin/Components/Bookings/useCancelBooking';
import { Switch } from "@/src/components/ui/switch"
import { DataTable } from '@/src/components/bookings_data_table/data-table';
import { columns } from '@/src/components/bookings_data_table/columns';
import { toast } from '@/src/components/ui/use-toast';

function Bookings({ bookings }: { bookings: Booking[] }) {

    const { bookings: bookingsFromStore, reloadBookings, isAvailableSwitchBooking, initialiseBookings } = useBookingStore();

    const session = useSession()

    useEffect(() => {
        initialiseBookings(bookings);
    }, [])

    const handleActiveBooking = (booking: Booking) => {
        if (!booking.id) return;
        isAvailableSwitchBooking(booking); //TODO Optimistic update
        useActiveBooking({ booking });
        reloadBookings(session.data?.user.id!);
        toast({
            variant: "success",
            title: "Rendez-vous activé",
            description: "Le rendez-vous est maintenant disponible",
        })
    }

    const handleCancelBooking = (booking: Booking) => {
        if (!booking.id) return;
        isAvailableSwitchBooking(booking); //TODO Optimistic update
        useCancelBookingData({ booking });
        reloadBookings(session.data?.user.id!);
        toast({
            variant: "success",
            title: "Rendez-vous désactivé",
            description: "Le rendez-vous n'est plus disponible",
        })
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