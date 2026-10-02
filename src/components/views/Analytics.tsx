import {
  TrendingUp, Users, Eye, MousePointerClick, Globe,
  Smartphone, Monitor, Chrome, Globe as GlobeIcon,
  ArrowUp, ArrowDown, Activity, Clock, CheckCircle2,
} from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { mockProjects } from '@/lib/mockData';

export function Analytics() {
  const stats = [
    { label: 'Page Views', value: '24,891', change: '+12.3%', up: true, icon: Eye },
    { label: 'Unique Visitors', value: '8,342', change: '+8.7%', up: true, icon: Users },
    { label: 'Avg. Session', value: '3m 42s', change: '+15s', up: true, icon: Clock },
    { label: 'Bounce Rate', value: '38.2%', change: '-2.1%', up: false, icon: MousePointerClick },
  ];

  const topProjects = mockProjects.filter((p) => p.status === 'deployed').map((p, i) => ({
    ...p,
    views: [12400, 8200, 4100][i] ?? 1000,
    visitors: [4200, 2800, 1500][i] ?? 400,
  }));

  const trafficSources = [
    { source: 'Direct', percentage: 42, color: 'bg-accent-violet' },
    { source: 'Google Search', percentage: 28, color: 'bg-accent-cyan' },
    { source: 'Social Media', percentage: 18, color: 'bg-emerald-400' },
    { source: 'Referral', percentage: 12, color: 'bg-amber-400' },
  ];

  const devices = [
    { type: 'Desktop', percentage: 58, icon: Monitor },
    { type: 'Mobile', percentage: 35, icon: Smartphone },
    { type: 'Tablet', percentage: 7, icon: Monitor },
  ];

  const browsers = [
    { name: 'Chrome', percentage: 62, icon: Chrome },
    { name: 'Safari', percentage: 22, icon: GlobeIcon },
    { name: 'Firefox', percentage: 9, icon: GlobeIcon },
    { name: 'Edge', percentage: 7, icon: Globe },
  ];

  const chartBars = [40, 55, 42, 68, 72, 85, 79, 92, 88, 96, 82, 74, 68, 71, 88, 94, 87, 76, 82, 90, 85, 79, 72, 68];

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Analytics</h1>
            <p className="text-sm text-white/40">Traffic, visitors, and deployment health across your projects</p>
          </div>
          <Badge variant="success"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />All systems operational</Badge>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <Card key={s.label} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <s.icon className="w-5 h-5 text-accent-violet" />
                <span className={`text-xs flex items-center gap-0.5 ${s.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {s.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {s.change}
                </span>
              </div>
              <div className="text-2xl font-bold mb-0.5">{s.value}</div>
              <div className="text-xs text-white/40">{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Traffic chart */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold">Page Views (24h)</h2>
              <p className="text-xs text-white/40 mt-0.5">Hourly traffic across all deployed projects</p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-end justify-between gap-1 h-40">
            {chartBars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t gradient-violet opacity-70 hover:opacity-100 transition-opacity"
                style={{ height: `${h}%` }}
                title={`${i}:00 — ${h * 12} views`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-white/30">
            <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Traffic sources */}
          <Card className="p-5">
            <h2 className="text-sm font-semibold mb-4">Traffic Sources</h2>
            <div className="space-y-4">
              {trafficSources.map((src) => (
                <div key={src.source}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-white/60">{src.source}</span>
                    <span className="text-white/40">{src.percentage}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${src.color}`} style={{ width: `${src.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Devices */}
          <Card className="p-5">
            <h2 className="text-sm font-semibold mb-4">Devices</h2>
            <div className="space-y-3">
              {devices.map((d) => (
                <div key={d.type} className="flex items-center gap-3">
                  <d.icon className="w-4 h-4 text-white/40" />
                  <span className="text-sm text-white/60 flex-1">{d.type}</span>
                  <span className="text-sm font-medium">{d.percentage}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Browsers */}
          <Card className="p-5">
            <h2 className="text-sm font-semibold mb-4">Browsers</h2>
            <div className="space-y-3">
              {browsers.map((b) => (
                <div key={b.name} className="flex items-center gap-3">
                  <b.icon className="w-4 h-4 text-white/40" />
                  <span className="text-sm text-white/60 flex-1">{b.name}</span>
                  <span className="text-sm font-medium">{b.percentage}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Top projects */}
        <Card className="overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-white/5">
            <h2 className="text-sm font-semibold">Top Projects by Traffic</h2>
          </div>
          <div className="divide-y divide-white/5">
            {topProjects.map((p, i) => (
              <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-white/3 transition-colors">
                <span className="text-xs text-white/30 font-mono w-5">#{i + 1}</span>
                <div className="w-10 h-10 rounded-lg flex-shrink-0 border border-white/10" style={{ background: p.thumbnail }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-white/40 font-mono">{p.url}</div>
                </div>
                <div className="hidden md:flex items-center gap-6 text-xs">
                  <div className="text-center">
                    <div className="text-white/60 font-medium">{p.views.toLocaleString()}</div>
                    <div className="text-white/30">views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white/60 font-medium">{p.visitors.toLocaleString()}</div>
                    <div className="text-white/30">visitors</div>
                  </div>
                </div>
                <Badge variant="success"><CheckCircle2 className="w-3 h-3" />Live</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Deployment health */}
        <Card className="p-5">
          <h2 className="text-sm font-semibold mb-4">Deployment Health</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Avg. Build Time', value: '42s', icon: Clock },
              { label: 'Success Rate', value: '94%', icon: CheckCircle2 },
              { label: 'Uptime', value: '99.9%', icon: Activity },
              { label: 'Active Deploys', value: '3', icon: TrendingUp },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <s.icon className="w-5 h-5 text-accent-violet mx-auto mb-2" />
                <div className="text-xl font-bold">{s.value}</div>
                <div className="text-xs text-white/40">{s.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
