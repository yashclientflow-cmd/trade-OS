import { StateStorage, createJSONStorage } from 'zustand/middleware';

const STORAGE_KEY_PREFIX = 'reasontrack_';
const USER_ID_KEY = 'reasontrack_current_user_id';

export const getUserId = (): string => {
  try {
    return localStorage.getItem(USER_ID_KEY) || 'guest';
  } catch {
    return 'guest';
  }
};

export const setUserId = (userId: string) => {
  localStorage.setItem(USER_ID_KEY, userId);
};

export const clearUserId = () => {
  localStorage.removeItem(USER_ID_KEY);
};

// Custom storage adapter that isolates data per user
export const userIsolatedStorage: StateStorage = {
  getItem: (name: string): string | null => {
    const userId = getUserId();
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}${userId}_${name}`);
  },
  setItem: (name: string, value: string): void => {
    const userId = getUserId();
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${userId}_${name}`, value);
  },
  removeItem: (name: string): void => {
    const userId = getUserId();
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${userId}_${name}`);
  },
};

// Helper to create the configuration for persist middleware
export const createIsolatedStorage = () => createJSONStorage(() => userIsolatedStorage);
