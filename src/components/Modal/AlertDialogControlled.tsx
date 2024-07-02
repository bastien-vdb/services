import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { CalendarOff } from "lucide-react";
import { useState } from "react";
import TextGradient from "../syntax-ui/TextGradient";

type AlertDialogControlledProps = {
  cancel?: boolean;
  validationButtonMsg?: string;
};

export default function AlertDialogControlled({
  cancel = false,
  validationButtonMsg = "Continue",
}: AlertDialogControlledProps) {
  const [open, setOpen] = useState(true);
  return (
    <AlertDialog open={open}>
      <AlertDialogContent style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xs sm:text-base">
            <h3 className="m-2">
              {" "}
              <CalendarOff className="m-auto mb-4" size={30} color="red" />{" "}
              <span className="text-red-600">
                Tous les rendez-vous sont complets
              </span>
            </h3>
            <span>
              {" "}
              Nous sommes désolés, mais tous les rendez-vous avec{" "}
              <span className="text-red-600">Natacha</span> sont actuellement
              complets pour le mois en cours.
            </span>
            <h1 className="flex justify-center m-2">
              🎉{" "}
              <TextGradient
                additionalClassName="text-lg"
                text={"Nouvelle recrue !"}
              />{" "}
              🎉
            </h1>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-xs sm:text-sm">
            <div>
              Nous sommes ravis de vous annoncer que notre équipe s'agrandit !
            </div>
            <br />
            <div>
              Pour répondre à la forte demande et continuer à vous offrir un
              service de qualité, nous avons le plaisir d'accueillir [Nom de la
              Recrue] dans notre salon.
            </div>
            <br />
            <div>
              [Nom de la Recrue] a été formée par mes soins, maîtrisant
              parfaitement notre savoir-faire et nos techniques uniques.
            </div>
            <br />
            <div>
              Elle partage notre engagement envers l'excellence et est prête à
              vous offrir des prestations exceptionnelles.
            </div>
            <br />
            <div>
              N'hésitez pas à réserver avec elle pour vos prochaines prestations
              !
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {cancel && <AlertDialogCancel>Cancel</AlertDialogCancel>}
          <AlertDialogAction onClick={() => setOpen(false)}>
            {validationButtonMsg}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
