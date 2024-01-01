'use client'
import TableMain from '@/src/components/Table/TableMain';
import { Button } from '@/src/components/ui/button';
import { Service } from '@prisma/client';
import useServiceStore from '@/app/admin/Components/Services/useServicesStore';

function SelectService({ services }: { services?: Service[] }) {

    const { changeServiceSelected } = useServiceStore();

    const handleSelectService = (service: Service) => {
        changeServiceSelected(service);
    }

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

    const formatDataToServiceTableBody = services?.map((service, key) => (
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
                text: (<Button key={key} onClick={() => handleSelectService(service)} color="indigo">
                    Réserver
                </Button>)
            }

        ]
    ));

    return <TableMain caption="Sélection de la prestation" headers={formatDataToServiceTableHeader} rows={formatDataToServiceTableBody!} />
}

export default SelectService;