import { useContext } from "react";
import { ServiceContext } from '@/src/contexts/service.context';
export const useService = () => {
    const context = useContext(ServiceContext)
    if (!context) throw new Error('This component is not included in the context');
    return context;
}