'use client'
import React, { createContext, useState, useCallback } from "react";

type timeType = {
    daySelected: Date | null;
    setDaySelected: (newDate: Date | null) => void
}

export const Time = createContext<timeType | null>(null);


export const TimeProvider = ({ children }: { children: React.ReactNode }) => {

    const [daySelected, modifyDaySelected] = useState<Date | null>(null);

    const setDaySelected = useCallback((newDate: Date | null) => {
        if (newDate && newDate?.toString() !== daySelected?.toString()) {
            const dateFromMidnight = new Date(newDate.setHours(0));
            modifyDaySelected(dateFromMidnight);
        }
    }, [daySelected])

    return (<Time.Provider value={{ daySelected, setDaySelected }}>
        {children}
    </Time.Provider>
    )
}





