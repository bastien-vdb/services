"use client";
import { Card, CardContent } from "@/src/components/ui/card";
import { Service } from "@prisma/client";
import StepperService from "./StepperService";
import { useState } from "react";
import ShineButton from "@/src/components/syntax-ui/ShineButton";
import Image from "next/image";

const Steps = ({ userId }: { userId: string }) => {
  const [infoTemporaireVisible, setInfoTemporaireVisible] = useState(true);
  return (
    <main className="flex flex-col p-2">
      <Card>
        <CardContent>
          {infoTemporaireVisible && (
            <div className="flex flex-col items-center text-justify gap-4 bg-gradient-to-r from-pink-50 via-[#0000] to-pink-50 p-6 max-w-4xl mx-auto mt-10 rounded-lg shadow-lg">
              <CalendarOff className="m-auto mb-2" size={28} color="red" />{" "}
              <div className="text-red-600">
                Le planning de Natacha ( créatrice du Finest Lash Studio et lash
                expert ) est complet pour le mois de juillet.
              </div>
              <div>
                Cependant, afin de pouvoir répondre à toutes les demandes, nous
                sommes ravies de vous annoncer que l’équipe s’agrandit !
              </div>
              <div>Louise va désormais pouvoir s’occuper de vous. </div>
              <div>
                Louise a été formée par Natacha, s’est entraînée tous les jours
                sans relâche pendant 2 mois et demi sous la supervision de la
                lash experte du Finest Lash Studio, et peut à présent créer des
                poses raffinées et élégantes.
              </div>
              <div>
                Elle partage notre engagement envers l’excellence, maîtrise
                maintenant quasi parfaitement toutes les techniques proposées en
                seulement 3 mois d’expérience, et a déjà pu faire des poses sur
                plus d’une centaine de modèles. Elle est maintenant prête à vous
                offrir des prestations minutieuses.
              </div>
              <div>
                Étant donné qu’elle débute et qu’elle prend un peu plus de temps
                à faire les poses pour l’instant, les tarifs sont réduits. Ils
                augmenteront considérablement d’ici septembre alors profitez-en
                maintenant !
              </div>
              <div>
                Nous vous laissons quelques unes de ses créations ci-dessous, et
                prendre rdv sur le bouton ci-après !
              </div>
              <CarouselTemporaire />
              <ShineButton
                onClick={() => setInfoTemporaireVisible(false)}
                text={"Prendre Rendez-vous"}
              />
            </div>
          )}
          {!infoTemporaireVisible && <StepperService />}
        </CardContent>
      </Card>
    </main>
  );
};

export default Steps;

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import { CalendarOff } from "lucide-react";
import { AspectRatio } from "@/src/components/ui/aspect-ratio";

const Pictures = [
  {
    id: 1,
    src: "/images/cil1.jpeg",
    alt: "",
  },
  {
    id: 2,
    src: "/images/cil2.png",
    alt: "",
  },
  {
    id: 3,
    src: "/images/cil3.png",
    alt: "",
  },
  {
    id: 4,
    src: "/images/cil4.png",
    alt: "",
  },
  {
    id: 5,
    src: "/images/cil5.jpeg",
    alt: "",
  },
];

export function CarouselTemporaire() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-sm"
    >
      <CarouselContent>
        {Pictures.map((p) => (
          <CarouselItem key={p.id} className="md:basis-1/2 lg:basis-1/2">
            <div className="p-1">
              <Card>
                <CardContent className="flex flex-col aspect-square items-center justify-center">
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      className="rounded-md object-cover"
                      width={500}
                      height={500}
                      src={p.src}
                      alt={p.alt}
                    />
                  </AspectRatio>

                  <span className="font-semibold">{p.id + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
