import { create } from "zustand";

type LoadState = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const useLoad = create<LoadState>((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
}));

export default useLoad;
