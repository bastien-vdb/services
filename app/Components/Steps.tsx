"use client";
import ServiceCalendar from "@/app/Components/Calendar/ServiceCalendar";
import SelectService from "./SelectService/SelectService";
import { Button } from "@/src/components/ui/button";
import { useCallback } from "react";
import { Service } from "@prisma/client";
import useServiceStore from "@/app/admin/Components/Services/useServicesStore";
import StepperService from "./StepperService";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import Step2 from "./SelectService/Step2";

const Steps = ({
  services,
  userId,
}: {
  services: Service[];
  userId: string;
}) => {
  return (
    <main className="flex flex-col p-2">
      <Card>
        <CardContent>
          <StepperService services={services} userId={userId} />
        </CardContent>
      </Card>
    </main>
  );
};

export default Steps;
