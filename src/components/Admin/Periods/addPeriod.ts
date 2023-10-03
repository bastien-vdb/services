import { periodActionType } from "@/src/reducers/periodReducer";
import { SetStateAction } from "react";

export const addPeriod = async ({ from, to, periodDispatch, setLoading }: { from: Date; to: Date; periodDispatch: React.Dispatch<periodActionType>; setLoading: React.Dispatch<SetStateAction<boolean>> }) => {
  try {
    setLoading(true);

    //Otpimistic update
    periodDispatch({
      type: "ADD_PERIOD",
      payload: {
        date: new Date(),
        start: from,
        end: to,
      },
    });

    fetch("/api/periods/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start: from,
        end: to,
      }),
    })
      .then(async (res) => await res.json())
      .then((newListOfPeriods) => {
        periodDispatch({
          type: "SET_PERIODS",
          payload: newListOfPeriods,
        });
      })
      .finally(() => setLoading(false));
  } catch (error: any) {
    throw new Error(error);
  }
};
