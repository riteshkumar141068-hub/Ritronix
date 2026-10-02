import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AuthPage } from '@/components/AuthPage';
import { LandingPage } from '@/components/LandingPage';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/views/Dashboard';
import { Projects } from '@/components/views/Projects';
import { AIStudio } from '@/components/views/AIStudio';
import { ProjectWorkspace } from '@/components/views/ProjectWorkspace';
import { WorkflowBuilder } from '@/components/views/WorkflowBuilder';
import { Agents } from '@/components/views/Agents';
import { Deployments } from '@/components/views/Deployments';
import { Templates } from '@/components/views/Templates';
import { Domains } from '@/components/views/Domains';
import { Analytics } from '@/components/views/Analytics';
import { Integrations } from '@/components/views/Integrations';
import { Settings } from '@/components/views/Settings';
import { Menu } from 'lucide-react';
import { Spinner, Logo } from '@/components/ui';
import type { View } from '@/types';

function AppContent() {
  const { session, user, loading, signOut } = useAuth();
  const [view, setView] = useState<View>('landing');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (session && (view === 'landing' || view === 'auth')) {
      setView('dashboard');
    }
    if (!session && view !== 'landing' && view !== 'auth') {
      setView('landing');
    }
  }, [session, view]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session) {
    if (view === 'auth') {
      return (
        <AuthPage
          mode={authMode}
          onBack={() => setView('landing')}
          onSuccess={() => setView('dashboard')}
          onToggleMode={() => setAuthMode((m) => (m === 'signin' ? 'signup' : 'signin'))}
        />
      );
    }
    return (
      <LandingPage
        onGetStarted={() => { setAuthMode('signup'); setView('auth'); }}
        onSignIn={() => { setAuthMode('signin'); setView('auth'); }}
      />
    );
  }

  const handleSignOut = async () => {
    await signOut();
    setView('landing');
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <Dashboard onNavigate={setView} />;
      case 'projects': return <Projects onNavigate={setView} />;
      case 'ai-studio': return <AIStudio />;
      case 'app-builder': return <ProjectWorkspace />;
      case 'workflow-builder': return <WorkflowBuilder />;
      case 'agents': return <Agents />;
      case 'deployments': return <Deployments />;
      case 'templates': return <Templates onNavigate={setView} />;
      case 'domains': return <Domains />;
      case 'analytics': return <Analytics />;
      case 'integrations': return <Integrations />;
      case 'settings': return <Settings />;
      default: return <Dashboard onNavigate={setView} />;
    }
  };

  return (
    <div className="flex h-screen bg-bg-primary text-white overflow-hidden flex-col md:flex-row">
      <Sidebar
        current={view}
        onNavigate={setView}
        onSignOut={handleSignOut}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 bg-bg-secondary flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Logo size="sm" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-violet flex items-center justify-center text-xs font-bold text-white">
              {user?.email?.[0]?.toUpperCase() ?? 'U'}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden flex flex-col min-w-0">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
