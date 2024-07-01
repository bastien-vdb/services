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
import { useState } from "react";

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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>🎉 Nouvelle recrue ! 🎉</AlertDialogTitle>
          <AlertDialogDescription>
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
