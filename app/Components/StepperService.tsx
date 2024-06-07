import {
  Step,
  type StepItem,
  Stepper,
  useStepper,
} from "@/src/components/stepper";
import { Button } from "@/src/components/ui/button";
import { Service } from "@prisma/client";
import Step1 from "./SelectService/Step1";
import ServiceCalendar from "./Calendar/ServiceCalendar";
import Step2 from "./SelectService/Step2";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import { useEffect, useState } from "react";
import { Badge } from "@/src/components/ui/badge";
import Step3 from "./SelectService/Step3";
import Step4 from "./SelectService/Step4";
import Step5 from "./SelectService/Step5";
import Step6 from "./SelectService/Step6";

const steps = [
  {
    label: "Choisir sa prestation",
    description: "Choisissez votre prestation",
  },
  { label: "Option" },
  { label: "Informations" },
  { label: "Choisir son créneau" },
  { label: "Paiement" },
] satisfies StepItem[];

export default function StepperService({
  services,
  userId,
}: {
  services: Service[];
  userId: string;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="flex w-full flex-col gap-4 p-2">
      <Carousel
        setApi={setApi}
        opts={{
          watchDrag: false,
        }}
      >
        <div className="flex justify-center mb-6 sm:mb-20">
          <Badge variant="outline" className="text-sm">
            Etape:{current}/{count}
          </Badge>
        </div>
        <CarouselContent>
          <CarouselItem>
            <Step1 services={services} />
          </CarouselItem>
          <CarouselItem>
            <Step2 />
          </CarouselItem>
          <CarouselItem>
            <Step3 userId={userId} api={api} />
          </CarouselItem>
          <CarouselItem>
            <Step4 userId={userId} api={api} />
          </CarouselItem>
          <CarouselItem>
            <Step5 userId={userId} />
          </CarouselItem>
          <CarouselItem>
            <Step6 userId={userId} />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
}

const Footer = () => {
  const {
    nextStep,
    prevStep,
    resetSteps,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
    isDisabledStep,
  } = useStepper();
  return (
    <>
      {hasCompletedAllSteps && (
        <div className="h-40 flex items-center justify-center my-2 border bg-secondary text-primary rounded-md">
          <h1 className="text-xl">Woohoo! All steps completed! 🎉</h1>
        </div>
      )}
      <div className="w-full flex justify-center gap-2">
        {hasCompletedAllSteps && (
          <Button size="sm" onClick={resetSteps}>
            Reset
          </Button>
        )}
      </div>
    </>
  );
};
