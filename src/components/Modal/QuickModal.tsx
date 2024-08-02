import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";

const QuickModal = ({
  onAction,
  onActionOptional,
  disabled,
  children,
}: {
  onAction: () => void;
  onActionOptional?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger disabled={disabled}>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Que souhaitez-vous ajouter ?</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onAction}>
            Disponibilitées{" "}
          </AlertDialogAction>
          <AlertDialogAction onClick={onActionOptional}>
            Bookings
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default QuickModal;
