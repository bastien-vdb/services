'use client'
import { createContext, useContext, useReducer } from "react";
import { services } from "../lib/Config/serviceConfig";
import type { servicesType } from '@/src/types/service.type';

type ServiceContextType = {
    serviceState: serviceStateType;
    serviceDispatch: React.Dispatch<serviceActionType>;
}

export const ServiceContext = createContext<ServiceContextType | null>(null);

/*** state */

type serviceStateType = {
    serviceList: servicesType[],
    serviceSelected: string;
}

type serviceActionType = {
    type: 'SELECT_SERVICE' | 'RESET' | 'DELETE_SERVICE',
    payload?: { serviceSelected: string }
}
    |
{
    type: 'ADD_SERVICE',
    payload?: { newService: Omit<servicesType, 'id'> }
}

const serviceStateInit = {
    serviceList: services,
    serviceSelected: "",
}

const serviceReducer = (state: serviceStateType, action: serviceActionType) => {
    console.log('on y est')
    switch (action.type) {
        case 'SELECT_SERVICE':
            if (!action.payload) throw new Error('payload mandatory for this action');
            return {
                ...state, serviceSelected: action.payload.serviceSelected
            }
        case 'RESET':
            return {
                ...state, serviceSelected: ""
            }
        case 'DELETE_SERVICE':
            if (!action.payload) throw new Error('payload mandatory for this action');
            return {
                ...state, serviceList: state.serviceList.filter(service => (
                    service.name !== action.payload?.serviceSelected
                ))
            }
        case 'ADD_SERVICE':
            if (!action.payload) throw new Error('payload mandatory for this action');
            const nextId = state.serviceList.length;
            return {
                ...state, serviceList: [...state.serviceList, {
                    id: nextId,
                    name: action.payload.newService.name,
                    price: action.payload.newService.price,
                }]
            };
    }
}

export const ServiceProvider = ({ children }: { children: React.ReactNode }) => {

    const [serviceState, serviceDispatch] = useReducer(serviceReducer, serviceStateInit);

    return <ServiceContext.Provider value={{ serviceState, serviceDispatch }}>
        {children}
    </ServiceContext.Provider>
}

