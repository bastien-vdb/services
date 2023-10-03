import React, { useState } from 'react';
import { useService } from "@/src/hooks/useService";
import TableMain from "@/src/components/Table/TableMain";
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button";
import { servicesType } from '@/src/types/service.type';
import { addService } from '@/src/components/Admin/Services/addService';
import { deleteService } from '@/src/components/Admin/Services/deleteService';


function Services() {

    const { serviceState, serviceDispatch } = useService();
    const { serviceList } = serviceState;
    const [loading, setLoading] = useState(false);

    const [serviceName, setServiceName] = useState("");
    const [servicePrice, setServicePrice] = useState(0);

    const formatDataToServiceTableHeader = [
        { className: "w-20", text: 'Prestations' },
        { className: "text-right", text: 'Prix' },
        { className: "", text: '' }
    ];

    const formatDataToServiceTableBody = serviceList.map((service) => (
        [
            { className: "font-medium w-40", text: service.name },
            { className: "text-right", text: service.price },
            { className: "text-right", text: <Button onClick={() => handleDeleteService(service)} disabled={loading} variant="destructive">Supprimer</Button> }
        ]
    ));



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'servicename') setServiceName(e.target.value);
        if (e.target.name === 'serviceprice') setServicePrice(Number(e.target.value));
    }

    const handleAddService = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        addService({
            e,
            serviceName,
            servicePrice,
            serviceDispatch,
            setLoading
        });
        setServiceName("");
        setServicePrice(0);
    };

    const handleDeleteService = (service: servicesType) => {
        deleteService(
            service,
            serviceDispatch
        );
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