import { useConnect } from "@/src/hooks/useConnect";

export const WithConnection = (Component: any) => {

  const ComponentWithConnected = () => {
    if (useConnect()) return <Component />;
    return <div>You need to be connected to internet</div>
  }

  return ComponentWithConnected;
}