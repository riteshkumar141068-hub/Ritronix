import { useState } from 'react';
import {
  Github, Cloud, Boxes, Triangle, Sparkles, Zap, Brain,
  Flower2, Mail, Database, Check, Plus, Search,
  Settings as SettingsIcon,
} from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { mockIntegrations } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const iconMap: Record<string, typeof Github> = {
  Github, Cloud, Boxes, Triangle, Sparkles, Zap, Brain, Flower2, Mail, Database,
};

export function Integrations() {
  const [filter, setFilter] = useState('all');
  const [integrations, setIntegrations] = useState(mockIntegrations);

  const categories = ['all', ...Array.from(new Set(integrations.map((i) => i.category)))];
  const filtered = filter === 'all' ? integrations : integrations.filter((i) => i.category === filter);

  const toggleConnection = (id: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: i.status === 'connected' ? 'disconnected' : 'connected' }
          : i
      )
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Integrations</h1>
            <p className="text-sm text-white/40">Connect AI providers, deployment platforms, and external services</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Connected', value: integrations.filter((i) => i.status === 'connected').length, color: 'text-emerald-400' },
            { label: 'Available', value: integrations.filter((i) => i.status === 'disconnected').length, color: 'text-accent-violet' },
            { label: 'AI Providers', value: integrations.filter((i) => i.category === 'AI Provider').length, color: 'text-cyan-400' },
            { label: 'Deployment', value: integrations.filter((i) => i.category === 'Deployment').length, color: 'text-amber-400' },
          ].map((s) => (
            <Card key={s.label} className="p-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-white/40">{s.label}</div>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  filter === cat ? 'bg-accent-violet/15 text-accent-violet border border-accent-violet/20' : 'text-white/40 hover:text-white/60 hover:bg-white/5 border border-transparent'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
            <input
              placeholder="Search..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-accent-violet/30 w-40"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((integration) => {
            const Icon = iconMap[integration.icon] ?? Sparkles;
            const connected = integration.status === 'connected';
            return (
              <Card key={integration.id} className="p-5 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white/70" />
                  </div>
                  {connected ? (
                    <Badge variant="success"><Check className="w-3 h-3" />Connected</Badge>
                  ) : (
                    <Badge variant="default">Available</Badge>
                  )}
                </div>
                <h3 className="font-semibold text-sm mb-1">{integration.name}</h3>
                <p className="text-xs text-white/40 mb-4 line-clamp-2">{integration.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/30">{integration.category}</span>
                  {connected ? (
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm"><SettingsIcon className="w-3.5 h-3.5" /></Button>
                      <Button variant="outline" size="sm" onClick={() => toggleConnection(integration.id)}>Disconnect</Button>
                    </div>
                  ) : (
                    <Button size="sm" onClick={() => toggleConnection(integration.id)}>
                      <Plus className="w-3.5 h-3.5" />
                      Connect
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Security note */}
        <Card className="p-5 mt-6">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">Secrets are encrypted at rest</h3>
              <p className="text-xs text-white/40">All API keys and credentials are encrypted using AES-256 and never exposed to browser clients. Tokens are stored securely and accessed only server-side.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
