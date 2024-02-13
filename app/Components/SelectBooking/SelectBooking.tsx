import moment from 'moment';
import { Button } from '@/src/components/ui/button';
import { useEffect, useState } from 'react';
import { Booking } from "@prisma/client";
import { useSession } from 'next-auth/react';
import useServiceStore from '@/app/admin/Components/Services/useServicesStore';
import useMainBookingStore from '@/app/Components/Calendar/useMainBookingsStore';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/src/components/ui/drawer';
import { LoadingSpinner } from '@/src/components/ui/loader';

const SelectBooking = ({ bookings }: { bookings: Booking[] }) => {

    const [isOpened, setIsOpened] = useState(false);
    const { bookings: bookingsFromStore, initialiseBookings, daySelected, loading } = useMainBookingStore();
    const { serviceSelected } = useServiceStore();
    const { data: session } = useSession();

    useEffect(() => {
        initialiseBookings(bookings);
    }, []);

    useEffect(() => {
        if (daySelected) setIsOpened(true);
    }, [daySelected]);

    const handleCreateBook = async (booking: Booking) => {

        try {
            const paymentPage = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/checkout/create-checkout-session`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(
                        { stripePriceId: serviceSelected?.stripePriceId, bookingId: booking.id, startTime: booking.startTime, userId: session?.user.id, serviceId: serviceSelected?.id, idemPotentKey: booking.idemPotentKey }
                    ),
                });

            const paymentPageJson = await paymentPage.json();

            window.location.assign(paymentPageJson);
        } catch (error) {
            console.error("error: ", error);
            throw new Error("Une erreur est survenue lors de la prise de rendez-vous");
        }

        if (!daySelected) throw new Error('No day selected');
    }

    return (
        <Drawer open={isOpened} onClose={() => setIsOpened(false)} onOpenChange={(state) => !state && setIsOpened(false)}>
            <DrawerContent className='flex justify-center items-center'>
                {loading ? <LoadingSpinner className="w-20 h-20 animate-spin" /> :
                    (
                        <>
                            <DrawerHeader>
                                <DrawerTitle>Rendez-vous</DrawerTitle>
                                <DrawerDescription>Selectionner un rendez-vous.</DrawerDescription>
                            </DrawerHeader>
                            <ul className='flex flex-wrap w-80 gap-2 items-center justify-center p-2'>
                                {bookingsFromStore.length > 0 ? bookingsFromStore?.map((booking, key) => (
                                    <li key={key}><Button onClick={() => handleCreateBook(booking)}>{moment(booking.startTime).format('HH:mm:ss').toString()}</Button></li>
                                ))
                                    :
                                    <Button variant="ghost">Pas de créneau disponible</Button>
                                }
                            </ul>
                        </>
                    )}
                <DrawerFooter>
                    <DrawerClose onClick={() => setIsOpened(false)}>
                        <Button variant="outline">Annuler</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default SelectBooking;