import { useContext } from "react";
import { Time } from "@/src/contexts/time.context";

export const useTime = () => {
  const context = useContext(Time);
  if (!context) throw new Error("Component no inside context");
  return context;
};
