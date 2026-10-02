import {
  Rocket, ExternalLink, Clock, GitBranch, RotateCcw,
  CheckCircle2, AlertCircle, Activity, Loader2,
} from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { mockDeployments } from '@/lib/mockData';

export function Deployments() {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Deployments</h1>
            <p className="text-sm text-white/40">Manage and monitor your deployments</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Live', value: '3', icon: CheckCircle2, color: 'text-emerald-400' },
            { label: 'Building', value: '1', icon: Activity, color: 'text-amber-400' },
            { label: 'Failed', value: '1', icon: AlertCircle, color: 'text-rose-400' },
            { label: 'Total', value: '5', icon: Rocket, color: 'text-accent-violet' },
          ].map((s) => (
            <Card key={s.label} className="p-4">
              <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-white/40">{s.label}</div>
            </Card>
          ))}
        </div>

        <Card className="overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5">
            <h2 className="text-sm font-semibold">All Deployments</h2>
          </div>
          <div className="divide-y divide-white/5">
            {mockDeployments.map((dep) => (
              <div key={dep.id} className="p-4 hover:bg-white/3 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    <ProviderIcon provider={dep.provider} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm">{dep.projectName}</span>
                      <DeployStatusBadge status={dep.status} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/40">
                      {dep.url !== '—' && (
                        <a href={`https://${dep.url}`} className="flex items-center gap-1 hover:text-accent-violet transition-colors font-mono">
                          {dep.url} <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" />{dep.commit}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{dep.duration}</span>
                      <span>{dep.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/30 capitalize">{dep.provider}</span>
                    {dep.status === 'live' && (
                      <Button variant="ghost" size="sm"><RotateCcw className="w-3.5 h-3.5" />Rollback</Button>
                    )}
                  </div>
                </div>
                {dep.status === 'building' && (
                  <div className="mt-3 ml-14">
                    <div className="flex items-center gap-2 text-xs text-amber-400 mb-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Building... Validating dependencies
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-3/5 gradient-violet animate-pulse" />
                    </div>
                  </div>
                )}
                {dep.status === 'failed' && (
                  <div className="mt-3 ml-14 flex items-center gap-2 text-xs text-rose-400">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Build failed: Module not found — check import paths
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function DeployStatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: 'success' | 'warning' | 'error' | 'info'; icon: typeof CheckCircle2 }> = {
    live: { variant: 'success', icon: CheckCircle2 },
    building: { variant: 'warning', icon: Activity },
    failed: { variant: 'error', icon: AlertCircle },
    queued: { variant: 'info', icon: Clock },
  };
  const config = map[status] ?? map.queued;
  return (
    <Badge variant={config.variant} className="capitalize">
      <config.icon className="w-3 h-3" />
      {status}
    </Badge>
  );
}

function ProviderIcon({ provider }: { provider: string }) {
  const icons: Record<string, string> = {
    vercel: '▲',
    cloudflare: '☁',
    netlify: '◇',
    'github-pages': '◇',
  };
  return <span className="text-sm font-bold text-white/50">{icons[provider] ?? '◆'}</span>;
}
