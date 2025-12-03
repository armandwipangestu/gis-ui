import { create } from "zustand";

type SidebarState = {
    isOpen: boolean; // current state (true = open)
    setOpen: (v: boolean) => void; // set manual
    toggle: () => void; // open/close
    open: () => void; // force open
    close: () => void; // force close
    // helper: at desktop default is open, but in mobile default is close
    applyBreakpoint: (isDekstop: boolean) => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
    isOpen: false,
    setOpen: (v) => set({ isOpen: v }),
    toggle: () => set((s) => ({ isOpen: !s.isOpen })),
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    applyBreakpoint: (isDekstop) => set({ isOpen: isDekstop }),
}));
