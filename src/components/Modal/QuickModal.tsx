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

const QuickModal = ({
  onAction,
  onActionOptional,
  title,
  actionTxt,
  actionOptionalTxt,
  showCtr,
  children,
  hideActionButton = false,
}: {
  onAction: () => void;
  onActionOptional?: () => void;
  title: string;
  actionTxt: string;
  actionOptionalTxt?: string;
  showCtr: [boolean, (show: boolean) => void];
  children?: React.ReactNode;
  hideActionButton?: boolean;
}) => {
  const [show, setOpen] = showCtr;

  if (!show) return null;
  return (
    <AlertDialog open={show}>
      <AlertDialogContent className="overflow-y-auto max-h-screen">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          {!hideActionButton && (
            <div className="flex gap-2 m-auto mt-2 sm:my-0">
              {onAction && (
                <AlertDialogAction onClick={onAction}>
                  {actionTxt}
                </AlertDialogAction>
              )}
              {onActionOptional && (
                <AlertDialogAction onClick={onActionOptional}>
                  {actionOptionalTxt}
                </AlertDialogAction>
              )}
            </div>
          )}
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Annuler
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default QuickModal;
