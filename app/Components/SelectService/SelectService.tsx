'use client'
import TableMain from '@/src/components/Table/TableMain';
import { Button } from '@/src/components/ui/button';
import { Service } from '@prisma/client';
import useServiceStore from '@/app/admin/Components/Services/useServicesStore';
import { Gem, CalendarPlus, Coins } from 'lucide-react';

function SelectService({ services }: { services?: Service[] }) {

    const { changeServiceSelected } = useServiceStore();

    const handleSelectService = (service: Service) => {
        changeServiceSelected(service);
    }

    const HeaderWithIcon = (Icon: JSX.Element, text: string) => {
        return (
            <div className='flex items-center gap-4'>
                <span>{text}</span> {Icon}
            </div>
        )
    };

    const formatDataToServiceTableHeader = [
        {
            className: "w-20",
            text: HeaderWithIcon(<Gem size={18} />, 'Prestations'),
            tooltip: 'Prestations'
        },
        {
            className: "float-right mt-8",
            text: <Coins size={22} />,
            tooltip: 'Prix'
        },
        {
            className: "",
            text: "",
            tooltip: ""
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
                text: service.price/100 + ' €',
            },
            {
                className: "text-right",
                text: (<Button title='Réservation en ligne' key={key} onClick={() => handleSelectService(service)} color="indigo">
                    <span className='mx-2 hidden sm:block'>Réserver</span> <CalendarPlus size={18} color="#008026" />
                </Button>)
            }
        ]
    ));

    return <div className='m-2 md:mx-20 lg:mx-44 xl:mx-96'>
        <TableMain caption="Sélection de la prestation" headers={formatDataToServiceTableHeader} rows={formatDataToServiceTableBody!} />
    </div>
}

export default SelectService;