'use client'
import React, { useState } from 'react';
import { Calendar } from "@/src/components/ui/calendar"
import moment from 'moment';
import { DateRange } from 'react-day-picker';
import { Button } from '@/src/components/ui/button';
import { addPeriod } from '@/src/components/Admin/Periods/addPeriod';
import { usePeriod } from '@/src/hooks/usePeriod';
import TableMain from '@/src/components/Table/TableMain';
import { periodType } from '@/src/reducers/periodReducer';
import { deletePeriod } from './deletePeriod';

const PeriodceCalendar = React.memo(() => {

    const [loading, setLoading] = useState(false);

    // @ts-ignore
    const { periodState, periodDispatch } = usePeriod();

    const today = new Date();
    const nbOfDaysInMonth = moment(today).daysInMonth();
    const lastDay = new Date(today.getFullYear(), today.getMonth(), nbOfDaysInMonth);

    const defaultSelected: DateRange = {
        from: new Date(),
        to: moment(new Date()).add(1, 'day').toDate()
    }

    const [range, setRange] = React.useState<DateRange | undefined>(defaultSelected);

    const formatDataToServiceTableHeader = [
        { className: "w-20", text: 'From' },
        { className: "", text: 'To' },
        { className: "", text: '' }
    ];

    const formatDataToServiceTableBody = periodState.periods.map((period: periodType) => (
        [
            { className: "font-medium w-40", text: moment(period.start).format('DD/MM/YYYY').toString() },
            { className: "text-right", text: moment(period.end).format('DD/MM/YYYY').toString() },
            { className: "text-right", text: <Button onClick={() => handleDeleteService(period)} disabled={loading} variant="destructive">Supprimer</Button> }
        ]
    ));

    const handleDeleteService = (period: periodType) => {
        if (!period.id) return;
        deletePeriod({
            period,
            periodDispatch,
        });
    }

    const handleCreatePeriod = async () => {
        if (!range?.from || !range?.to) {
            alert("Please select a period");
            return;
        }

        const from = moment(range?.from).startOf("day").toDate();
        const to = moment(range?.to).endOf("day").toDate();

        addPeriod({
            from,
            to,
            periodDispatch,
            setLoading,
        });
    }

    let footer = (
        <div>
            <Button className='w-60 my-16' onClick={handleCreatePeriod}>Open the selected Period</Button>
            <TableMain caption="Selection de la période" headers={formatDataToServiceTableHeader} rows={formatDataToServiceTableBody} />
        </div>
    )

    return (
        <Calendar
            fromDate={new Date()}
            toDate={lastDay}
            mode="range"
            selected={range}
            onSelect={setRange}
            footer={footer}
            className="rounded-md border p-10"
        />
    )

})

export default PeriodceCalendar;