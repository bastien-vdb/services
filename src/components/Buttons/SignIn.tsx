'use client'
import { signIn } from 'next-auth/react';
import React from 'react';
import { Button } from '../ui/button';

function SignIn() {
    return (
        <Button size="sm" variant="default" onClick={() => signIn()}>Se connecter</Button>
    );
}

export default SignIn;