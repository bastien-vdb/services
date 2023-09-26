import React, { useState } from 'react';
import { useService } from "@/src/hooks/useService";
import TableMain from "@/src/components/Table/TableMain";
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button";
import { z } from 'zod';


function Services() {

    const { serviceState, serviceDispatch } = useService();
    const services = serviceState.serviceList;

    const [serviceName, setServiceName] = useState("");
    const [servicePrice, setServicePrice] = useState(0);

    const formatDataToServiceTableHeader = [
        {
            className: "w-20",
            text: 'Prestations'
        },
        {
            className: "text-right",
            text: 'Prix'
        },
        {
            className: "",
            text: '',
        }
    ];

    const formatDataToServiceTableBody = services.map((service) => (
        [
            {
                className: "font-medium w-40",
                text: service.name
            },
            {
                className: "text-right",
                text: service.price,
            },
            {
                className: "text-right",
                text: (<Button onClick={() => handleDeleteService(service.name)} variant="destructive">
                    Supprimer
                </Button>)
            }

        ]
    ));

    const handleDeleteService = (serviceName: string) => {
        serviceDispatch({
            type: 'DELETE_SERVICE',
            payload: { serviceSelected: serviceName }
        })
    }

    const handleAddService = (e: any) => {
        e.preventDefault();

        const newServiceSchema = z.object({
            name: z.string(),
            price: z.number()
        });

        const newService = {
            name: serviceName,
            price: servicePrice
        }
        try {
            newServiceSchema.parse(newService);

            serviceDispatch({
                type: 'ADD_SERVICE',
                payload: {
                    newService: {
                        name: serviceName,
                        price: servicePrice,
                    }
                }
            })
            setServiceName("");
            setServicePrice(0);
        }
        catch (error) {
            console.log('erreur capturée par zod: ', error);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'servicename') setServiceName(e.target.value);
        if (e.target.name === 'serviceprice') setServicePrice(Number(e.target.value));
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