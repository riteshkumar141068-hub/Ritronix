import { useState } from 'react';
import {
  Workflow, Globe, Bot, GitBranch, Mail, Cloud, FileOutput,
  Plus, Play, Save, Clock, Database, Webhook,
  MessageSquare, Cpu, Download, Settings as SettingsIcon,
  Check, Trash2, Loader2
} from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { AVAILABLE_MODELS } from '@/lib/aiService';

interface NodeDef {
  id: string;
  type: string;
  label: string;
  sub: string;
  icon: typeof Globe;
  category: 'trigger' | 'ai' | 'logic' | 'integration' | 'output';
  x: number;
  y: number;
  color: string;
}

const initialNodes: NodeDef[] = [
  { id: 'n1', type: 'webhook', label: 'Webhook Trigger', sub: 'POST /lead/new', icon: Webhook, category: 'trigger', x: 80, y: 180, color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
  { id: 'n2', type: 'ai-agent', label: 'AI Qualifier Agent', sub: 'Score & classify intent', icon: Bot, category: 'ai', x: 340, y: 180, color: 'text-accent-violet border-accent-violet/30 bg-accent-violet/10' },
  { id: 'n3', type: 'condition', label: 'Score Filter', sub: 'lead_score >= 7.5', icon: GitBranch, category: 'logic', x: 600, y: 180, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  { id: 'n4', type: 'email', label: 'Dispatch Welcome', sub: 'Send onboarding email', icon: Mail, category: 'integration', x: 860, y: 100, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
  { id: 'n5', type: 'database', label: 'Store in Postgres', sub: 'Insert qualified lead', icon: Database, category: 'integration', x: 860, y: 280, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
];

const nodePalette = [
  { category: 'trigger', icon: Webhook, label: 'Webhook', color: 'text-cyan-400', sub: 'HTTP Endpoint' },
  { category: 'trigger', icon: Clock, label: 'Cron Scheduler', color: 'text-cyan-400', sub: 'Every hour / daily' },
  { category: 'ai', icon: Bot, label: 'AI Agent', color: 'text-accent-violet', sub: 'Autonomous step' },
  { category: 'ai', icon: MessageSquare, label: 'LLM Prompt', color: 'text-accent-violet', sub: 'Direct completion' },
  { category: 'ai', icon: Cpu, label: 'Classifier', color: 'text-accent-violet', sub: 'Category routing' },
  { category: 'logic', icon: GitBranch, label: 'Condition', color: 'text-amber-400', sub: 'If / Else' },
  { category: 'integration', icon: Mail, label: 'Email Dispatch', color: 'text-emerald-400', sub: 'Send via SMTP' },
  { category: 'integration', icon: Database, label: 'Database Insert', color: 'text-emerald-400', sub: 'Supabase table' },
  { category: 'integration', icon: Cloud, label: 'HTTP Request', color: 'text-emerald-400', sub: 'REST API call' },
  { category: 'output', icon: FileOutput, label: 'Response Body', color: 'text-rose-400', sub: 'Return JSON' },
];

export function WorkflowBuilder() {
  const [nodes, setNodes] = useState<NodeDef[]>(() => {
    try {
      const saved = localStorage.getItem('ritronix_workflow_nodes');
      return saved ? JSON.parse(saved) : initialNodes;
    } catch {
      return initialNodes;
    }
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('n2');
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Selected node edit states
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];
  const [editLabel, setEditLabel] = useState(selectedNode?.label || '');
  const [editSub, setEditSub] = useState(selectedNode?.sub || '');
  const [editModel, setEditModel] = useState(AVAILABLE_MODELS[0].id);

  const edges = [
    { from: 'n1', to: 'n2' },
    { from: 'n2', to: 'n3' },
    { from: 'n3', to: 'n4' },
    { from: 'n3', to: 'n5' },
  ];

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleSelectNode = (node: NodeDef) => {
    setSelectedNodeId(node.id);
    setEditLabel(node.label);
    setEditSub(node.sub);
  };

  const handleApplyNodeChanges = () => {
    if (!selectedNodeId) return;
    setNodes((prev) =>
      prev.map((n) =>
        n.id === selectedNodeId ? { ...n, label: editLabel, sub: editSub } : n
      )
    );
    triggerToast('Node properties updated!');
  };

  const handleAddNodeFromPalette = (item: typeof nodePalette[0]) => {
    const newId = `n_${Date.now()}`;
    const newNode: NodeDef = {
      id: newId,
      type: item.label.toLowerCase().replace(/\s+/g, '-'),
      label: item.label,
      sub: item.sub,
      icon: item.icon,
      category: item.category as NodeDef['category'],
      x: 350 + Math.random() * 200,
      y: 100 + Math.random() * 250,
      color: `${item.color} border-white/20 bg-white/5`,
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newId);
    setEditLabel(newNode.label);
    setEditSub(newNode.sub);
    triggerToast(`Added node: ${item.label}`);
  };

  const handleDeleteSelectedNode = () => {
    if (!selectedNodeId) return;
    setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId));
    setSelectedNodeId(null);
    triggerToast('Node deleted.');
  };

  const handleSaveWorkflow = () => {
    localStorage.setItem('ritronix_workflow_nodes', JSON.stringify(nodes));
    triggerToast('Workflow saved to workspace!');
  };

  const handleExportWorkflow = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ nodes, edges }, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', 'ritronix-workflow.json');
    dl.click();
    triggerToast('Workflow JSON downloaded.');
  };

  const handleTestRun = () => {
    if (isRunning) return;
    setIsRunning(true);

    const stepOrder = ['n1', 'n2', 'n3', 'n4'];
    let idx = 0;

    const interval = setInterval(() => {
      if (idx < stepOrder.length) {
        setActiveStepId(stepOrder[idx]);
        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setActiveStepId(null);
          setIsRunning(false);
          triggerToast('Workflow simulation completed successfully in 2.1s!');
        }, 800);
      }
    }, 700);
  };

  const getNode = (id: string) => nodes.find((n) => n.id === id);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-bg-primary">
      {/* Top Header */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-bg-secondary flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl gradient-violet flex items-center justify-center glow-sm">
            <Workflow className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Lead Qualification & Auto-Routing</span>
              <Badge variant="success" className="text-[10px]">Active</Badge>
            </div>
            <p className="text-[11px] text-white/40">Automated end-to-end multi-agent pipeline</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {toastMsg && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium animate-fade-in mr-2">
              <Check className="w-3.5 h-3.5" />
              {toastMsg}
            </span>
          )}

          <Button variant="ghost" size="sm" onClick={handleSaveWorkflow}>
            <Save className="w-3.5 h-3.5" />
            Save
          </Button>

          <Button variant="outline" size="sm" onClick={handleExportWorkflow}>
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>

          <Button size="sm" onClick={handleTestRun} disabled={isRunning}>
            {isRunning ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white" />
            )}
            {isRunning ? 'Executing...' : 'Test Run'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Node Palette */}
        <div className="w-60 border-r border-white/5 bg-bg-secondary flex flex-col flex-shrink-0">
          <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Node Palette</span>
            <Badge variant="violet" className="text-[9px]">Click to Add</Badge>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-3">
            {nodePalette.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => handleAddNodeFromPalette(item)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/3 hover:bg-white/8 border border-white/5 hover:border-accent-violet/30 transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                      <Icon className={cn('w-4 h-4', item.color)} />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white/80 group-hover:text-white">{item.label}</div>
                      <div className="text-[10px] text-white/30">{item.sub}</div>
                    </div>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-white/30 group-hover:text-accent-violet transition-colors" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 relative overflow-auto scrollbar-thin bg-[#07070b] bg-dots">
          <div className="absolute inset-0" style={{ minWidth: '1200px', minHeight: '650px' }}>
            {/* SVG Connecting Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: '1200px', minHeight: '650px' }}>
              <defs>
                <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7c5cfc" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              {edges.map((edge, i) => {
                const from = getNode(edge.from);
                const to = getNode(edge.to);
                if (!from || !to) return null;
                const x1 = from.x + 220;
                const y1 = from.y + 40;
                const x2 = to.x;
                const y2 = to.y + 40;
                const midX = (x1 + x2) / 2;
                const isEdgeActive = activeStepId === edge.from;

                return (
                  <path
                    key={i}
                    d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke={isEdgeActive ? 'url(#edgeGradient)' : 'rgba(255, 255, 255, 0.12)'}
                    strokeWidth={isEdgeActive ? 3 : 1.5}
                    strokeDasharray={isEdgeActive ? '6 4' : 'none'}
                    className={isEdgeActive ? 'animate-pulse' : ''}
                  />
                );
              })}
            </svg>

            {/* Nodes on Canvas */}
            {nodes.map((node) => {
              const Icon = node.icon;
              const isSelected = selectedNodeId === node.id;
              const isStepActive = activeStepId === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => handleSelectNode(node)}
                  style={{ left: `${node.x}px`, top: `${node.y}px` }}
                  className={cn(
                    'absolute w-56 rounded-2xl p-4 glass-panel border cursor-pointer select-none transition-all duration-200',
                    isSelected ? 'ring-2 ring-accent-violet border-accent-violet/60 shadow-xl shadow-accent-violet/10 scale-105' : 'hover:border-white/20',
                    isStepActive && 'ring-2 ring-cyan-400 border-cyan-400 shadow-xl shadow-cyan-400/20 scale-105 bg-cyan-950/40'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                        <Icon className={cn('w-4 h-4', isStepActive ? 'text-cyan-300 animate-spin' : 'text-accent-violet')} />
                      </div>
                      <span className="text-xs font-semibold text-white truncate max-w-[120px]">{node.label}</span>
                    </div>
                    {isStepActive && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    )}
                  </div>
                  <div className="text-[11px] text-white/40 truncate">{node.sub}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Node Properties Panel */}
        <div className="w-72 border-l border-white/5 bg-bg-secondary flex flex-col flex-shrink-0">
          <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Node Properties</span>
            <SettingsIcon className="w-3.5 h-3.5 text-white/40" />
          </div>

          {selectedNode ? (
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
              <div>
                <label className="block text-xs text-white/40 uppercase mb-1.5 font-medium">Node Label</label>
                <input
                  type="text"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-accent-violet/50"
                />
              </div>

              <div>
                <label className="block text-xs text-white/40 uppercase mb-1.5 font-medium">Description / Action</label>
                <input
                  type="text"
                  value={editSub}
                  onChange={(e) => setEditSub(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-accent-violet/50"
                />
              </div>

              {selectedNode.category === 'ai' && (
                <div>
                  <label className="block text-xs text-white/40 uppercase mb-1.5 font-medium">AI Intelligence Brain</label>
                  <select
                    value={editModel}
                    onChange={(e) => setEditModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-accent-violet/50"
                  >
                    {AVAILABLE_MODELS.map((m) => (
                      <option key={m.id} value={m.id} className="bg-bg-secondary">{m.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-2 flex flex-col gap-2">
                <Button size="sm" onClick={handleApplyNodeChanges} className="w-full">
                  Apply Updates
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteSelectedNode}
                  className="w-full text-rose-300 border-rose-500/20 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Node
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 text-center text-xs text-white/30">
              Select any node on the canvas to configure parameters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
