'use client'
import React from 'react';
import { Badge } from "@/src/components/ui/badge"
import PeriodceCalendar from '@/src/components/Admin/Periods/PeriodCalendar';
import { Button } from '@/src/components/ui/button';

function Periods() {

    const handleDeleteEmmergency = () => {
        fetch('/api/periods/delete_emmergency', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    return (
        <>
            <Badge className="w-20 m-auto">Periods</Badge><br />
            <PeriodceCalendar />
        </>
    );
}

export default Periods;