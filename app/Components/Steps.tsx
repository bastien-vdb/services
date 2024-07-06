"use client";
import { Card, CardContent } from "@/src/components/ui/card";
import { Service } from "@prisma/client";
import StepperService from "./StepperService";
import ShoppingCart from "@/src/components/cart/ShoppingCart";
import { useState } from "react";
import ShineButton from "@/src/components/syntax-ui/ShineButton";

const Steps = ({
  services,
  userId,
}: {
  services: Service[];
  userId: string;
}) => {
  const [infoTemporaireVisible, setInfoTemporaireVisible] = useState(true);
  return (
    <main className="flex flex-col p-2">
      <Card>
        <CardContent>
          {infoTemporaireVisible && (
            <div className="text-sm flex flex-col gap-4">
              <div>
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
              <ShineButton text={"Prendre Rendez-vous"} />
            </div>
          )}
          {!infoTemporaireVisible && (
            <StepperService services={services} userId={userId} />
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default Steps;
