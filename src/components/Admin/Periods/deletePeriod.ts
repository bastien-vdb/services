import { periodActionType, periodType } from "@/src/reducers/periodReducer";
import { SetStateAction } from "react";

export const deletePeriod = async ({ period, periodDispatch }: { period: periodType; periodDispatch: React.Dispatch<SetStateAction<periodActionType>> }) => {
  
  try {
    if (!period.id) throw new Error("Period id is not defined");

    //Otpimistic update
    periodDispatch({
      type: "DELETE_PERIOD",
      payload: {
        id: period.id,
      },
    });

    fetch("/api/periods/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        period,
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
