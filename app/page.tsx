'use client'
import SelectService from "@/src/components/SelectService/SelectService";
import React, { useCallback } from "react";
import SelectSlot from "@/src/components/SelectSlot/SelectSlot";
import ServiceCalendar from "@/src/components/Calendar/ServiceCalendar";
import { useService } from '@/src/hooks/useService';
import { WithConnection } from "@/src/HOCs/WithConnection";
import { useTime } from "@/src/hooks/useTime";
import { Button } from "@/src/components/ui/button";


function Home() {

  const { daySelected, setDaySelected } = useTime();
  const { serviceState, serviceDispatch } = useService();

  const handleReset = useCallback(() => {
    serviceDispatch({
      type: 'RESET',
    })
    setDaySelected(null);
  }, []);

  if (serviceState.serviceSelected) return (
    <main className="flex flex-col">
      <div className="flex">
        <div className="m-auto flex gap-10 flex-wrap">
          <ServiceCalendar />
          {daySelected && <SelectSlot />}
          <Button variant="secondary" onClick={handleReset}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
          </Button>
        </div>
      </div>
    </main >
  );

  return (
    <main className="flex flex-col">
      <div className="w-[800px] m-auto">
        <SelectService />
      </div>
    </main >
  )
};

export default WithConnection(Home);