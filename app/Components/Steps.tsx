"use client";
import { Card, CardContent } from "@/src/components/ui/card";
import { Service } from "@prisma/client";
import StepperService from "./StepperService";
import ShoppingCart from "@/src/components/cart/ShoppingCart";

const Steps = ({
  services,
  userId,
}: {
  services: Service[];
  userId: string;
}) => {
  const sampleItems = [
    { name: "Product 1", price: 29.99 },
    { name: "Product 2", price: 49.99 },
    { name: "Product 3", price: 19.99 },
  ];
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
