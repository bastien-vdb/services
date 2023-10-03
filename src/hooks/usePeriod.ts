import { useContext } from "react";
import { periodContext } from "@/src/contexts/period.context";

export const usePeriod = () => {
  const context = useContext(periodContext);
  if (context === undefined) {
    throw new Error("usePeriods must be used within a PeriodsProvider");
  }
  return context;
};
