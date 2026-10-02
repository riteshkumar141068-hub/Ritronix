import { useState, useEffect } from 'react';
import {
  Plus, Play, Square, Bot, Clock, Settings as SettingsIcon,
  Search as SearchIcon, UserCheck, Headphones,
  PenLine, Globe, Rocket, Activity, Mail,  Check, X, Terminal, Sparkles, Filter, Trash2, Sliders
} from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { mockAgents } from '@/lib/mockData';
import { AVAILABLE_MODELS } from '@/lib/aiService';
import type { Agent } from '@/types';

const iconMap: Record<string, typeof Bot> = {
  Search: SearchIcon,
  UserCheck,
  Headphones,
  PenLine,
  Globe,
  Rocket,
  Activity,
  Mail,
  Bot,
};

const ALL_TOOLS = [
  'web_search',
  'file_read',
  'file_write',
  'terminal_exec',
  'code_generate',
  'http_request',
  'database_query',
  'deploy_site',
  'email_send',
  'webhook_call',
];

interface ExecutionLog {
  id: string;
  time: string;
  step: number;
  message: string;
  type: 'info' | 'tool' | 'success' | 'warn';
}

export function Agents() {
  const [agents, setAgents] = useState<Agent[]>(() => {
    try {
      const saved = localStorage.getItem('ritronix_agents_data');
      return saved ? JSON.parse(saved) : mockAgents;
    } catch {
      return mockAgents;
    }
  });

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals & Drawers
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [settingsModalAgent, setSettingsModalAgent] = useState<Agent | null>(null);
  const [activeConsoleAgent, setActiveConsoleAgent] = useState<Agent | null>(null);
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);
  const [isRunningSim, setIsRunningSim] = useState(false);

  // New Agent Form state
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Development');
  const [newModel, setNewModel] = useState(AVAILABLE_MODELS[0].id);
  const [newMaxSteps, setNewMaxSteps] = useState(15);
  const [newTools, setNewTools] = useState<string[]>(['web_search', 'file_write', 'code_generate']);
  const [newSystemPrompt, setNewSystemPrompt] = useState('You are an autonomous AI agent in Ritronix Ai. Execute tasks systematically with verification.');

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ritronix_agents_data', JSON.stringify(agents));
    } catch {
      // ignore
    }
  }, [agents]);

  // Filter logic
  const categories = ['all', ...Array.from(new Set(agents.map((a) => a.category)))];

  const filteredAgents = agents.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'all' || a.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  // Start Agent Run
  const handleRunAgent = (agent: Agent) => {
    setActiveConsoleAgent(agent);
    setIsRunningSim(true);

    // Update status to running
    setAgents((prev) =>
      prev.map((a) => (a.id === agent.id ? { ...a, status: 'running', lastRun: 'Just now' } : a))
    );

    // Populate initial logs
    const now = () => new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const initialLogSet: ExecutionLog[] = [
      { id: '1', time: now(), step: 1, message: `Initialized autonomous runtime for agent [${agent.name}].`, type: 'info' },
      { id: '2', time: now(), step: 2, message: `Loaded ${agent.tools.length} authorized tools: ${agent.tools.join(', ')}`, type: 'info' },
      { id: '3', time: now(), step: 3, message: `Connecting to high-speed inference pipeline...`, type: 'info' },
    ];
    setExecutionLogs(initialLogSet);

    // Stream simulated steps
    setTimeout(() => {
      setExecutionLogs((prev) => [
        ...prev,
        { id: '4', time: now(), step: 4, message: `Tool invocation: [${agent.tools[0] || 'web_search'}] analyzing project context...`, type: 'tool' },
      ]);
    }, 1200);

    setTimeout(() => {
      setExecutionLogs((prev) => [
        ...prev,
        { id: '5', time: now(), step: 5, message: `Evaluating heuristics & generating optimization patch...`, type: 'info' },
      ]);
    }, 2500);

    setTimeout(() => {
      setExecutionLogs((prev) => [
        ...prev,
        { id: '6', time: now(), step: 6, message: `Task successfully verified and validated. Execution complete!`, type: 'success' },
      ]);
      setIsRunningSim(false);
      setAgents((prev) =>
        prev.map((a) => (a.id === agent.id ? { ...a, status: 'completed', lastRun: 'Just now' } : a))
      );
    }, 4200);
  };

  // Stop Agent Run
  const handleStopAgent = (agentId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsRunningSim(false);
    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, status: 'idle' } : a))
    );
    setExecutionLogs((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString(),
        step: 0,
        message: `Execution manually terminated by user.`,
        type: 'warn',
      },
    ]);
  };

  // Create New Agent
  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newAgent: Agent = {
      id: Date.now().toString(),
      name: newName.trim(),
      description: newDesc.trim() || 'Autonomous AI agent configured in Ritronix Studio',
      category: newCategory,
      status: 'idle',
      icon: 'Bot',
      tools: newTools.length > 0 ? newTools : ['web_search', 'file_write'],
      maxSteps: Number(newMaxSteps) || 15,
      lastRun: 'Never',
    };

    setAgents((prev) => [newAgent, ...prev]);
    setCreateModalOpen(false);

    // Reset fields
    setNewName('');
    setNewDesc('');
    setNewTools(['web_search', 'file_write', 'code_generate']);
  };

  // Delete Agent
  const handleDeleteAgent = (agentId: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== agentId));
    if (settingsModalAgent?.id === agentId) setSettingsModalAgent(null);
    if (activeConsoleAgent?.id === agentId) setActiveConsoleAgent(null);
  };

  const toggleTool = (tool: string) => {
    setNewTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-7xl mx-auto p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">Autonomous AI Agents</h1>
                <Badge variant="violet" className="text-[10px]">Production Engine</Badge>
              </div>
              <p className="text-sm text-white/40">
                Deploy, schedule, and orchestrate goal-oriented AI agents with dedicated tool permissions.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => setCreateModalOpen(true)}>
                <Plus className="w-4 h-4" />
                Create Agent
              </Button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="glass-panel p-4 rounded-2xl border border-white/5">
              <div className="text-xs text-white/40 mb-1">Total Agents</div>
              <div className="text-2xl font-bold text-white">{agents.length}</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-white/5">
              <div className="text-xs text-emerald-400 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Running Now
              </div>
              <div className="text-2xl font-bold text-white">
                {agents.filter((a) => a.status === 'running').length}
              </div>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-white/5">
              <div className="text-xs text-white/40 mb-1">Completed Tasks</div>
              <div className="text-2xl font-bold text-white">
                {agents.filter((a) => a.status === 'completed').length}
              </div>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-white/5">
              <div className="text-xs text-white/40 mb-1">Active Tools</div>
              <div className="text-2xl font-bold text-accent-violet">10</div>
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-2 md:pb-0">
              <Filter className="w-3.5 h-3.5 text-white/40 ml-1 mr-1 flex-shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize whitespace-nowrap transition-all ${
                    categoryFilter === cat
                      ? 'bg-accent-violet/20 text-accent-violet border border-accent-violet/30'
                      : 'text-white/40 hover:text-white/80 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-accent-violet/40"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white/5 border border-white/10 text-white/70 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-accent-violet/40"
              >
                <option value="all" className="bg-bg-secondary">All Statuses</option>
                <option value="running" className="bg-bg-secondary">Running</option>
                <option value="completed" className="bg-bg-secondary">Completed</option>
                <option value="idle" className="bg-bg-secondary">Idle</option>
              </select>
            </div>
          </div>

          {/* Agents Grid */}
          {filteredAgents.length === 0 ? (
            <div className="text-center py-16 glass-panel rounded-3xl border border-white/5">
              <Bot className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white/80 mb-1">No agents found</h3>
              <p className="text-xs text-white/40 mb-4">Try clearing filters or create a new custom agent</p>
              <Button size="sm" onClick={() => setCreateModalOpen(true)}>
                <Plus className="w-4 h-4" />
                Create New Agent
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAgents.map((agent) => {
                const Icon = iconMap[agent.icon] ?? Bot;
                const isCurrentConsole = activeConsoleAgent?.id === agent.id;
                return (
                  <Card
                    key={agent.id}
                    hover
                    onClick={() => setActiveConsoleAgent(agent)}
                    className={`p-5 group relative transition-all duration-300 border ${
                      isCurrentConsole
                        ? 'border-accent-violet/50 shadow-xl shadow-accent-violet/10'
                        : 'border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-violet/20 to-accent-indigo/10 border border-accent-violet/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6 text-accent-violet" />
                      </div>
                      <AgentStatusBadge status={agent.status} />
                    </div>

                    <h3 className="font-semibold text-base mb-1 group-hover:text-accent-violet transition-colors">
                      {agent.name}
                    </h3>
                    <p className="text-xs text-white/45 mb-4 line-clamp-2 leading-relaxed">
                      {agent.description}
                    </p>

                    <div className="space-y-2 mb-4 p-3 rounded-xl bg-white/3 border border-white/5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-white/35">Category</span>
                        <span className="text-white/80 font-medium">{agent.category}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/35">Step Limit</span>
                        <span className="text-white/80 font-mono">{agent.maxSteps} max steps</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/35">Last Run</span>
                        <span className="text-white/60 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {agent.lastRun}
                        </span>
                      </div>
                    </div>

                    {/* Tool tags */}
                    <div className="flex flex-wrap gap-1 mb-5">
                      {agent.tools.slice(0, 3).map((tool) => (
                        <span
                          key={tool}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] text-white/60 font-mono"
                        >
                          {tool}
                        </span>
                      ))}
                      {agent.tools.length > 3 && (
                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-white/30 font-mono">
                          +{agent.tools.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      {agent.status === 'running' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
                          onClick={() => handleStopAgent(agent.id)}
                        >
                          <Square className="w-3.5 h-3.5 fill-rose-400" />
                          Stop
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleRunAgent(agent)}
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          Run Agent
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="px-2.5 hover:text-white"
                        onClick={() => setSettingsModalAgent(agent)}
                        title="Configure Agent"
                      >
                        <SettingsIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Live Agent Terminal / Console Drawer */}
      {activeConsoleAgent && (
        <aside className="w-96 border-l border-white/10 bg-bg-secondary flex flex-col flex-shrink-0 animate-fade-in">
          {/* Drawer Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg gradient-violet flex items-center justify-center text-white">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white truncate max-w-[190px]">
                  {activeConsoleAgent.name}
                </h3>
                <span className="text-[11px] text-white/40">Execution Console</span>
              </div>
            </div>
            <button
              onClick={() => setActiveConsoleAgent(null)}
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Status info bar */}
          <div className="px-4 py-3 bg-white/3 border-b border-white/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-white/40">Status:</span>
              <AgentStatusBadge status={activeConsoleAgent.status} />
            </div>
            <div className="text-white/40 font-mono">
              Limit: {activeConsoleAgent.maxSteps} steps
            </div>
          </div>

          {/* Terminal Logs */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 font-mono text-xs space-y-2 bg-[#09090d]">
            {executionLogs.length === 0 ? (
              <div className="text-center py-12 text-white/30">
                <p>No recent execution logs.</p>
                <p className="text-[10px] mt-1 text-white/20">Click 'Run Agent' to start execution.</p>
              </div>
            ) : (
              executionLogs.map((log) => (
                <div key={log.id} className="leading-relaxed">
                  <span className="text-white/25 mr-2">[{log.time}]</span>
                  {log.type === 'tool' && (
                    <span className="text-cyan-400 font-semibold">[TOOL] </span>
                  )}
                  {log.type === 'success' && (
                    <span className="text-emerald-400 font-semibold">[SUCCESS] </span>
                  )}
                  {log.type === 'warn' && (
                    <span className="text-amber-400 font-semibold">[HALT] </span>
                  )}
                  <span
                    className={
                      log.type === 'success'
                        ? 'text-emerald-300'
                        : log.type === 'tool'
                        ? 'text-cyan-200'
                        : log.type === 'warn'
                        ? 'text-amber-300'
                        : 'text-white/70'
                    }
                  >
                    {log.message}
                  </span>
                </div>
              ))
            )}
            {isRunningSim && (
              <div className="flex items-center gap-1.5 text-accent-violet pt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-violet animate-pulse" />
                <span>Agent running step execution...</span>
              </div>
            )}
          </div>

          {/* Drawer Actions */}
          <div className="p-4 border-t border-white/10 flex items-center gap-2 bg-bg-secondary">
            {activeConsoleAgent.status === 'running' ? (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
                onClick={() => handleStopAgent(activeConsoleAgent.id)}
              >
                <Square className="w-3.5 h-3.5 fill-rose-400" />
                Stop Run
              </Button>
            ) : (
              <Button
                size="sm"
                className="flex-1"
                onClick={() => handleRunAgent(activeConsoleAgent)}
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                Execute Task
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setExecutionLogs([])}
              title="Clear terminal logs"
            >
              Clear
            </Button>
          </div>
        </aside>
      )}

      {/* CREATE AGENT MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl glass-panel-strong rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl gradient-violet flex items-center justify-center text-white glow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Create New AI Agent</h2>
                  <p className="text-xs text-white/40">Configure role, tools, and execution model</p>
                </div>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAgent} className="p-6 overflow-y-auto scrollbar-thin space-y-4 flex-1">
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-wider mb-1.5 font-medium">
                  Agent Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SEO Optimization Agent"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent-violet/50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-wider mb-1.5 font-medium">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-accent-violet/50"
                  >
                    <option value="Development" className="bg-bg-secondary">Development</option>
                    <option value="Research" className="bg-bg-secondary">Research</option>
                    <option value="DevOps" className="bg-bg-secondary">DevOps</option>
                    <option value="Marketing" className="bg-bg-secondary">Marketing</option>
                    <option value="Support" className="bg-bg-secondary">Customer Support</option>
                    <option value="Content" className="bg-bg-secondary">Content Creation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-wider mb-1.5 font-medium">
                    AI Brain / Model
                  </label>
                  <select
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-accent-violet/50"
                  >
                    {AVAILABLE_MODELS.map((m) => (
                      <option key={m.id} value={m.id} className="bg-bg-secondary">
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/50 uppercase tracking-wider mb-1.5 font-medium">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="What is this agent's mission?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent-violet/50 resize-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-white/50 uppercase tracking-wider font-medium">
                    Authorized Tools ({newTools.length} selected)
                  </label>
                  <span className="text-[11px] text-white/30">Click to toggle tools</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_TOOLS.map((tool) => {
                    const active = newTools.includes(tool);
                    return (
                      <button
                        type="button"
                        key={tool}
                        onClick={() => toggleTool(tool)}
                        className={`px-3 py-2 rounded-xl text-xs font-mono text-left flex items-center justify-between border transition-all ${
                          active
                            ? 'bg-accent-violet/20 border-accent-violet/40 text-white'
                            : 'bg-white/3 border-white/5 text-white/40 hover:bg-white/5'
                        }`}
                      >
                        <span>{tool}</span>
                        {active && <Check className="w-3.5 h-3.5 text-accent-violet" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-white/50 uppercase tracking-wider font-medium">
                    Max Execution Steps: {newMaxSteps}
                  </label>
                </div>
                <input
                  type="range"
                  min={3}
                  max={50}
                  value={newMaxSteps}
                  onChange={(e) => setNewMaxSteps(Number(e.target.value))}
                  className="w-full accent-accent-violet cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs text-white/50 uppercase tracking-wider mb-1.5 font-medium">
                  System Instructions
                </label>
                <textarea
                  rows={3}
                  value={newSystemPrompt}
                  onChange={(e) => setNewSystemPrompt(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-accent-violet/50 resize-none"
                />
              </div>

              <div className="p-4 border-t border-white/10 flex items-center justify-end gap-3 -mx-6 -mb-6 bg-bg-secondary mt-6">
                <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  <Sparkles className="w-4 h-4" />
                  Deploy Agent
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AGENT SETTINGS / CONFIGURE MODAL */}
      {settingsModalAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg glass-panel-strong rounded-3xl border border-white/10 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2.5">
                <Sliders className="w-5 h-5 text-accent-violet" />
                <h3 className="text-base font-bold text-white">Configure: {settingsModalAgent.name}</h3>
              </div>
              <button
                onClick={() => setSettingsModalAgent(null)}
                className="p-1.5 rounded-lg text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-wider mb-1">Agent Name</label>
                <input
                  type="text"
                  value={settingsModalAgent.name}
                  onChange={(e) =>
                    setSettingsModalAgent({ ...settingsModalAgent, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-white/50 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  rows={2}
                  value={settingsModalAgent.description}
                  onChange={(e) =>
                    setSettingsModalAgent({ ...settingsModalAgent, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-white/3 border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-white">Danger Zone</div>
                  <div className="text-white/40">Permanently delete this agent</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
                  onClick={() => handleDeleteAgent(settingsModalAgent.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Agent
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
              <Button variant="outline" size="sm" onClick={() => setSettingsModalAgent(null)}>
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setAgents((prev) =>
                    prev.map((a) => (a.id === settingsModalAgent.id ? settingsModalAgent : a))
                  );
                  setSettingsModalAgent(null);
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AgentStatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: 'success' | 'warning' | 'error' | 'default'; label: string }> = {
    running: { variant: 'warning', label: 'Running' },
    completed: { variant: 'success', label: 'Completed' },
    idle: { variant: 'default', label: 'Idle' },
    failed: { variant: 'error', label: 'Failed' },
  };
  const config = map[status] ?? map.idle;
  return (
    <Badge variant={config.variant}>
      {status === 'running' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
      {config.label}
    </Badge>
  );
}
