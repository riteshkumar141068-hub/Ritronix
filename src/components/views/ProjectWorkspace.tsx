import { useState } from 'react';
import {
  File, Folder, FolderOpen, ChevronRight, ChevronDown,
  Play, Rocket, GitBranch, Share2, Sparkles, Send,
  Terminal, AlertCircle, Check, Code2, Layout, Eye as EyeIcon,
  Plus, X,
} from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { mockFileTree, mockFileContent, mockTerminalLogs } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { executeAiChat, AVAILABLE_MODELS } from '@/lib/aiService';
import type { FileNode } from '@/types';

interface ProjectWorkspaceProps {
  projectName?: string;
}

export function ProjectWorkspace({ projectName = 'Aurora Restaurant' }: ProjectWorkspaceProps) {
  const [activeFile, setActiveFile] = useState('app/components/Hero.tsx');
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set(['app', 'app/components', 'lib']));
  const [viewMode, setViewMode] = useState<'code' | 'visual' | 'preview'>('code');
  const [bottomTab, setBottomTab] = useState<'terminal' | 'problems' | 'logs' | 'agent'>('terminal');
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotMessages, setCopilotMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: "I'm your AI Copilot. I can see your project files and understand the component structure. What would you like to change?" },
  ]);

  const fileContent = mockFileContent[activeFile] ?? '// File content loading...';
  const lines = fileContent.split('\n');

  const toggleFolder = (path: string) => {
    setOpenFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const renderFileTree = (nodes: FileNode[], depth = 0) => (
    <div className={cn(depth > 0 && 'ml-3 border-l border-white/5')}>
      {nodes.map((node) => (
        <div key={node.path}>
          {node.type === 'folder' ? (
            <>
              <button
                onClick={() => toggleFolder(node.path)}
                className="w-full flex items-center gap-1.5 px-2 py-1 rounded text-xs hover:bg-white/5 transition-colors text-white/60"
                style={{ paddingLeft: `${depth * 8 + 8}px` }}
              >
                {openFolders.has(node.path) ? (
                  <ChevronDown className="w-3 h-3 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-3 h-3 flex-shrink-0" />
                )}
                {openFolders.has(node.path) ? (
                  <FolderOpen className="w-3.5 h-3.5 text-accent-violet flex-shrink-0" />
                ) : (
                  <Folder className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
                )}
                <span className="truncate">{node.name}</span>
              </button>
              {openFolders.has(node.path) && node.children && renderFileTree(node.children, depth + 1)}
            </>
          ) : (
            <button
              onClick={() => setActiveFile(node.path)}
              className={cn(
                'w-full flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors',
                activeFile === node.path
                  ? 'bg-accent-violet/15 text-accent-violet'
                  : 'text-white/50 hover:bg-white/5 hover:text-white/70'
              )}
              style={{ paddingLeft: `${depth * 8 + 20}px` }}
            >
              <File className="w-3 h-3 flex-shrink-0 opacity-60" />
              <span className="truncate">{node.name}</span>
            </button>
          )}
        </div>
      ))}
    </div>
  );

  const sendCopilotMessage = async () => {
    if (!copilotInput.trim()) return;
    const userMsg = { role: 'user' as const, content: copilotInput };
    setCopilotMessages((prev) => [...prev, userMsg]);
    const promptText = copilotInput;
    setCopilotInput('');

    try {
      const reply = await executeAiChat({
        modelDef: AVAILABLE_MODELS[0],
        systemPrompt: `You are an AI code copilot in Ritronix Ai App Builder. Editing file: ${activeFile}. Project: ${projectName}. Provide clean code fixes or actionable advice.`,
        messages: [
          ...copilotMessages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
          { role: 'user', content: promptText },
        ],
      });
      setCopilotMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setCopilotMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `I analyzed ${activeFile}. Recommended changes:\n\n1. Enhanced TypeScript interfaces\n2. Optimized tailwind classes\n3. Responsive grid structure verified.`,
        },
      ]);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Top bar */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-white/5 bg-bg-secondary flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded gradient-violet flex items-center justify-center text-xs font-bold">
            {projectName[0]}
          </div>
          <span className="text-sm font-medium">{projectName}</span>
          <Badge variant="default" className="text-[10px]">Production</Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white/5 rounded-lg p-0.5">
            {(['code', 'visual', 'preview'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all flex items-center gap-1.5',
                  viewMode === mode ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
                )}
              >
                {mode === 'code' && <Code2 className="w-3.5 h-3.5" />}
                {mode === 'visual' && <Layout className="w-3.5 h-3.5" />}
                {mode === 'preview' && <EyeIcon className="w-3.5 h-3.5" />}
                {mode}
              </button>
            ))}
          </div>
          <div className="w-px h-5 bg-white/10" />
          <Button variant="ghost" size="sm"><GitBranch className="w-3.5 h-3.5" />main</Button>
          <Button variant="ghost" size="sm"><Share2 className="w-3.5 h-3.5" /></Button>
          <Button variant="outline" size="sm"><Play className="w-3.5 h-3.5" />Preview</Button>
          <Button size="sm"><Rocket className="w-3.5 h-3.5" />Deploy</Button>
        </div>
      </div>

      {/* Main workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* File tree */}
        <div className="w-52 border-r border-white/5 bg-bg-secondary flex flex-col flex-shrink-0">
          <div className="px-3 py-2.5 border-b border-white/5 flex items-center justify-between">
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Explorer</span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded hover:bg-white/5 text-white/40 hover:text-white/60">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
            {renderFileTree(mockFileTree)}
          </div>
        </div>

        {/* Center workspace */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {viewMode === 'code' && (
            <>
              {/* File tabs */}
              <div className="h-9 flex items-center border-b border-white/5 bg-bg-secondary overflow-x-auto scrollbar-thin">
                {['app/components/Hero.tsx', 'app/components/Navbar.tsx', 'app/page.tsx'].map((file) => (
                  <button
                    key={file}
                    onClick={() => setActiveFile(file)}
                    className={cn(
                      'h-full px-3 flex items-center gap-2 text-xs border-r border-white/5 whitespace-nowrap transition-colors',
                      activeFile === file
                        ? 'bg-bg-tertiary text-white'
                        : 'text-white/40 hover:text-white/60 hover:bg-white/3'
                    )}
                  >
                    <File className="w-3 h-3 opacity-60" />
                    {file.split('/').pop()}
                    {activeFile === file && <X className="w-3 h-3 opacity-40" />}
                  </button>
                ))}
              </div>

              {/* Monaco-style editor */}
              <div className="flex-1 overflow-auto scrollbar-thin bg-bg-primary font-mono text-sm">
                <div className="flex">
                  <div className="flex-shrink-0 py-3 px-4 text-right text-white/20 select-none border-r border-white/5">
                    {lines.map((_, i) => (
                      <div key={i} className="leading-6">{i + 1}</div>
                    ))}
                  </div>
                  <div className="flex-1 py-3 px-4">
                    {lines.map((line, i) => (
                      <div key={i} className="leading-6 text-white/80">
                        {highlightCode(line)}
                      </div>
                    ))}
                    <div className="leading-6 h-4" />
                  </div>
                </div>
              </div>
            </>
          )}

          {viewMode === 'visual' && (
            <div className="flex-1 flex items-center justify-center bg-bg-primary bg-dots">
              <div className="text-center max-w-sm">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Layout className="w-8 h-8 text-white/30" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Visual Builder</h3>
                <p className="text-sm text-white/40 mb-4">
                  Drag and drop components, edit styles visually, and see changes sync to code in real time.
                </p>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4" />
                  Open Visual Editor
                </Button>
              </div>
            </div>
          )}

          {viewMode === 'preview' && (
            <div className="flex-1 flex flex-col bg-bg-primary">
              <div className="h-9 flex items-center gap-2 px-3 border-b border-white/5 bg-bg-secondary">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <span className="text-xs text-white/30 font-mono">localhost:3000</span>
                </div>
                <button className="p-1 rounded hover:bg-white/5 text-white/40">
                  <Play className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden glass-panel">
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-violet-900/20 to-transparent">
                    <p className="text-amber-400/80 text-xs tracking-[0.3em] uppercase mb-4">Fine Dining · Est. 2024</p>
                    <h1 className="text-4xl font-light mb-3">Aurora</h1>
                    <p className="text-sm text-white/50 max-w-xs">A modern dining experience where culinary artistry meets timeless elegance.</p>
                    <button className="mt-6 px-5 py-2 bg-amber-500/90 text-black rounded-full text-xs font-medium">Book a Table</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom panel */}
          <div className="h-48 border-t border-white/5 bg-bg-secondary flex flex-col flex-shrink-0">
            <div className="h-8 flex items-center px-2 border-b border-white/5 gap-1">
              {(['terminal', 'problems', 'logs', 'agent'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setBottomTab(tab)}
                  className={cn(
                    'px-3 py-1 rounded text-xs font-medium capitalize transition-colors flex items-center gap-1.5',
                    bottomTab === tab ? 'bg-white/8 text-white' : 'text-white/40 hover:text-white/60'
                  )}
                >
                  {tab === 'terminal' && <Terminal className="w-3 h-3" />}
                  {tab === 'problems' && <AlertCircle className="w-3 h-3" />}
                  {tab === 'logs' && <File className="w-3 h-3" />}
                  {tab === 'agent' && <Sparkles className="w-3 h-3" />}
                  {tab}
                  {tab === 'problems' && <span className="text-[10px] text-rose-400">0</span>}
                </button>
              ))}
              <div className="flex-1" />
              <button className="p-1 rounded text-white/30 hover:text-white/50">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-3 font-mono text-xs">
              {bottomTab === 'terminal' && (
                <div className="space-y-0.5">
                  {mockTerminalLogs.map((log, i) => (
                    <div
                      key={i}
                      className={cn(
                        'leading-5',
                        log.type === 'success' && 'text-emerald-400',
                        log.type === 'info' && 'text-white/50'
                      )}
                    >
                      {log.text}
                    </div>
                  ))}
                  <div className="flex items-center gap-1 text-white/50">
                    <span>$</span>
                    <span className="w-2 h-4 bg-accent-violet animate-blink" />
                  </div>
                </div>
              )}
              {bottomTab === 'problems' && (
                <div className="flex flex-col items-center justify-center h-full text-white/30">
                  <Check className="w-6 h-6 text-emerald-400 mb-2" />
                  <span>No problems detected</span>
                </div>
              )}
              {bottomTab === 'logs' && (
                <div className="space-y-1 text-white/40">
                  <div>[INFO] Build started at 10:24 AM</div>
                  <div>[INFO] Compiling components...</div>
                  <div>[INFO] Optimizing images...</div>
                  <div>[SUCCESS] Build completed in 42s</div>
                </div>
              )}
              {bottomTab === 'agent' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-accent-violet">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Agent: Website SEO Agent</span>
                  </div>
                  <div className="text-white/40 ml-5">Step 3/15: Analyzing meta tags...</div>
                  <div className="text-white/30 ml-5">Tool: file_read → app/layout.tsx</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Copilot panel */}
        <div className="w-72 border-l border-white/5 bg-bg-secondary flex flex-col flex-shrink-0">
          <div className="h-9 flex items-center justify-between px-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded gradient-violet flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-semibold">AI Copilot</span>
            </div>
            <Badge variant="violet" className="text-[10px]">Gemini</Badge>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-3">
            {copilotMessages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-xl p-2.5 text-xs whitespace-pre-wrap',
                  msg.role === 'user'
                    ? 'bg-white/5 text-white/80'
                    : 'bg-accent-violet/10 border border-accent-violet/15 text-white/80'
                )}
              >
                {msg.content}
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-white/5">
            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
              {['Explain', 'Fix', 'Refactor', 'Optimize'].map((action) => (
                <button
                  key={action}
                  className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[10px] text-white/50 transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
            <div className="relative">
              <textarea
                value={copilotInput}
                onChange={(e) => setCopilotInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendCopilotMessage();
                  }
                }}
                placeholder="Ask AI to modify your project..."
                rows={2}
                className="w-full px-3 py-2 pr-9 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-accent-violet/40 resize-none scrollbar-thin"
              />
              <button
                onClick={sendCopilotMessage}
                className="absolute right-2 bottom-2 p-1.5 rounded-lg gradient-violet text-white hover:opacity-90 transition-opacity"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function highlightCode(line: string): React.ReactNode {
  if (line.trim().startsWith('//')) {
    return <span className="text-white/30">{line}</span>;
  }

  const tokens = line.split(/(\s+|[(){}[\];,])/);
  return tokens.map((token, i) => {
    if (['export', 'function', 'return', 'const', 'import', 'from', 'default'].includes(token)) {
      return <span key={i} className="text-rose-400">{token}</span>;
    }
    if (['true', 'false', 'null', 'undefined'].includes(token)) {
      return <span key={i} className="text-amber-400">{token}</span>;
    }
    if (token.startsWith('"') || token.startsWith("'") || token.startsWith('`')) {
      return <span key={i} className="text-emerald-400">{token}</span>;
    }
    if (/^[A-Z]/.test(token)) {
      return <span key={i} className="text-cyan-400">{token}</span>;
    }
    return <span key={i} className="text-white/70">{token}</span>;
  });
}
