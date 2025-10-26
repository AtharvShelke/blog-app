import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  mounted: boolean;
  
  // Actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setMounted: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      sidebarOpen: true,
      mounted: false,

      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },

      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
        set({ theme: newTheme });
        applyTheme(newTheme);
      },

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      setMounted: () => set({ mounted: true }),
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        theme: state.theme,
        sidebarOpen: state.sidebarOpen 
      }),
    }
  )
);

// Helper function to apply theme to document
function applyTheme(theme: Theme) {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  root.classList.remove('light', 'dark');

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
}

// Initialize theme on mount
if (typeof window !== 'undefined') {
  const store = useUIStore.getState();
  applyTheme(store.theme);
}
