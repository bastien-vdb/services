'use client'
import TableMain from '@/src/components/Table/TableMain';
import { Badge } from "@/src/components/ui/badge";
import { Button } from '@/src/components/ui/button';
import { Calendar } from "@/src/components/ui/calendar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { Periods } from '@prisma/client';
import moment, { now } from 'moment';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import useCreatePeriodData from './useCreatePeriodData';
import useDeletePeriodData from './useDeletePeriodData';
import usePeriodsStore from './usePeriodsStore';
import { Label } from "@/src/components/ui/label"
import { c } from 'vitest/dist/reporters-5f784f42.js';

const PeriodceCalendar = ({ periods }: { periods: Periods[] }) => {

    const [loading, setLoading] = useState(false);
    const [selectDuree, setSelectDuree] = useState<string>();
    const [selectStartHour, setSelectStartHour] = useState<string>();
    const [selectEndHour, setSelectEndHour] = useState<string>();

    const { addPeriod, removePeriod, reLoadPeriods, periods: periodsFromStore } = usePeriodsStore();
    const session = useSession();

    const today = new Date(now());

    const defaultSelected: DateRange = {
        from: new Date(),
        to: moment(new Date()).add(1, 'day').toDate()
    }

    const [range, setRange] = useState<DateRange | undefined>(defaultSelected);

    const handleDeleteService = async (period: Periods) => {
        setLoading(true);
        removePeriod(period);
        await useDeletePeriodData({
            period
        });
        reLoadPeriods(session?.data?.user.id!);
        setLoading(false);
    }

    const handleCreatePeriod = async () => {
        if (!range?.from || !range?.to) {
            alert("Please select a period");
            return;
        }

        console.log('range', range)

        setLoading(true);

        // const start = moment(range?.from).startOf("day").toDate();
        // const end = moment(range?.to).endOf("day").toDate();

        console.log('selectStartHour', selectStartHour);
        console.log('selectEndHour', selectEndHour);
        const start = moment(range?.from).hour(moment(selectStartHour).hour()).minute(moment(selectStartHour).minute()).toDate();
        const end = moment(range?.to).hour(moment(selectEndHour).hour()).minute(moment(selectEndHour).minute()).toDate();

        console.log('s,e=>', start, end)

        //Optimistic update with fake data
        addPeriod({
            id: '',
            date: today,
            start,
            end,
            createdById: '',
        });

        await useCreatePeriodData({
            start,
            end,
            duree: Number(selectDuree),
        });

        reLoadPeriods(session?.data?.user.id!);
        setLoading(false);
    }

    const formatDataToServiceTableHeader = [
        { className: "w-20", text: 'From' },
        { className: "", text: 'To' },
        { className: "", text: '' }
    ];

    const formatDataToServiceTableBody = (periodsFromStore.length > 0 ? periodsFromStore : periods).map((period: Periods) => (
        [
            { className: "font-medium w-40", text: moment(period.start).format('DD/MM/YYYY').toString() },
            { className: "text-right", text: moment(period.end).format('DD/MM/YYYY').toString() },
            { className: "text-right", text: <Button onClick={() => handleDeleteService(period)} disabled={loading} variant="destructive">Supprimer</Button> }
        ]
    ));


    const getTimeHoursSlot = useCallback((duree: number | string) => {
        const slotDuration = Number(duree) / 60;
        const timeHoursSlot = [] as moment.Moment[];
        for (let i = 0; i < 24; i += slotDuration) {
            timeHoursSlot.push(moment().startOf("day").add(i, 'hour'));
        }
        return timeHoursSlot;
    }, [selectDuree]);

    let tp: moment.Moment[] = [];
    if (selectDuree) tp = getTimeHoursSlot(selectDuree);

    let footer = (
        <>
            <div className='my-6 flex flex-col gap-4'>

                <Select onValueChange={setSelectDuree}>
                    <Label>Durée créneau :</Label>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Durée créneau" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="15">15min</SelectItem>
                        <SelectItem value="30">30min</SelectItem>
                        <SelectItem value="45">45min</SelectItem>
                        <SelectItem value="60">1 heure</SelectItem>
                        <SelectItem value="90">1h30 heure</SelectItem>
                        <SelectItem value="120">2 heures</SelectItem>
                        <SelectItem value="180">3 heures</SelectItem>
                        <SelectItem value="240">4 heures</SelectItem>
                    </SelectContent>
                </Select>

                {selectDuree && (
                    <>
                        <Select onValueChange={setSelectStartHour}>
                            <Label>Heure de démarrage :</Label>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Heure démarrage" />
                            </SelectTrigger>
                            <SelectContent>
                                {tp.map((time) =>
                                    <SelectItem value={time.toString()}>{time.format('HH:mm')}</SelectItem>
                                )}
                            </SelectContent>
                        </Select>

                        {selectStartHour && (
                            <Select onValueChange={setSelectEndHour}>
                                <Label>Heure de fin :</Label>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Heure de fin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tp
                                        .filter((time) => time.isAfter(moment(selectStartHour)))
                                        .map((time) =>
                                            <SelectItem value={time.toString()}>{time.format('HH:mm')}</SelectItem>
                                        )}
                                </SelectContent>
                            </Select>
                        )}
                    </>
                )}

            </div>
            <Button className='w-60 my-16' onClick={handleCreatePeriod}>Open the selected Period</Button>
        </>
    )

    return (
        <>
            <Badge className="w-20 m-auto">Periods</Badge><br />
            <div className='flex justify-between'>
                <Calendar
                    fromDate={new Date()}
                    // toDate={lastDay}
                    mode="range"
                    selected={range}
                    onSelect={setRange}
                    footer={footer}
                    className="rounded-md border p-10"
                />

                <div>
                    <TableMain caption="Selection de la période" headers={formatDataToServiceTableHeader} rows={formatDataToServiceTableBody} />
                </div>
            </div>
        </>
    )

};

export default PeriodceCalendar;