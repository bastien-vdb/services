'use client'
import { LoadingSpinner } from "@/src/components/ui/loader";
import useLoad from "@/src/hooks/useLoad";

export const GlobalLoader = ({ className }) => {
  const { loading } = useLoad();

  return loading ? <LoadingSpinner className={className} /> : null;

};
