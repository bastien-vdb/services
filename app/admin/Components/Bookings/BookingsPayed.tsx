'use client'
import useBookingStore from '@/app/admin/Components/Bookings/useBookingsStore';
import useDeleteBooking from '@/app/admin/Components/Bookings/useDeleteBooking';
import { columns } from '@/src/components/bookings_payed_table/columns';
import { DataTable } from '@/src/components/bookings_payed_table/data-table';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { toast } from '@/src/components/ui/use-toast';
import { Booking } from '@prisma/client';
import { Trash2 } from 'lucide-react';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

function BookingsPayed({ bookings }: { bookings: Booking[] }) {

    // const { bookings: bookingsFromStore, initialiseBookings } = useBookingStore();
    const { bookings: bookingsFromStore, reloadBookings, deleteBooking, initialiseBookings } = useBookingStore();

    const [loading, setLoading] = useState(false);
    const session = useSession();


    useEffect(() => {
        initialiseBookings(bookings);
    }, [])

    const handleDeleteBooking = async (booking: Booking) => {
        if (!booking.id) return;

        setLoading(true);
        deleteBooking(booking);//Optimistic update
        await useDeleteBooking({ booking });
        reloadBookings(session.data?.user.id!);
        setLoading(false);
        toast({
            variant: "success",
            description: "Réservation supprimée",
        })
    }

    const data = bookingsFromStore.filter((booking) => booking.payed).map((booking) => {
        return {
            id: booking.id,
            du: moment(booking.startTime).format('DD/MM/YYYY - HH:mm:ss').toString(),
            au: moment(booking.endTime).format('DD/MM/YYYY - HH:mm:ss').toString(),
            userEmail: String(booking.payedBy) ?? 'Non renseigné',
            annuler: <Button title='Supprimer' disabled={loading} onClick={() => handleDeleteBooking(booking)} variant="outline"><Trash2 className='text-destructive' /></Button>
        }
    });

    return (
        <>
            <Badge className="m-auto ml-2 my-10">Bookings facturés</Badge><br />
            <DataTable columns={columns} data={data} />
        </>
    );
}

export default BookingsPayed;