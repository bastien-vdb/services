'use client'
import { LoadingSpinner } from "@/src/components/ui/loader";
import useLoad from "@/src/hooks/useLoad";

export const GlobalLoader = ({ className }) => {
  const { loading } = useLoad();

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black opacity-70 z-50" style={{ pointerEvents: 'none' }}>
        <div className="flex justify-center items-center h-full">
          <div style={{ pointerEvents: 'auto' }}>
            <LoadingSpinner className={className} />
          </div>
        </div>
      </div>
    );
  }
  return null;
};
