'use client';
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/src/components/ui/hover-card";

function AdminAvatar() {
    const [home, setHome] = useState(true);
    const { data: session } = useSession();


    return (
        <>
            <Link onClick={() => setHome(!home)} href={home ? "/admin" : "/"}>
                <Avatar>
                    <AvatarFallback>{home ? 'A' : 'H'}</AvatarFallback>
                </Avatar>
            </Link>

            <HoverCard>
                <HoverCardTrigger><Avatar>
                    <AvatarImage src={session?.user?.image!} />
                </Avatar></HoverCardTrigger>
                <HoverCardContent>
                    Connecté en tant que {session?.user?.name}
                </HoverCardContent>
            </HoverCard>
        </>
    );
}

export default AdminAvatar;