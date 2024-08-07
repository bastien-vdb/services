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
import { AlertCircle, X } from "lucide-react";
import { useState } from "react";
import TextGradient from "../syntax-ui/TextGradient";

type AlertDialogControlledProps = {
  cancel?: boolean;
  validationButtonMsg?: string;
  openCtr: [boolean, (b: boolean) => void];
};

export default function AlertDialogControlled({
  cancel = false,
  validationButtonMsg = "J'ai compris",
  openCtr,
}: AlertDialogControlledProps) {
  const [modalVisible, setModalVisible] = openCtr;
  return (
    <AlertDialog open={modalVisible}>
      <AlertDialogContent style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center flex flex-col text-xs sm:text-base">
            <button
              onClick={() => setModalVisible(false)}
              className="m-0 p-0 self-end"
            >
              <X className="m-0 p-0" />{" "}
            </button>
            <h3 className="m-2">
              <AlertCircle className="m-auto mb-2" size={28} color="red" />{" "}
              <span>
                Vous venez de sélectionner la pose
                <TextGradient
                  additionalClassName="text-lg"
                  text={"Fox Eyes"}
                />{" "}
              </span>
            </h3>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-xs sm:text-sm text-gray-600">
            <div>
              <b>Pour précision :</b> Ce set va à la perfection à celles ayant
              des yeux en amande, avec une base ciliaire assez fournie et
              régulière.
            </div>
            <br />
            <div>
              Pour celles ayant les yeux plus ronds / les yeux tombants / les
              yeux avec paupières tombantes, il est important de préciser que
              l'effet ne sera pas du tout le même ! Cela aura tendance à
              alourdir le regard au lieu de le relever, donc tout l'inverse.
            </div>
            <br />
            <div className="font-bold text-base text-black">
              Etes-vous sûr(e) de convenir à la description et sélectionner
              cette pose ?
            </div>
            <br />
            <div>
              Note : En cas de doute, vous pouvez directement contacter votre
              Finest Lash Artist via DM sur instagram, par mail à
              contact@finestlashstudio.fr ou par SMS / Whatsapp au 07 83 63 97
              38 si vous voulez être conseillée au mieux avant de réserver votre
              créneau.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {cancel && <AlertDialogCancel>Cancel</AlertDialogCancel>}
          <AlertDialogAction onClick={() => setModalVisible(false)}>
            {validationButtonMsg}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
