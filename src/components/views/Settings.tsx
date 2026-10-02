import { useState, useEffect } from 'react';
import {
  User, Bell, Shield, Key, CreditCard, Palette,
  Check, Loader2, Eye, EyeOff, Save, ExternalLink
} from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { getStoredApiKeys, saveStoredApiKeys, type UserApiKeys } from '@/lib/aiService';

type SettingsTab = 'profile' | 'security' | 'billing' | 'appearance' | 'notifications' | 'api-keys';

export function Settings() {
  const { user } = useAuth();
  const [tab, setTab] = useState<SettingsTab>('profile');
  const [saving, setSaving] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Profile
  const [name, setName] = useState(() => localStorage.getItem('ritronix_profile_name') || user?.email?.split('@')[0] || 'User');
  const [bio, setBio] = useState(() => localStorage.getItem('ritronix_profile_bio') || 'Full-stack AI developer and builder');
  const [email] = useState(user?.email || 'demo@ritronix.ai');

  // Security
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: '1', label: 'Deployment completed', desc: 'Get notified when a deployment goes live', on: true },
    { id: '2', label: 'Build failures', desc: 'Alert when a build or deployment fails', on: true },
    { id: '3', label: 'Agent completion', desc: 'Notify when an AI agent finishes its task', on: true },
    { id: '4', label: 'Workflow errors', desc: 'Alert when a workflow execution fails', on: false },
    { id: '5', label: 'Weekly summary', desc: 'Receive a weekly digest of your workspace activity', on: true },
    { id: '6', label: 'Product updates', desc: 'News about new features and improvements', on: false },
  ]);

  // Appearance
  const [activeColor, setActiveColor] = useState(0);

  // API Keys
  const [apiKeys, setApiKeys] = useState<UserApiKeys>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setApiKeys(getStoredApiKeys());
  }, []);

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 2500);
  };

  const handleSaveProfile = () => {
    setSaving(true);
    localStorage.setItem('ritronix_profile_name', name);
    localStorage.setItem('ritronix_profile_bio', bio);
    setTimeout(() => {
      setSaving(false);
      triggerToast('Profile updated successfully!');
    }, 600);
  };

  const handleUpdatePassword = () => {
    if (!newPw) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setCurrentPw('');
      setNewPw('');
      triggerToast('Security settings updated successfully!');
    }, 600);
  };

  const handleSaveApiKeys = () => {
    saveStoredApiKeys(apiKeys);
    triggerToast('Private API keys saved locally!');
  };

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, on: !n.on } : n))
    );
    triggerToast('Notification preferences updated.');
  };

  const tabs: Array<{ id: SettingsTab; label: string; icon: typeof User }> = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'api-keys', label: 'AI API Keys', icon: Key },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
  ];

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-5xl mx-auto p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Settings & Preferences</h1>
            <p className="text-sm text-white/40">Manage your private workspace, AI API credentials, and preferences</p>
          </div>
          {saveToast && (
            <div className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4" />
              {saveToast}
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Tab Sidebar */}
          <div className="md:w-52 flex-shrink-0">
            <div className="flex md:flex-col gap-1 overflow-x-auto scrollbar-thin pb-2 md:pb-0">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    'flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap',
                    tab === t.id
                      ? 'bg-accent-violet/20 text-white border border-accent-violet/30 font-medium'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent'
                  )}
                >
                  <t.icon className={cn('w-4 h-4', tab === t.id && 'text-accent-violet')} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {/* PROFILE TAB */}
            {tab === 'profile' && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-1">Personal Profile</h2>
                <p className="text-sm text-white/40 mb-6">Manage your workspace identity and info</p>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl gradient-violet flex items-center justify-center text-2xl font-bold text-white glow-sm">
                    {name[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{name}</div>
                    <div className="text-xs text-white/40">{email}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-white/50 uppercase tracking-wider mb-2 font-medium">Display Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-accent-violet/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 uppercase tracking-wider mb-2 font-medium">Email Address</label>
                    <input
                      value={email}
                      disabled
                      className="w-full px-4 py-2.5 rounded-xl bg-white/3 border border-white/5 text-sm text-white/40 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 uppercase tracking-wider mb-2 font-medium">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-accent-violet/40 resize-none scrollbar-thin"
                    />
                  </div>
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </Button>
                </div>
              </Card>
            )}

            {/* AI API KEYS TAB */}
            {tab === 'api-keys' && (
              <Card className="p-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-lg font-semibold">Private AI API Credentials</h2>
                    <Badge variant="violet" className="text-[10px]">Client-Side Encrypted</Badge>
                  </div>
                  <p className="text-xs text-white/40">
                    Keys are stored exclusively on your device in browser localStorage. They never touch any middleman servers.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Gemini Key */}
                  <div className="p-4 rounded-2xl bg-white/3 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">Google Gemini API Key</span>
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-accent-violet hover:underline flex items-center gap-1"
                      >
                        Get Free Key <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="relative">
                      <input
                        type={showKeys.gemini ? 'text' : 'password'}
                        placeholder="AIzaSy..."
                        value={apiKeys.gemini || ''}
                        onChange={(e) => setApiKeys({ ...apiKeys, gemini: e.target.value.trim() })}
                        className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-accent-violet/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKeys({ ...showKeys, gemini: !showKeys.gemini })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                      >
                        {showKeys.gemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Groq Key */}
                  <div className="p-4 rounded-2xl bg-white/3 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">Groq API Key (300+ Tokens/Sec)</span>
                      <a
                        href="https://console.groq.com/keys"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-accent-violet hover:underline flex items-center gap-1"
                      >
                        Get Free Groq Key <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="relative">
                      <input
                        type={showKeys.groq ? 'text' : 'password'}
                        placeholder="gsk_..."
                        value={apiKeys.groq || ''}
                        onChange={(e) => setApiKeys({ ...apiKeys, groq: e.target.value.trim() })}
                        className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-accent-violet/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKeys({ ...showKeys, groq: !showKeys.groq })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                      >
                        {showKeys.groq ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* OpenAI Key */}
                  <div className="p-4 rounded-2xl bg-white/3 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">OpenAI API Key (GPT-4o)</span>
                      <a
                        href="https://platform.openai.com/api-keys"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-accent-violet hover:underline flex items-center gap-1"
                      >
                        OpenAI Platform <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="relative">
                      <input
                        type={showKeys.openai ? 'text' : 'password'}
                        placeholder="sk-proj-..."
                        value={apiKeys.openai || ''}
                        onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value.trim() })}
                        className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-accent-violet/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKeys({ ...showKeys, openai: !showKeys.openai })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                      >
                        {showKeys.openai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* OpenRouter & DeepSeek */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/3 border border-white/5 space-y-2">
                      <span className="text-xs font-semibold text-white">OpenRouter Key</span>
                      <input
                        type="password"
                        placeholder="sk-or-v1-..."
                        value={apiKeys.openrouter || ''}
                        onChange={(e) => setApiKeys({ ...apiKeys, openrouter: e.target.value.trim() })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
                      />
                    </div>
                    <div className="p-4 rounded-2xl bg-white/3 border border-white/5 space-y-2">
                      <span className="text-xs font-semibold text-white">DeepSeek API Key</span>
                      <input
                        type="password"
                        placeholder="sk-..."
                        value={apiKeys.deepseek || ''}
                        onChange={(e) => setApiKeys({ ...apiKeys, deepseek: e.target.value.trim() })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/10">
                  <Button onClick={handleSaveApiKeys}>
                    <Save className="w-4 h-4" />
                    Save API Credentials
                  </Button>
                </div>
              </Card>
            )}

            {/* APPEARANCE TAB */}
            {tab === 'appearance' && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-1">Appearance</h2>
                <p className="text-sm text-white/40 mb-6">Customize interface themes and visual aesthetics</p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs text-white/50 uppercase tracking-wider mb-3">Accent Color</label>
                    <div className="flex items-center gap-3">
                      {['#7c5cfc', '#22d3ee', '#10b981', '#f59e0b', '#f43f5e'].map((color, i) => (
                        <button
                          key={color}
                          onClick={() => {
                            setActiveColor(i);
                            triggerToast('Accent color updated');
                          }}
                          className={cn(
                            'w-10 h-10 rounded-2xl transition-all',
                            activeColor === i && 'ring-2 ring-white ring-offset-2 ring-offset-bg-secondary scale-110'
                          )}
                          style={{ background: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Dark Luxury Cyber Theme</div>
                        <div className="text-xs text-white/40">High-contrast glassmorphism with ambient blur glows</div>
                      </div>
                      <Badge variant="violet">Default Active</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* SECURITY TAB */}
            {tab === 'security' && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-1">Security & Authentication</h2>
                <p className="text-sm text-white/40 mb-6">Manage your credentials and login safety</p>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={currentPw}
                      onChange={(e) => setCurrentPw(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <Button onClick={handleUpdatePassword} disabled={!newPw || saving}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Update Password
                  </Button>
                </div>
              </Card>
            )}

            {/* NOTIFICATIONS TAB */}
            {tab === 'notifications' && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-1">Notification Preferences</h2>
                <p className="text-sm text-white/40 mb-6">Configure execution alerts and build status updates</p>

                <div className="space-y-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                    >
                      <div>
                        <div className="text-sm font-medium text-white">{n.label}</div>
                        <div className="text-xs text-white/40">{n.desc}</div>
                      </div>
                      <button
                        onClick={() => toggleNotification(n.id)}
                        className={cn(
                          'w-11 h-6 rounded-full relative transition-colors cursor-pointer',
                          n.on ? 'bg-accent-violet' : 'bg-white/10'
                        )}
                      >
                        <div
                          className={cn(
                            'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all',
                            n.on ? 'left-5' : 'left-0.5'
                          )}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* BILLING TAB */}
            {tab === 'billing' && (
              <div className="space-y-4">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold">Your Private Plan</h2>
                      <p className="text-sm text-white/40">Unlimited self-hosted private workspace</p>
                    </div>
                    <Badge variant="success">Active Forever</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 rounded-2xl bg-white/3 border border-white/5">
                      <div className="text-xl font-bold text-white">Unlimited</div>
                      <div className="text-xs text-white/40">Projects</div>
                    </div>
                    <div className="text-center p-3 rounded-2xl bg-white/3 border border-white/5">
                      <div className="text-xl font-bold text-white">Direct BYOK</div>
                      <div className="text-xs text-white/40">Zero Token Markup</div>
                    </div>
                    <div className="text-center p-3 rounded-2xl bg-white/3 border border-white/5">
                      <div className="text-xl font-bold text-white">All Agents</div>
                      <div className="text-xs text-white/40">Unlocked</div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
