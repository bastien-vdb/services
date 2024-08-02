import { LoadingSpinner } from "@/src/components/ui/loader";

export default function Loading({ opacity = true }: { opacity: boolean }) {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div
      className={`fixed inset-0 ${opacity && "bg-black opacity-70"} z-50`}
      style={{ pointerEvents: "none" }}
    >
      <div className="flex justify-center items-center h-full">
        <div style={{ pointerEvents: "auto" }}>
          <LoadingSpinner className={"w-40"} />
        </div>
      </div>
    </div>
  );
}
