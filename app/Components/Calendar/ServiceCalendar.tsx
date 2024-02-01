import { memo } from 'react';
import { Calendar } from "@/src/components/ui/calendar"
import moment from 'moment';
import useMainBookingsStore from '@/app/Components/Calendar/useMainBookingsStore';

const ServiceCalendar = memo(({ userId }: { userId: string }) => {

    const { bookings, daySelected, selectDay } = useMainBookingsStore();

    const today = new Date();
    const nbOfDaysInMonth = moment(today).daysInMonth();
    const lastDay = new Date(today.getFullYear(), today.getMonth(), nbOfDaysInMonth);

    const { reloadBookings } = useMainBookingsStore();

    const handleSelectDate = (date: Date) => {
        selectDay(date);
        reloadBookings(userId, date);
    }

    return (
        <Calendar
            fromDate={new Date()}
            // toDate={lastDay}
            mode="single"
            selected={daySelected ?? new Date()}
            onSelect={(date) => handleSelectDate(date!)}
            className="rounded-md border p-10"
        />
    )

})

export default ServiceCalendar;