'use client'
import React from 'react';
import { SessionProvider, getSession } from 'next-auth/react';
async function AuthSessionProvider({ children }: { children: React.ReactNode }) {

    return (

        <SessionProvider>
            {children}
        </SessionProvider>

    );
}

export default AuthSessionProvider;