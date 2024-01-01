'use server'
import { prisma } from '@/src/db/prisma';

async function useServerData(prismaKey: unknown, where: { [key: string]: unknown } = {}) {

    console.log('PrismaKey useServerData:', prismaKey);
    console.log('WHERE useServerData:', where);
    try {
        return await (prisma[prismaKey as any] as any).findMany({
            where,
        });
    }
    catch (error) {
        console.log(error);
        throw new Error('Data cannot be reach from the db');
    }

}

export default useServerData;