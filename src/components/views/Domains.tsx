import { useState } from 'react';
import {
  Globe, Plus, Check, Clock, AlertCircle, ExternalLink,
  Shield, Server, Copy,
} from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';

interface DomainEntry {
  id: string;
  domain: string;
  project: string;
  verificationStatus: 'verified' | 'pending' | 'failed';
  sslStatus: 'active' | 'pending' | 'failed';
  cname: string;
  createdAt: string;
}

const initialDomains: DomainEntry[] = [
  { id: '1', domain: 'aurora-restaurant.com', project: 'Aurora Restaurant', verificationStatus: 'verified', sslStatus: 'active', cname: 'cname.vercel-dns.com', createdAt: '2 hours ago' },
  { id: '2', domain: 'shopwave.store', project: 'ShopWave Store', verificationStatus: 'verified', sslStatus: 'active', cname: 'cname.vercel-dns.com', createdAt: '3 days ago' },
  { id: '3', domain: 'nexus-saas.io', project: 'Nexus SaaS Landing', verificationStatus: 'pending', sslStatus: 'pending', cname: 'cname.vercel-dns.com', createdAt: '5 hours ago' },
  { id: '4', domain: 'flowdash.app', project: 'FlowDash Analytics', verificationStatus: 'failed', sslStatus: 'failed', cname: 'cname.vercel-dns.com', createdAt: '1 day ago' },
];

export function Domains() {
  const [domains] = useState(initialDomains);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Domains</h1>
            <p className="text-sm text-white/40">Manage custom domains, DNS verification, and SSL</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}><Plus className="w-4 h-4" />Add Domain</Button>
        </div>

        {showAdd && (
          <Card className="p-5 mb-6 animate-fade-in-up">
            <h3 className="text-sm font-semibold mb-4">Add Custom Domain</h3>
            <div className="flex gap-3">
              <input
                placeholder="mydomain.com"
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-accent-violet/40"
              />
              <Button>Add</Button>
            </div>
            <p className="text-xs text-white/30 mt-3">Add a CNAME record pointing to your deployment provider. We do not become a registrar — use your existing DNS provider.</p>
          </Card>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Verified', value: '2', icon: Check, color: 'text-emerald-400' },
            { label: 'Pending', value: '1', icon: Clock, color: 'text-amber-400' },
            { label: 'Failed', value: '1', icon: AlertCircle, color: 'text-rose-400' },
            { label: 'SSL Active', value: '2', icon: Shield, color: 'text-cyan-400' },
          ].map((s) => (
            <Card key={s.label} className="p-4">
              <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-white/40">{s.label}</div>
            </Card>
          ))}
        </div>

        <Card className="overflow-hidden">
          <div className="divide-y divide-white/5">
            {domains.map((d) => (
              <div key={d.id} className="p-4 hover:bg-white/3 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-white/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{d.domain}</span>
                      <VerifyBadge status={d.verificationStatus} />
                      <SslBadge status={d.sslStatus} />
                    </div>
                    <div className="text-xs text-white/40">{d.project} · Added {d.createdAt}</div>
                  </div>
                  <div className="hidden md:flex items-center gap-2 text-xs text-white/30">
                    <Server className="w-3.5 h-3.5" />
                    <code className="font-mono">{d.cname}</code>
                    <button className="p-1 hover:text-white/60"><Copy className="w-3 h-3" /></button>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </div>
                {d.verificationStatus === 'pending' && (
                  <div className="mt-3 ml-14 p-3 rounded-lg bg-amber-500/10 border border-amber-500/15 text-xs text-amber-300">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-medium">DNS propagation in progress</span>
                    </div>
                    <div className="text-amber-300/70">Add a CNAME record: <code className="font-mono">{d.domain}</code> → <code className="font-mono">{d.cname}</code></div>
                  </div>
                )}
                {d.verificationStatus === 'failed' && (
                  <div className="mt-3 ml-14 p-3 rounded-lg bg-rose-500/10 border border-rose-500/15 text-xs text-rose-300">
                    <div className="flex items-center gap-2 mb-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span className="font-medium">Verification failed</span>
                    </div>
                    <div className="text-rose-300/70">CNAME record not found. Check your DNS configuration and retry verification.</div>
                    <Button variant="outline" size="sm" className="mt-2">Retry Verification</Button>
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

function VerifyBadge({ status }: { status: string }) {
  const map: Record<string, 'success' | 'warning' | 'error'> = { verified: 'success', pending: 'warning', failed: 'error' };
  return <Badge variant={map[status]} className="capitalize">{status}</Badge>;
}

function SslBadge({ status }: { status: string }) {
  if (status === 'active') return <Badge variant="info"><Shield className="w-3 h-3" />SSL</Badge>;
  if (status === 'pending') return <Badge variant="warning"><Clock className="w-3 h-3" />SSL</Badge>;
  return <Badge variant="error"><AlertCircle className="w-3 h-3" />SSL</Badge>;
}
