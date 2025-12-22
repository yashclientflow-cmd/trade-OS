import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTradesStore } from '../store/useTradesStore';
import { usePlaybookStore } from '../store/usePlaybookStore';
import { calculateRMultiple } from '../utils/calculations';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { ArrowLeft } from 'lucide-react';
import { cn, formatNumber } from '../lib/utils';
import { Trade } from '../types';

type TradeFormData = Omit<Trade, 'id' | 'created_at' | 'updated_at' | 'week_number' | 'result_r' | 'outcome' | 'mistake_type'>;

const AddTrade = () => {
  const navigate = useNavigate();
  const addTrade = useTradesStore((state) => state.addTrade);
  const setups = usePlaybookStore((state) => state.setups);

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<TradeFormData>({
    defaultValues: {
      date: new Date().toISOString().slice(0, 16),
      pair: '',
      timeframe: '1H',
      direction: 'Buy',
      entry_price: 0,
      stop_loss: 0,
      take_profit: 0,
      risk_usd: 100,
      reward_usd: 0,
      r_multiple: 0,
      rule_followed: true,
      reason: '',
      invalidation: '',
      emotion: 5,
      notes: '',
      setup_id: null,
    }
  });

  // Watch fields for live calculation
  const direction = watch('direction');
  const entry = parseFloat(watch('entry_price') as any);
  const sl = parseFloat(watch('stop_loss') as any);
  const tp = parseFloat(watch('take_profit') as any);
  const risk = parseFloat(watch('risk_usd') as any);

  useEffect(() => {
    if (entry && sl && tp) {
      const r = calculateRMultiple(direction, entry, sl, tp);
      setValue('r_multiple', parseFloat(r.toFixed(2)));
      
      if (risk) {
        setValue('reward_usd', parseFloat((r * risk).toFixed(2)));
      }
    }
  }, [direction, entry, sl, tp, risk, setValue]);

  const rMultiple = watch('r_multiple');
  const rewardUsd = watch('reward_usd');

  const onSubmit = (data: TradeFormData) => {
    addTrade({
      ...data,
      outcome: 'open',
      result_r: null,
      mistake_type: null,
      // Ensure numbers are numbers
      entry_price: Number(data.entry_price),
      stop_loss: Number(data.stop_loss),
      take_profit: Number(data.take_profit),
      risk_usd: Number(data.risk_usd),
      reward_usd: Number(data.reward_usd),
      r_multiple: Number(data.r_multiple),
      emotion: Number(data.emotion),
    });
    navigate('/trades');
  };

  return (
    <div className="pb-20">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-slate-900">Add New Trade</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Core Info */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500">Pair</label>
                <Input {...register('pair', { required: true })} placeholder="EURUSD" className="uppercase" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500">Timeframe</label>
                <select 
                  {...register('timeframe')}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950"
                >
                  {['1M', '5M', '15M', '1H', '4H', '1D'].map(tf => (
                    <option key={tf} value={tf}>{tf}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500">Direction</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setValue('direction', 'Buy')}
                  className={cn(
                    "h-10 rounded-md text-sm font-medium transition-colors border",
                    direction === 'Buy' 
                      ? "bg-emerald-500 text-white border-transparent" 
                      : "bg-white text-slate-900 border-slate-200 hover:bg-slate-50"
                  )}
                >
                  Buy / Long
                </button>
                <button
                  type="button"
                  onClick={() => setValue('direction', 'Sell')}
                  className={cn(
                    "h-10 rounded-md text-sm font-medium transition-colors border",
                    direction === 'Sell' 
                      ? "bg-rose-500 text-white border-transparent" 
                      : "bg-white text-slate-900 border-slate-200 hover:bg-slate-50"
                  )}
                >
                  Sell / Short
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prices & Risk */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500">Entry</label>
                <Input type="number" step="any" {...register('entry_price', { required: true })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500">Stop Loss</label>
                <Input type="number" step="any" {...register('stop_loss', { required: true })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500">Take Profit</label>
                <Input type="number" step="any" {...register('take_profit', { required: true })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500">Risk ($)</label>
                <Input type="number" step="any" {...register('risk_usd', { required: true, min: 0 })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500">Setup</label>
                <select 
                  {...register('setup_id')}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950"
                >
                  <option value="">Select Setup</option>
                  {setups.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Stats */}
            <div className="bg-slate-50 rounded-lg p-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">R Multiple</p>
                <p className={cn("text-lg font-bold", rMultiple >= 2 ? "text-emerald-600" : "text-slate-700")}>
                  {formatNumber(rMultiple || 0)}R
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Reward</p>
                <p className="text-lg font-bold text-slate-700">${formatNumber(rewardUsd || 0)}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Ratio</p>
                <p className="text-lg font-bold text-slate-700">1:{formatNumber(rMultiple || 0, 1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Psychology & Rules */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500">Why this trade?</label>
              <textarea 
                {...register('reason', { required: true, maxLength: 200 })}
                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950"
                placeholder="Technical confluence, market structure..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500">Invalidation Point</label>
              <Input {...register('invalidation')} placeholder="Price closes below..." />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs font-medium text-slate-500">Emotion (1-10)</label>
                <span className="text-xs font-bold">{watch('emotion')}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                step="1"
                {...register('emotion')}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="text-sm font-medium text-slate-900">Followed Rules?</label>
              <Controller
                name="rule_followed"
                control={control}
                render={({ field }) => (
                  <button
                    type="button"
                    onClick={() => field.onChange(!field.value)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      field.value ? "bg-emerald-500" : "bg-slate-200"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        field.value ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full h-12 text-lg bg-emerald-500 hover:bg-emerald-600">
          Log Trade
        </Button>
      </form>
    </div>
  );
};

export default AddTrade;
