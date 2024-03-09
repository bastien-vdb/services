'use client'
import { Button } from '@/src/components/ui/button';
import React, { useState } from 'react';
import actionNewStripeAccount from './actionNewStripeAccount';
import Link from 'next/link';
import useSubscribe from './useSubscribe';

function Subscribe({ userId, stripeAccount }: { userId: string, stripeAccount: string | null }) {

    const [stripeLink, setStripeLink] = useState<string | null>(null);

    const getAlink = async () => {
        const link = await useSubscribe({ userId })
        setStripeLink(link);
    };

    return (
        <>
            <Button onClick={getAlink}>{stripeAccount ? 'Reprendre' : 'Souscrire'}</Button>
            {stripeLink && <Link href={stripeLink}>Inscription</Link>}
        </>
    );
}

export default Subscribe;