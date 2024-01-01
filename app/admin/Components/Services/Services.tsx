'use client'
import { useEffect, useState } from 'react';
import TableMain from "@/src/components/Table/TableMain";
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button";
import { Service } from '@prisma/client';
import useServiceStore from './useServicesStore';
import { useSession } from 'next-auth/react';
import useCreateServerData from './useCreateServiceData';
import useDeleteServiceData from './useDeleteServiceData';

function Services({services}: {services: Service[]}) {

    const [loading, setLoading] = useState(false);
    const {services:servicesFromStore, reLoadServices, addService, removeService} = useServiceStore();

    const session = useSession();
    const [serviceName, setServiceName] = useState("");
    const [servicePrice, setServicePrice] = useState(0);

    const formatDataToServiceTableHeader = [
        { className: "w-20", text: 'Prestations' },
        { className: "text-right", text: 'Prix' },
        { className: "", text: '' }
    ];

    const formatDataToServiceTableBody = (servicesFromStore.length>0 ? servicesFromStore : services).map((service) => (
        [
            { className: "font-medium w-40", text: service.name },
            { className: "text-right", text: service.price },
            { className: "text-right", text: <Button onClick={() => handleDeleteService(service)} disabled={loading} variant="destructive">Supprimer</Button> }
        ]
    ));

    useEffect(() => {
        reLoadServices(session?.data?.user.id!);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'servicename') setServiceName(e.target.value);
        if (e.target.name === 'serviceprice') setServicePrice(Number(e.target.value));
    }

    const handleAddService = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        //Optimistic update with fake data
        addService({
            id: '',
            name: serviceName,
            price: servicePrice,
            createdById: '',
            stripeId: '',
            stripePriceId: ''
        });

        await useCreateServerData({
            name: serviceName,
            price: servicePrice,
        });
        reLoadServices(session?.data?.user.id!);
        setLoading(false);
    };

    const handleDeleteService = async(service: Service) => {  
        setLoading(true);
        removeService(service);//Optimistic update
        await useDeleteServiceData({service});
        reLoadServices(session?.data?.user.id!);
        setLoading(false);
        
    }

    return (
        <>
            <Badge className="w-20 m-auto">Services</Badge>
            <TableMain caption="Sélection de la prestation" headers={formatDataToServiceTableHeader} rows={formatDataToServiceTableBody} />
            <form onSubmit={handleAddService}>
                <div className="flex w-full max-w-sm items-center space-x-2 my-6">
                    <Input onChange={handleChange} value={serviceName} type="text" name="servicename" placeholder="Service name" />
                    <Input onChange={handleChange} value={servicePrice} type="number" name="serviceprice" className="w-20" placeholder="€" />
                    <Button type="submit">Add</Button>
                </div>
            </form>
        </>
    );
}

export default Services;