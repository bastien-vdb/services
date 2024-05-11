import { useConnect } from "@/src/hooks/useConnect";
import { signIn, useSession } from "next-auth/react";
import { Button } from "../components/ui/button";

export const WithConnection = (Component: any) => {
  const ComponentWithConnected = () => {
    const { data: session } = useSession();
    if (!useConnect()) return <div>You need to be connected to internet</div>;
    if (!session)
      return (
        <main className="flex flex-col">
          <div className="w-[800px] m-auto">
            <div>You need to be connected to access Booking app</div>
            <br />
            <Button variant="secondary" onClick={() => signIn()}>
              Sign in
            </Button>
          </div>
        </main>
      );
    return <Component />;
  };

  return ComponentWithConnected;
};
