import { Service } from "@prisma/client";
import Step1 from "./SelectService/Step1";

import { Badge } from "@/src/components/ui/badge";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/src/components/ui/carousel";
import { useEffect, useState } from "react";
import Step2 from "./SelectService/Step2";
import Step3 from "./SelectService/Step3";
import Step4 from "./SelectService/Step4";

export default function StepperService({ userId }: { userId: string }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
  }, [api ? api.scrollSnapList().length : undefined]);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCount(api.scrollSnapList().length);
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
            <Step1 />
          </CarouselItem>
          <CarouselItem>
            <Step2 userId={userId} />
          </CarouselItem>
          <CarouselItem>
            <Step3 userId={userId} api={api} />
          </CarouselItem>
          <CarouselItem>
            <Step4 userId={userId} />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
}
