'use client'
import { signOut } from 'next-auth/react';
import React from 'react';
import { Button } from '../ui/button';

type SignOutProps = {
    variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
}

function SignOut({variant = "secondary"}:SignOutProps) {
    return (
        <Button size="sm" variant={variant} onClick={() => signOut()}>Se déconnecter</Button>
    );
}

export default SignOut;