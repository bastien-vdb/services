'use client'
import { signOut } from 'next-auth/react';
import React from 'react';
import { Button } from '../ui/button';

function SignOut() {
    return (
        <Button size="sm" variant="secondary" onClick={() => signOut()}>Se déconnecter</Button>
    );
}

export default SignOut;