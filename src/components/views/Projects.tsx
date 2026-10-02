import { useState } from 'react';
import {
  Plus, Search, LayoutGrid, List, Clock, Code2, Globe,
  Workflow as WorkflowIcon, ArrowRight,
} from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { mockProjects } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import type { View } from '@/types';

interface ProjectsProps {
  onNavigate: (view: View) => void;
}

export function Projects({ onNavigate }: ProjectsProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filters = ['all', 'website', 'web-app', 'workflow', 'draft', 'deployed'];
  const filtered = mockProjects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.framework.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'all') return true;
    if (['website', 'web-app', 'workflow'].includes(filter)) return p.type === filter;
    return p.status === filter;
  });

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Projects</h1>
            <p className="text-sm text-white/40">Manage and deploy your projects</p>
          </div>
          <Button onClick={() => onNavigate('ai-studio')}>
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all',
                  filter === f ? 'bg-accent-violet/15 text-accent-violet border border-accent-violet/20' : 'text-white/40 hover:text-white/60 hover:bg-white/5 border border-transparent'
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
              <input
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-accent-violet/30 w-44"
              />
            </div>
            <div className="flex bg-white/5 rounded-lg p-0.5">
              <button onClick={() => setView('grid')} className={cn('p-1.5 rounded', view === 'grid' ? 'bg-white/10 text-white' : 'text-white/40')}>
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setView('list')} className={cn('p-1.5 rounded', view === 'list' ? 'bg-white/10 text-white' : 'text-white/40')}>
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {view === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((project) => (
              <Card key={project.id} hover onClick={() => onNavigate('app-builder')} className="overflow-hidden group">
                <div className="h-32 relative" style={{ background: project.thumbnail }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-elevated to-transparent" />
                  <div className="absolute top-3 right-3">
                    <ProjectTypeIcon type={project.type} />
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <StatusBadge status={project.status} />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-accent-violet transition-colors">{project.name}</h3>
                  <p className="text-xs text-white/40 mb-3 line-clamp-2">{project.description}</p>
                  <div className="flex items-center justify-between text-xs text-white/30">
                    <span className="font-mono">{project.framework}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{project.updatedAt}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden">
            <div className="divide-y divide-white/5">
              {filtered.map((project) => (
                <div
                  key={project.id}
                  onClick={() => onNavigate('app-builder')}
                  className="flex items-center gap-4 p-4 hover:bg-white/3 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl flex-shrink-0 border border-white/10" style={{ background: project.thumbnail }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm">{project.name}</span>
                      <StatusBadge status={project.status} />
                    </div>
                    <div className="text-xs text-white/40 truncate">{project.description}</div>
                  </div>
                  <div className="hidden md:flex items-center gap-4 text-xs text-white/30">
                    <span className="font-mono">{project.framework}</span>
                    <span>{project.updatedAt}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/20" />
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
    deployed: 'success', building: 'warning', draft: 'default', failed: 'error',
  };
  return <Badge variant={map[status] ?? 'default'} className="capitalize">{status}</Badge>;
}

function ProjectTypeIcon({ type }: { type: string }) {
  const icons: Record<string, typeof Code2> = { website: Globe, 'web-app': Code2, workflow: WorkflowIcon, api: Code2 };
  const Icon = icons[type] ?? Code2;
  return (
    <div className="w-8 h-8 rounded-lg bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <Icon className="w-4 h-4 text-white" />
    </div>
  );
}
