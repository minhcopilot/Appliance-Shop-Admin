import { create } from "zustand";

interface Loading {
  acceptLoading: number | boolean;
  disconnectLoading: number | boolean;
  setAcceptLoading: (loading: number | boolean) => void;
  setDisconnectLoading: (loading: number | boolean) => void;
}

export const useLoading = create<Loading>((set, get) => ({
  acceptLoading: false,
  disconnectLoading: false,
  setAcceptLoading: (loading: number | boolean) =>
    set({ acceptLoading: loading }),
  setDisconnectLoading: (loading: number | boolean) =>
    set({ disconnectLoading: loading }),
}));
