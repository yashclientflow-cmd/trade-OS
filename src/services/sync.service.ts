import { supabase } from '../lib/supabase';
import { useTradesStore } from '../store/useTradesStore';
import { usePlaybookStore } from '../store/usePlaybookStore';
import { Trade, PlaybookSetup } from '../types';

export class SyncService {
  private static instance: SyncService;
  private isSyncing = false;

  private constructor() {}

  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  // Initial Migration: Local -> Cloud
  async migrateLocalData(userId: string) {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      // 0. Ensure Profile Exists (Required for Foreign Key constraints)
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && user.email) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert(
            { 
              id: userId, 
              email: user.email,
              updated_at: new Date().toISOString()
            },
            { onConflict: 'id' }
          );

        if (profileError) throw profileError;
      }

      const trades = useTradesStore.getState().trades;
      const setups = usePlaybookStore.getState().setups;

      console.log(`Starting migration for ${trades.length} trades...`);

      // 1. Migrate Trades
      if (trades.length > 0) {
        const { error: tradeError } = await supabase
          .from('trades')
          .upsert(
            trades.map(t => ({
              user_id: userId,
              local_id: t.id,
              pair: t.pair,
              timeframe: t.timeframe,
              direction: t.direction,
              entry_price: t.entry_price,
              stop_loss: t.stop_loss,
              take_profit: t.take_profit,
              risk_usd: t.risk_usd,
              reward_usd: t.reward_usd,
              result_r: t.result_r,
              outcome: t.outcome,
              emotion: t.emotion,
              rule_followed: t.rule_followed,
              reason: t.reason,
              notes: t.notes,
              trade_date: t.date,
              sync_status: 'synced'
            })),
            { onConflict: 'local_id' }
          );

        if (tradeError) throw tradeError;
      }

      // 2. Migrate Setups
      if (setups.length > 0) {
        const { error: setupError } = await supabase
          .from('setups')
          .upsert(
            setups.map(s => ({
              user_id: userId,
              local_id: s.id,
              name: s.name,
              trigger_condition: s.trigger_condition || 'N/A',
              entry_logic: s.entry_logic || 'N/A',
              target_logic: s.target_logic || 'N/A',
              risk_rule: s.risk_rule || 'N/A',
              times_used: s.times_used,
              success_rate: s.success_rate,
              sync_status: 'synced'
            })),
            { onConflict: 'local_id' }
          );

        if (setupError) throw setupError;
      }

      console.log('Migration completed successfully');
      return { success: true };

    } catch (error) {
      console.error('Migration failed:', error);
      return { success: false, error };
    } finally {
      this.isSyncing = false;
    }
  }

  // Realtime Sync Listener
  setupRealtimeSubscription(userId: string) {
    return supabase
      .channel('public:trades')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'trades', filter: `user_id=eq.${userId}` },
        (payload) => {
          console.log('Realtime update received:', payload);
          // Here we would update the local Zustand store
          // useTradesStore.getState().syncRemoteTrade(payload.new);
        }
      )
      .subscribe();
  }
}

export const syncService = SyncService.getInstance();
