import {
  LayoutDashboard, FolderKanban, Sparkles, Code2, Workflow,
  Bot, Rocket, Globe, BarChart3, LayoutTemplate, Plug, Settings,
  ChevronDown, LogOut, Plus, X,
} from 'lucide-react';
import { Logo, Badge } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import type { View } from '@/types';

interface SidebarProps {
  current: View;
  onNavigate: (view: View) => void;
  onSignOut: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems: Array<{ view: View; label: string; icon: typeof LayoutDashboard }> = [
  { view: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { view: 'projects', label: 'Projects', icon: FolderKanban },
  { view: 'ai-studio', label: 'AI Studio', icon: Sparkles },
  { view: 'app-builder', label: 'App Builder', icon: Code2 },
  { view: 'workflow-builder', label: 'Workflow Builder', icon: Workflow },
  { view: 'agents', label: 'Agents', icon: Bot },
  { view: 'deployments', label: 'Deployments', icon: Rocket },
  { view: 'domains', label: 'Domains', icon: Globe },
  { view: 'analytics', label: 'Analytics', icon: BarChart3 },
  { view: 'templates', label: 'Templates', icon: LayoutTemplate },
  { view: 'integrations', label: 'Integrations', icon: Plug },
  { view: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ current, onNavigate, onSignOut, isOpen = false, onClose }: SidebarProps) {
  const { user, isDemo } = useAuth();

  const handleNav = (v: View) => {
    onNavigate(v);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 h-full flex flex-col border-r border-white/5 bg-bg-secondary flex-shrink-0 transition-transform duration-300 md:static md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Workspace switcher */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <Logo size="sm" />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 md:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <button className="w-full mt-4 flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/8 border border-white/10 transition-colors group">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg gradient-violet flex items-center justify-center text-xs font-bold text-white">
                {user?.email?.[0]?.toUpperCase() ?? 'W'}
              </div>
              <div className="text-left">
                <div className="text-sm font-medium">My Workspace</div>
                <div className="text-xs text-white/40">
                  {isDemo ? 'Demo Mode' : 'Free Plan'}
                </div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-white/40 group-hover:text-white/60" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin p-3">
          <div className="text-xs text-white/30 font-medium uppercase tracking-wider px-3 py-2 mb-1">
            Workspace
          </div>
          {navItems.map((item) => {
            const active = current === item.view;
            return (
              <button
                key={item.view}
                onClick={() => handleNav(item.view)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 mb-0.5',
                  active
                    ? 'bg-accent-violet/15 text-white border border-accent-violet/20'
                    : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                )}
              >
                <item.icon className={cn('w-4 h-4', active && 'text-accent-violet')} />
                {item.label}
                {item.view === 'agents' && (
                  <Badge variant="success" className="ml-auto text-[10px] px-1.5 py-0">2</Badge>
                )}
                {item.view === 'deployments' && (
                  <Badge variant="violet" className="ml-auto text-[10px] px-1.5 py-0">1</Badge>
                )}
              </button>
            );
          })}
        </nav>

        {/* Upgrade card */}
        <div className="p-3">
          <div className="glass-panel rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-accent-violet/20 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="text-sm font-semibold mb-1">Upgrade to Pro</div>
              <div className="text-xs text-white/40 mb-3">Unlimited projects & AI agents</div>
              <button className="w-full px-3 py-2 rounded-lg gradient-violet text-white text-xs font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                Upgrade
              </button>
            </div>
          </div>
        </div>

        {/* User */}
        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full gradient-violet flex items-center justify-center text-sm font-bold text-white">
              {user?.email?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user?.email ?? 'User'}</div>
              <div className="text-xs text-white/40">Free Plan</div>
            </div>
            <button
              onClick={onSignOut}
              className="p-2 rounded-lg text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
