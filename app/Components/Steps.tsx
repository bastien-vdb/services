"use client";
import { Card, CardContent } from "@/src/components/ui/card";
import { Service } from "@prisma/client";
import StepperService from "./StepperService";

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
