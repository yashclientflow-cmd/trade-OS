import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme, themes } from '../lib/theme';
import { createIsolatedStorage } from '../lib/storage';

interface ThemeStore {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  getThemeColors: () => typeof themes.light;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      currentTheme: 'light',
      
      setTheme: (theme) => {
        set({ currentTheme: theme });
      },
      
      toggleTheme: () => {
        const themeOrder: Theme[] = ['light', 'dark-navy', 'pure-black'];
        const currentIndex = themeOrder.indexOf(get().currentTheme);
        const nextIndex = (currentIndex + 1) % themeOrder.length;
        get().setTheme(themeOrder[nextIndex]);
      },
      
      getThemeColors: () => themes[get().currentTheme]
    }),
    {
      name: 'theme_v1',
      storage: createIsolatedStorage(),
    }
  )
);
