import React from 'react';
import { Button } from "@/src/components/ui/button";
import Link from 'next/link';

function Success() {
    return (
        <div className='mt-20 mx-2 sm:mx-20 sm:mt-40 text-center'>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Votre réservation a bien été enregistrée
            </h1>
            <Link href={"/"}>
                <Button className='mt-20'>Retour</Button>
            </Link>
        </div>
    );
}

export default Success;