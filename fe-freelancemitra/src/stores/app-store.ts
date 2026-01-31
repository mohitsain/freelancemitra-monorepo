import { create } from "zustand";

/**
 * Global client state (Zustand).
 * Use for UI state that doesn't come from the server: sidebar open, modals, etc.
 * For server/API state, use TanStack Query (useQuery / useMutation).
 */

interface AppState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
