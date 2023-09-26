'use client'
import { useService } from '@/src/hooks/useService';
import TableMain from '@/src/components/Table/TableMain';
import { Button } from '@/src/components/ui/button';

function SelectService() {

    const { serviceState, serviceDispatch } = useService();
    const services = serviceState.serviceList;

    const handleSelectService = (serviceName: string) => {
        serviceDispatch(
            {
                type: 'SELECT_SERVICE',
                payload: { serviceSelected: serviceName }
            })
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

    const formatDataToServiceTableBody = services.map((service, key) => (
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
                text: (<Button key={key} onClick={() => handleSelectService(service.name)} color="indigo">
                    Réserver
                </Button>)
            }

        ]
    ));

    return <TableMain caption="Sélection de la prestation" headers={formatDataToServiceTableHeader} rows={formatDataToServiceTableBody} />
}

export default SelectService;
