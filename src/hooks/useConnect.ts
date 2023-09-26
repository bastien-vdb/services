import { useEffect, useState } from "react";

export const useConnect = () => {
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    window.addEventListener("online", () => setConnected(true));
    window.addEventListener("offline", () => setConnected(false));
  }, []);

  return connected;
};
