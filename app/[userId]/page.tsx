import React from 'react';
import { prisma } from "@/src/db/prisma";
import SelectService from '@/src/components/SelectService/SelectService';


async function page({ params }: { params: { userId: string } }) {

    const { userId } = params;

    let services: {
        id: string;
        name: string;
        price: number;
        createdById: string | null;
        stripeId: string | null;
        stripePriceId: string | null;
    }[] = [];

    try {
        const res = await prisma.service.findMany({
            where: {
                createdById: '6586b8aceef121479063c8f6',
            },
        })
        services.push(...res);

    } catch (error) {
        throw new Error("Data cannot be reach from the db");
    }

    return (
        <div>
            Business page for {userId}

            {services && services.map(prestation => <div>{prestation.name}</div>)}
            <SelectService services={services} />
        </div>
    );
}

export default page;