'use client'
import { createContext, useEffect, useReducer, useState } from "react";
import { serviceReducer } from "@/src/reducers/serviceReducer";
import type { serviceStateType, serviceActionType } from "@/src/reducers/serviceReducer";

type ServiceContextType = {
    serviceState: serviceStateType;
    serviceDispatch: React.Dispatch<serviceActionType>;
}

export const ServiceContext = createContext<ServiceContextType | null>(null);

export const ServiceProvider = ({ children }: { children: React.ReactNode }) => {

    const serviceStateInit = {
        serviceList: [],
        serviceSelected: "",
    }

    const [serviceState, serviceDispatch] = useReducer(serviceReducer, serviceStateInit);

    useEffect(() => {
        fetch('/api/services')
            .then(services => services.json())
            .then(services => {
                serviceDispatch({
                    type: 'SET_SERVICES',
                    payload: { services }
                })
            });
    }, []);

    return <ServiceContext.Provider value={{ serviceState, serviceDispatch }}>
        {children}
    </ServiceContext.Provider>
}

