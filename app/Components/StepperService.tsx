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
import Step4 from "./SelectService/Step4";
import Step3 from "./SelectService/Step3";
import Step5 from "./SelectService/Step5";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";

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
  const stepContent = [
    <Step1 services={services} />,
    <Step2 />,
    <Step3 userId={userId} />,
    <Step4 userId={userId} />,
    <Step5 userId={userId} />,
  ];
  return (
    <div className="flex w-full flex-col gap-4 p-2">
      <Carousel>
        <CarouselContent>
          {stepContent.map((f) => (
            <CarouselItem>{f}</CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
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
