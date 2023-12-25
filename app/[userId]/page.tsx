import React from 'react';
import { prisma } from "@/src/db/prisma";
import Steps from '@/src/components/Main/Steps';
import { Service } from '@prisma/client';


async function Business({ params }: { params: { userId: string } }) {

    const { userId } = params;

    let services: Service[] = [];

    try {
        const res = await prisma.service.findMany({
            where: {
                createdById: userId,
            },
        })
        services.push(...res);

    } catch (error) {
        throw new Error("Data cannot be reach from the db");
    }

    return <Steps services={services} userId={userId} />
}

export default Business;