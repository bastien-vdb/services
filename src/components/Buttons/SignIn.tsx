'use client'
import { signIn } from 'next-auth/react';
import React from 'react';
import { Button } from '../ui/button';

function SignIn() {
    return (
        <Button size="lg" variant="default" onClick={() => signIn()}>Go !</Button>
    );
}

export default SignIn;