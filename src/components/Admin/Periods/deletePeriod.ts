import { periodActionType } from "@/src/reducers/periodReducer";
import { SetStateAction } from "react";

export const deletePeriod = async ({ id, periodDispatch }: { id: string; periodDispatch: React.Dispatch<SetStateAction<periodActionType>> }) => {
  try {
    //Otpimistic update
    periodDispatch({
      type: "DELETE_PERIOD",
      payload: {
        id,
      },
    });

    fetch("/api/periods/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    })
      .then(async (res) => await res.json())
      .then((newListOfPeriods) => {
        periodDispatch({
          type: "SET_PERIODS",
          payload: newListOfPeriods,
        });
      });
  } catch (error: any) {
    throw new Error(error);
  }
};
