import React from 'react';
import { useTime } from '@/src/hooks/useTime';
import { Calendar } from "@/src/components/ui/calendar"
import moment from 'moment';

const ServiceCalendar = React.memo(() => {
    const { setDaySelected } = useTime();

    const today = new Date();
    const nbOfDaysInMonth = moment(today).daysInMonth();
    const lastDay = new Date(today.getFullYear(), today.getMonth(), nbOfDaysInMonth);

    const [date, setDate] = React.useState<Date | undefined>(new Date(new Date().setHours(0, 0, 0, 0)));

    if (date) setDaySelected(date);

    return (
        <Calendar
            fromDate={new Date()}
            toDate={lastDay}
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border p-10"
        />
    )

})

export default ServiceCalendar;