import React from 'react';
import { Badge } from "@/src/components/ui/badge"
import PeriodceCalendar from '@/src/components/Admin/Periods/PeriodCalendar';

function Periods() {

    return (
        <>
            <Badge className="w-20 m-auto">Periods</Badge><br />
            <PeriodceCalendar />
        </>
    );
}

export default Periods;