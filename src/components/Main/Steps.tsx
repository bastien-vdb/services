'use client'
import { useBooking } from "@/src/hooks/useBooking";
import ServiceCalendar from "../Calendar/ServiceCalendar";
import SelectBooking from "../SelectBooking/SelectBooking";
import SelectService from "../SelectService/SelectService";
import { Button } from "../ui/button";
import { useService } from "@/src/hooks/useService";
import { useCallback } from "react";
import { Service } from "@prisma/client";

const Steps = ({ services, userId }: { services: Service[], userId: string }) => {
    const { bookingState, bookingDispatch } = useBooking();
    const { serviceState, serviceDispatch } = useService();

    const handleReset = useCallback(() => {
        serviceDispatch({
            type: 'RESET',
        })
    }, []);

    if (!serviceState.serviceSelected)

        return (
            <main className="flex flex-col">
                <div className="w-[800px] m-auto">
                    <SelectService services={services} />
                </div>

            </main >
        )

    return (
        <main className="flex flex-col">

            <div className="flex">
                <div className="m-auto flex gap-10 flex-wrap">

                    <ServiceCalendar userId={userId} />

                    {bookingState.daySelected && <SelectBooking />}

                    <Button variant="secondary" onClick={handleReset}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                        </svg>
                    </Button>
                </div>
            </div>
        </main >
    );
};

export default Steps;