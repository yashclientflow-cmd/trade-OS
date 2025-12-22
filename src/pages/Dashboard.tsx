import React from 'react';
import { ThemeToggle } from '../components/ThemeToggle';
import { ExpertEquityCurve } from '../components/charts/ExpertEquityCurve';
import { StatCard } from '../components/StatCard';
import { useTradesStore } from '../store/useTradesStore';
import { TrendingUp, Target, Zap, BarChart3, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn, formatNumber } from '../lib/utils';
import { Badge } from '../components/ui/Badge';

export default function Dashboard() {
  const { trades } = useTradesStore();

  // Calculate stats
  const closedTrades = trades.filter(t => t.outcome !== 'open');
  const winningTrades = closedTrades.filter(t => t.outcome === 'win');
  const losingTrades = closedTrades.filter(t => t.outcome === 'loss');
  
  const winRate = closedTrades.length > 0 
    ? (winningTrades.length / closedTrades.length) * 100 
    : 0;
    
  const avgR = closedTrades.length > 0
    ? closedTrades.reduce((sum, t) => sum + (t.result_r || 0), 0) / closedTrades.length
    : 0;
    
  const expectancy = closedTrades.length > 0
    ? (winningTrades.reduce((sum, t) => sum + (t.result_r || 0), 0) / winningTrades.length) * (winningTrades.length / closedTrades.length) -
      (losingTrades.reduce((sum, t) => sum + Math.abs(t.result_r || 0), 0) / losingTrades.length) * (losingTrades.length / closedTrades.length)
    : 0;

  return (
    <div className="min-h-screen pb-20 bg-background text-text-primary transition-colors duration-300">
      {/* Header with Theme Toggle */}
      <div className="sticky top-0 z-30 backdrop-blur-lg bg-surface/80 border-b border-border">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/70 
                            flex items-center justify-center shadow-lg text-text-inverse">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  ReasonTrack
                </h1>
                <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                  TraderOS v1.0
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            title="Total Trades"
            value={trades.length.toString()}
            icon={<BarChart3 className="w-4 h-4" />}
            color="blue"
          />
          
          <StatCard
            title="Win Rate"
            value={`${winRate.toFixed(1)}%`}
            change={winRate > 50 ? "Good" : "Low"}
            icon={<Target className="w-4 h-4" />}
            color={winRate >= 50 ? "green" : "red"}
          />
          
          <StatCard
            title="Avg R"
            value={`${avgR.toFixed(2)}R`}
            change={avgR > 0 ? "+" : ""}
            icon={<TrendingUp className="w-4 h-4" />}
            color={avgR > 0 ? "green" : avgR < 0 ? "red" : "gray"}
          />
          
          <StatCard
            title="Expectancy"
            value={`${expectancy.toFixed(2)}R`}
            change={expectancy > 0 ? "Positive" : "Negative"}
            icon={<Zap className="w-4 h-4" />}
            color={expectancy > 0 ? "green" : expectancy < 0 ? "red" : "gray"}
          />
        </div>

        {/* Expert Equity Curve */}
        <div className="bg-surface border border-border rounded-2xl p-4 shadow-lg">
          <ExpertEquityCurve />
        </div>

        {/* Recent Trades */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Recent Trades</h2>
              <p className="text-xs text-text-secondary">Last 5 trading activities</p>
            </div>
            <Link to="/trades" className="flex items-center text-sm font-medium text-accent hover:text-accent/80 transition-colors">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="space-y-3">
            {trades.slice(0, 5).map((trade) => (
              <div
                key={trade.id}
                className="group flex items-center justify-between p-4 rounded-xl
                         bg-surface hover:bg-surface/80 transition-all duration-200
                         border border-border shadow-sm hover:shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-colors",
                    trade.outcome === 'win' ? 'bg-trading-profit/10 text-trading-profit' : 
                    trade.outcome === 'loss' ? 'bg-trading-loss/10 text-trading-loss' : 
                    'bg-trading-open/10 text-trading-open'
                  )}>
                    {trade.pair.substring(0, 3)}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text-primary">
                        {trade.pair}
                      </span>
                      <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                        trade.direction === 'Buy' 
                          ? 'bg-trading-profit/10 text-trading-profit' 
                          : 'bg-trading-loss/10 text-trading-loss'
                      )}>
                        {trade.direction}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-secondary mt-1">
                      <span>{trade.timeframe}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span>{new Date(trade.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                   {trade.outcome === 'open' ? (
                    <Badge variant="open">OPEN</Badge>
                  ) : (
                    <span className={cn(
                      "font-bold text-sm block",
                      trade.result_r && trade.result_r > 0 ? "text-trading-profit" : 
                      trade.result_r && trade.result_r < 0 ? "text-trading-loss" : "text-text-muted"
                    )}>
                      {trade.result_r ? `${trade.result_r > 0 ? '+' : ''}${formatNumber(trade.result_r)}R` : '0R'}
                    </span>
                  )}
                  <span className="text-[10px] text-text-muted uppercase font-medium">{trade.outcome}</span>
                </div>
              </div>
            ))}
            {trades.length === 0 && (
              <div className="text-center py-8 text-text-muted text-sm bg-surface border border-dashed border-border rounded-xl">
                No trades yet. Add your first trade!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
