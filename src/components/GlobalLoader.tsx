'use client'
import { LoadingSpinner } from "@/src/components/ui/loader";
import useLoad from "@/src/hooks/useLoad";

export const GlobalLoader = ({ className }) => {
  const { loading } = useLoad();

  if (loading) return (
    <div className="absolute bg-black z-10 h-screen w-screen" style={
      {
        fill: "hsl(var(--foreground))",
        opacity: 0.7,
      } as React.CSSProperties
    }>
      <div className="relative top-[50%] left-[50%]" >
        <LoadingSpinner className={className} />
      </div>
    </div>
  );
  return <></>;
}