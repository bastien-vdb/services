import { prisma } from '@/src/db/prisma';

async function useServerData(prismaKey: string) {

    try {
        const result = await (prisma[prismaKey as any] as any).findMany();
        return result;
    }
    catch (error) {
        console.log(error);
        throw new Error('Data cannot be reach from the db');
    }

}

export default useServerData;