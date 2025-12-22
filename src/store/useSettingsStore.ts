import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createIsolatedStorage } from '../lib/storage';

interface UserProfile {
  displayName: string;
  tradingStyle: 'Scalper' | 'Day Trader' | 'Swing Trader' | 'Position Trader';
  riskTolerance: 'Conservative' | 'Moderate' | 'Aggressive';
  accountSize: number;
  currency: string;
}

interface AutomationSettings {
  autoRR: boolean;
  autoRRRatio: number;
  emotionalTracking: boolean;
  patternDetection: boolean;
  showRiskWarning: boolean;
}

interface DisplaySettings {
  chartDensity: 'Compact' | 'Normal' | 'Detailed';
  showEquityCurve: boolean;
  animations: boolean;
}

interface SettingsStore {
  profile: UserProfile;
  automation: AutomationSettings;
  display: DisplaySettings;
  
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateAutomation: (updates: Partial<AutomationSettings>) => void;
  updateDisplay: (updates: Partial<DisplaySettings>) => void;
  resetSettings: () => void;
}

const defaultSettings = {
  profile: {
    displayName: 'Trader',
    tradingStyle: 'Day Trader' as const,
    riskTolerance: 'Moderate' as const,
    accountSize: 10000,
    currency: 'USD',
  },
  automation: {
    autoRR: true,
    autoRRRatio: 2.0,
    emotionalTracking: true,
    patternDetection: false,
    showRiskWarning: true,
  },
  display: {
    chartDensity: 'Normal' as const,
    showEquityCurve: true,
    animations: true,
  },
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,
      
      updateProfile: (updates) => 
        set((state) => ({ profile: { ...state.profile, ...updates } })),
        
      updateAutomation: (updates) => 
        set((state) => ({ automation: { ...state.automation, ...updates } })),
        
      updateDisplay: (updates) => 
        set((state) => ({ display: { ...state.display, ...updates } })),
        
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'settings_v1',
      storage: createIsolatedStorage(),
    }
  )
);
