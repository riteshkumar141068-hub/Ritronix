import {
  Sparkles, Code2, Workflow, Bot, Rocket, ArrowRight,
  Activity, Clock, CheckCircle2, AlertCircle, Zap,
} from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { mockProjects, mockAgents, mockDeployments } from '@/lib/mockData';
import { useAuth } from '@/context/AuthContext';
import type { View } from '@/types';

interface DashboardProps {
  onNavigate: (view: View) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();
  const firstName = user?.email?.split('@')[0] ?? 'there';

  const quickActions = [
    { icon: Sparkles, label: 'Build with AI', desc: 'Describe what you want', view: 'ai-studio' as View, color: 'text-accent-violet bg-accent-violet/10' },
    { icon: Code2, label: 'Create Website', desc: 'Start from scratch', view: 'app-builder' as View, color: 'text-cyan-400 bg-cyan-500/10' },
    { icon: Workflow, label: 'Create Workflow', desc: 'Automate a process', view: 'workflow-builder' as View, color: 'text-amber-400 bg-amber-500/10' },
    { icon: Bot, label: 'Create Agent', desc: 'Deploy an AI agent', view: 'agents' as View, color: 'text-emerald-400 bg-emerald-500/10' },
  ];

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-6xl mx-auto p-8">
        {/* Greeting */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold capitalize mb-1">
            Welcome back, {firstName}
          </h1>
          <p className="text-white/40">Here's what's happening in your workspace today.</p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action) => (
            <Card
              key={action.label}
              hover
              onClick={() => onNavigate(action.view)}
              className="p-5 animate-fade-in-up"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${action.color}`}>
                <action.icon className="w-5 h-5" />
              </div>
              <div className="text-sm font-semibold mb-0.5">{action.label}</div>
              <div className="text-xs text-white/40">{action.desc}</div>
            </Card>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'AI Usage', value: '12.4K', unit: 'tokens', icon: Zap, trend: '+18%', color: 'text-accent-violet' },
            { label: 'Active Agents', value: '2', unit: 'running', icon: Bot, trend: 'live', color: 'text-emerald-400' },
            { label: 'Workflow Runs', value: '347', unit: 'this month', icon: Activity, trend: '+24%', color: 'text-cyan-400' },
            { label: 'Deployments', value: '5', unit: 'live', icon: Rocket, trend: 'all healthy', color: 'text-amber-400' },
          ].map((stat) => (
            <Card key={stat.label} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-xs text-white/30">{stat.trend}</span>
              </div>
              <div className="text-2xl font-bold mb-0.5">{stat.value}</div>
              <div className="text-xs text-white/40">{stat.label} · {stat.unit}</div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Recent projects */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Projects</h2>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('projects')}>
                View all <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {mockProjects.slice(0, 4).map((project) => (
                <Card key={project.id} hover onClick={() => onNavigate('app-builder')} className="p-4 flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex-shrink-0 border border-white/10"
                    style={{ background: project.thumbnail }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm truncate">{project.name}</span>
                      <StatusBadge status={project.status} />
                    </div>
                    <div className="text-xs text-white/40 truncate">{project.description}</div>
                    <div className="text-xs text-white/30 mt-1 flex items-center gap-2">
                      <span>{project.framework}</span>
                      <span>·</span>
                      <Clock className="w-3 h-3" />
                      <span>{project.updatedAt}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/30 flex-shrink-0" />
                </Card>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Active agents */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Active Agents</h2>
                <Button variant="ghost" size="sm" onClick={() => onNavigate('agents')}>
                  Manage
                </Button>
              </div>
              <div className="space-y-2.5">
                {mockAgents.filter((a) => a.status === 'running' || a.status === 'completed').slice(0, 3).map((agent) => (
                  <Card key={agent.id} className="p-3.5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-accent-violet" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{agent.name}</div>
                      <div className="text-xs text-white/40">{agent.lastRun}</div>
                    </div>
                    {agent.status === 'running' ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Running
                      </div>
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-white/30" />
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* System status */}
            <div>
              <h2 className="text-lg font-semibold mb-4">System Status</h2>
              <Card className="p-4 space-y-3">
                {[
                  { label: 'API Gateway', status: 'operational' },
                  { label: 'AI Providers', status: 'operational' },
                  { label: 'Build System', status: 'operational' },
                  { label: 'Deployment Engine', status: 'operational' },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between text-sm">
                    <span className="text-white/60">{s.label}</span>
                    <div className="flex items-center gap-2 text-emerald-400 text-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Operational
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </div>

        {/* Recent deployments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Deployments</h2>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('deployments')}>
              View all <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <Card className="overflow-hidden">
            <div className="divide-y divide-white/5">
              {mockDeployments.slice(0, 4).map((dep) => (
                <div key={dep.id} className="flex items-center gap-4 p-4 hover:bg-white/3 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-4 h-4 text-white/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{dep.projectName}</div>
                    <div className="text-xs text-white/40 font-mono">{dep.url}</div>
                  </div>
                  <div className="hidden md:flex items-center gap-3 text-xs text-white/40">
                    <span className="capitalize">{dep.provider}</span>
                    <span>·</span>
                    <span>{dep.duration}</span>
                    <span>·</span>
                    <span>{dep.createdAt}</span>
                  </div>
                  <DeployStatusBadge status={dep.status} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
    deployed: 'success',
    building: 'warning',
    draft: 'default',
    failed: 'error',
  };
  return <Badge variant={map[status] ?? 'default'} className="capitalize">{status}</Badge>;
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
