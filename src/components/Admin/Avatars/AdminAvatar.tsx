'use client';
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import Link from 'next/link';

function AdminAvatar() {
    const [home, setHome] = useState(true);

    return (
        <Link onClick={() => setHome(!home)} href={home ? "/admin" : "/"}>
            <Avatar>
                {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                <AvatarFallback>{home ? 'A' : 'H'}</AvatarFallback>
            </Avatar>
        </Link>
    );
}

export default AdminAvatar;