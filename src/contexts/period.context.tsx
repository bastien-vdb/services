'use client'
import { createContext, useEffect, useReducer } from "react";
import { periodReducer } from "@/src/reducers/periodReducer";
import type { periodStateType, periodActionType } from "@/src/reducers/periodReducer";

export type periodContextType = {
    periodState: periodStateType;
    periodDispatch: React.Dispatch<periodActionType>;
};

const periodStateInit: periodStateType = {
    periods: [],
}

export const periodContext = createContext<periodContextType | null>(null);

export const PeriodProvider = ({ children }: { children: React.ReactNode }) => {
    const [periodState, periodDispatch] = useReducer(periodReducer, periodStateInit);

    useEffect(() => {
        fetch('/api/periods')
            .then(async (periods) => await periods.json())
            .then(periods => {
                periodDispatch({
                    type: 'SET_PERIODS',
                    payload: periods
                })
            });
    }, []);

    return <periodContext.Provider value={{ periodState, periodDispatch }}>{children}</periodContext.Provider>;
};