'use client'
import ServiceCalendar from "@/app/Components/Calendar/ServiceCalendar";
import SelectBooking from "./SelectBooking/SelectBooking";
import SelectService from "./SelectService/SelectService";
import { Button } from "@/src/components/ui/button";
import { useCallback } from "react";
import { Booking, Service } from "@prisma/client";
import useServiceStore from "@/app/admin/Components/Services/useServicesStore";

const Steps = ({ services, userId, bookings }: { services: Service[], userId: string, bookings: Booking[] }) => {
    const { serviceSelected, changeServiceSelected } = useServiceStore();
    const handleReset = useCallback(() => {
        changeServiceSelected(null)
    }, []);

    if (!serviceSelected)
        return (
            <main className="flex flex-col">
                <SelectService services={services} />
            </main >
        )

    return (
        <main>
            <div className="mt-20 md:mt-40 flex gap-10 flex-wrap justify-center items-center">

                <Button variant="secondary" onClick={handleReset}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                </Button>
                <ServiceCalendar userId={userId} />
                <SelectBooking bookings={bookings} />
            </div>
        </main >
    );
};

export default Steps;