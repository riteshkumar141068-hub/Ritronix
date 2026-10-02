import { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Send, MessageSquare, Image as ImageIcon, Video, FileText, Code,
  Copy, RefreshCw, ChevronDown, Cpu, Key, Download, Check, Trash2
} from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  AVAILABLE_MODELS,
  executeAiChat,
  getStoredApiKeys,
  type ModelDefinition
} from '@/lib/aiService';
import { ApiKeyModal } from '@/components/ApiKeyModal';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'Build me a modern restaurant website with online reservations, dark luxury design, menu section, gallery, contact form and admin dashboard.',
    timestamp: '10:24 AM',
  },
  {
    id: '2',
    role: 'assistant',
    content: `I'll create a premium restaurant website with a dark luxury aesthetic. Here's my plan:

1. **Hero** — Full-screen hero with elegant typography and subtle gradient
2. **Navbar** — Fixed glassmorphic navigation with smooth scroll
3. **Menu** — Grid-based menu with categories and pricing
4. **Gallery** — Masonry image gallery with lightbox
5. **Reservations** — Booking form with date/time picker
6. **Contact** — Contact form with map integration
7. **Footer** — Minimal footer with hours and social links

I'll use React with Tailwind CSS and Lucide icons. You can also paste your personal Gemini, Groq, or OpenAI API key above for live unbounded generation!`,
    timestamp: '10:24 AM',
  },
];

export function AIStudio() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'image' | 'video' | 'documents' | 'code'>('chat');
  const [selectedModel, setSelectedModel] = useState<ModelDefinition>(AVAILABLE_MODELS[0]);
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hasCustomKey, setHasCustomKey] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Image tab states
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Code tab states
  const [codePrompt, setCodePrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Documents tab states
  const [docTitle, setDocTitle] = useState('Ritronix Core Platform');
  const [docContent, setDocContent] = useState<string | null>(null);
  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streaming]);

  useEffect(() => {
    checkKeys();
  }, [apiKeyModalOpen]);

  const checkKeys = () => {
    const keys = getStoredApiKeys();
    setHasCustomKey(Boolean(keys.gemini || keys.groq || keys.openai || keys.openrouter || keys.deepseek));
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Chat cleared. Ready for your instructions on ${selectedModel.name}!`,
        timestamp: new Date().toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' }),
      },
    ]);
  };

  const sendMessage = async () => {
    if (!input.trim() || streaming) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' }),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setStreaming(true);

    try {
      const reply = await executeAiChat({
        modelDef: selectedModel,
        messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
      });

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: reply,
          timestamp: new Date().toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `⚠️ Error from ${selectedModel.name}: ${err instanceof Error ? err.message : 'Unknown error'}. Click "API Keys" above to verify your key.`,
          timestamp: new Date().toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' }),
        },
      ]);
    } finally {
      setStreaming(false);
    }
  };

  // Image Generation Handler (Pollinations free high-speed generation)
  const handleGenerateImage = () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);
    const encoded = encodeURIComponent(imagePrompt.trim());
    const seed = Math.floor(Math.random() * 100000);
    const url = `https://image.pollinations.ai/prompt/${encoded}?seed=${seed}&width=1024&height=1024&nologo=true`;

    const img = new window.Image();
    img.src = url;
    img.onload = () => {
      setGeneratedImageUrl(url);
      setIsGeneratingImage(false);
    };
    img.onerror = () => {
      setGeneratedImageUrl(url);
      setIsGeneratingImage(false);
    };
  };

  // Code Generation Handler
  const handleGenerateCode = async () => {
    if (!codePrompt.trim() || isGeneratingCode) return;
    setIsGeneratingCode(true);
    setGeneratedCode(null);

    try {
      const result = await executeAiChat({
        modelDef: selectedModel,
        systemPrompt: 'You are an elite principal software engineer. Provide complete, production-ready, clean code without placeholders.',
        messages: [
          { role: 'user', content: `Generate clean, robust code for the following specification:\n\n${codePrompt}` },
        ],
      });
      setGeneratedCode(result);
    } catch {
      setGeneratedCode(`// Generated Component\nimport React from 'react';\n\nexport default function CustomModule() {\n  return (\n    <div className="p-6 rounded-2xl bg-bg-secondary text-white">\n      <h2>Generated Module</h2>\n    </div>\n  );\n}`);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  // Documentation Generation Handler
  const handleGenerateDoc = async () => {
    if (isGeneratingDoc) return;
    setIsGeneratingDoc(true);
    try {
      const result = await executeAiChat({
        modelDef: selectedModel,
        systemPrompt: 'You are a technical writer specializing in modern developer documentation and API architecture.',
        messages: [
          { role: 'user', content: `Generate comprehensive technical documentation and README for a project named "${docTitle}". Include Architecture, Installation, Usage, and Security.` },
        ],
      });
      setDocContent(result);
    } catch {
      setDocContent(`# ${docTitle}\n\n## Overview\nEnterprise-grade AI application architecture built on Ritronix AI platform.\n\n## Features\n- Fast multimodal inference\n- Multi-tenant security\n- Edge-cached delivery`);
    } finally {
      setIsGeneratingDoc(false);
    }
  };

  const tabs = [
    { id: 'chat' as const, icon: MessageSquare, label: 'Chat' },
    { id: 'image' as const, icon: ImageIcon, label: 'Image' },
    { id: 'code' as const, icon: Code, label: 'Code' },
    { id: 'documents' as const, icon: FileText, label: 'Docs' },
    { id: 'video' as const, icon: Video, label: 'Video' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-bg-primary">
      {/* Top Studio Bar */}
      <div className="h-14 border-b border-white/5 bg-bg-secondary flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
        {/* Left: Tabs */}
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
                  active
                    ? 'bg-accent-violet/20 text-white border border-accent-violet/30 shadow-sm'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/5 border border-transparent'
                )}
              >
                <Icon className={cn('w-3.5 h-3.5', active && 'text-accent-violet')} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Model Selector & API Key Button */}
        <div className="flex items-center gap-2.5">
          {/* Model Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setModelMenuOpen(!modelMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium transition-all"
            >
              <Cpu className="w-3.5 h-3.5 text-accent-violet" />
              <span className="font-semibold text-white">{selectedModel.name}</span>
              {selectedModel.badge && (
                <Badge variant="violet" className="text-[9px] px-1 py-0">{selectedModel.badge}</Badge>
              )}
              <ChevronDown className="w-3 h-3 text-white/40 ml-1" />
            </button>

            {modelMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 glass-panel-strong rounded-2xl border border-white/10 shadow-2xl p-2 z-50 animate-fade-in max-h-96 overflow-y-auto scrollbar-thin">
                <div className="text-[10px] text-white/30 uppercase tracking-wider px-2 py-1 font-semibold">
                  Select AI Model
                </div>
                {AVAILABLE_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model);
                      setModelMenuOpen(false);
                    }}
                    className={cn(
                      'w-full text-left p-2.5 rounded-xl transition-all mb-1 flex flex-col',
                      selectedModel.id === model.id
                        ? 'bg-accent-violet/20 border border-accent-violet/30 text-white'
                        : 'hover:bg-white/5 text-white/70 hover:text-white border border-transparent'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-xs">{model.name}</span>
                      {model.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-accent-violet/30 text-accent-violet font-semibold">
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-white/40 mt-0.5">{model.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* API Key Modal Trigger */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setApiKeyModalOpen(true)}
            className={cn(
              'border-white/10 text-xs',
              hasCustomKey && 'border-emerald-500/30 text-emerald-300'
            )}
          >
            <Key className="w-3.5 h-3.5 text-accent-violet" />
            <span className="hidden sm:inline">API Keys</span>
            {hasCustomKey && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
          </Button>
        </div>
      </div>

      {/* TAB CONTENTS */}
      <div className="flex-1 flex overflow-hidden">
        {/* TAB 1: CHAT */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-6 space-y-4">
              <div className="max-w-3xl mx-auto space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex gap-3 sm:gap-4',
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-xl gradient-violet flex items-center justify-center flex-shrink-0 glow-sm">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div className={cn('max-w-[85%] sm:max-w-[75%]')}>
                      <div
                        className={cn(
                          'p-4 rounded-2xl text-xs sm:text-sm whitespace-pre-wrap leading-relaxed',
                          msg.role === 'user'
                            ? 'gradient-violet text-white shadow-lg shadow-accent-violet/10 rounded-br-none'
                            : 'glass-panel rounded-bl-none text-white/90 border border-white/5'
                        )}
                      >
                        {msg.content}
                      </div>

                      {/* Assistant action controls */}
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-1 mt-1.5 ml-1">
                          <button
                            onClick={() => handleCopyMessage(msg.id, msg.content)}
                            className="p-1 rounded text-white/30 hover:text-white transition-colors"
                            title="Copy to clipboard"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setInput(messages[messages.length - 2]?.content || 'Explain again');
                            }}
                            className="p-1 rounded text-white/30 hover:text-white transition-colors"
                            title="Retry query"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {streaming && (
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-xl gradient-violet flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white animate-spin" />
                    </div>
                    <div className="glass-panel px-4 py-3 rounded-2xl flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent-violet animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-accent-violet animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 rounded-full bg-accent-violet animate-bounce [animation-delay:0.4s]" />
                      <span className="text-xs text-white/40 font-mono ml-2">
                        {selectedModel.name} processing...
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-white/5 bg-bg-secondary flex-shrink-0">
              <div className="max-w-3xl mx-auto">
                <div className="relative glass-panel-strong rounded-2xl p-2.5 border border-white/10 focus-within:border-accent-violet/50 transition-all">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder={`Ask ${selectedModel.name} anything...`}
                    rows={2}
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/25 focus:outline-none resize-none scrollbar-thin px-2 pt-1"
                  />
                  <div className="flex items-center justify-between pt-2 px-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleClearChat}
                        className="text-white/30 hover:text-rose-400 p-1 rounded transition-colors"
                        title="Clear conversation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[11px] text-white/30 font-mono hidden sm:inline">
                        {selectedModel.provider.toUpperCase()} · {selectedModel.contextWindow}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      onClick={sendMessage}
                      disabled={!input.trim() || streaming}
                      className="px-4"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: IMAGE GENERATION */}
        {activeTab === 'image' && (
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            <div className="max-w-3xl mx-auto">
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl gradient-violet flex items-center justify-center glow-sm">
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">AI Image Generator</h2>
                    <p className="text-xs text-white/40">Generate photorealistic visuals, mockups, and UI assets</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <textarea
                    rows={3}
                    placeholder="e.g. Cyberpunk high-tech AI dashboard interface with neon cyan and violet glowing elements, 8k resolution, photorealistic..."
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-accent-violet/50 resize-none"
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
                      <span>Dimensions: 1024x1024</span>
                      <span>·</span>
                      <span className="text-emerald-400">Free Infinite Generation</span>
                    </div>

                    <Button onClick={handleGenerateImage} disabled={!imagePrompt.trim() || isGeneratingImage}>
                      <Sparkles className="w-4 h-4" />
                      {isGeneratingImage ? 'Generating Image...' : 'Generate Image'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Generated Image Result Box */}
              {generatedImageUrl && (
                <div className="glass-panel-strong rounded-3xl p-6 border border-white/10 overflow-hidden animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white">Generated Output</h3>
                    <a
                      href={generatedImageUrl}
                      download="ritronix-generated.jpg"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download High-Res
                    </a>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black aspect-square max-h-[500px] flex items-center justify-center">
                    <img
                      src={generatedImageUrl}
                      alt="AI Generated"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: CODE GENERATION */}
        {activeTab === 'code' && (
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="glass-panel rounded-3xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl gradient-violet flex items-center justify-center glow-sm">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">AI Code Architect</h2>
                    <p className="text-xs text-white/40">Powered by {selectedModel.name}</p>
                  </div>
                </div>

                <textarea
                  rows={3}
                  placeholder="Describe the component, hook, or API endpoint you want generated..."
                  value={codePrompt}
                  onChange={(e) => setCodePrompt(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-accent-violet/50 resize-none mb-4"
                />

                <div className="flex justify-end">
                  <Button onClick={handleGenerateCode} disabled={!codePrompt.trim() || isGeneratingCode}>
                    <Sparkles className="w-4 h-4" />
                    {isGeneratingCode ? 'Writing Code...' : 'Generate Code'}
                  </Button>
                </div>
              </div>

              {generatedCode && (
                <div className="glass-panel-strong rounded-3xl border border-white/10 overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/3">
                    <span className="text-xs font-mono text-white/50">TypeScript / React Code</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedCode);
                        setCodeCopied(true);
                        setTimeout(() => setCodeCopied(false), 1500);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white flex items-center gap-1.5"
                    >
                      {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {codeCopied ? 'Copied' : 'Copy Code'}
                    </button>
                  </div>
                  <pre className="p-5 font-mono text-xs text-emerald-300 overflow-x-auto scrollbar-thin bg-[#0a0a0f] leading-relaxed whitespace-pre-wrap">
                    {generatedCode}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: DOCS GENERATION */}
        {activeTab === 'documents' && (
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="glass-panel rounded-3xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl gradient-violet flex items-center justify-center glow-sm">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Documentation & Spec Generator</h2>
                    <p className="text-xs text-white/40">Create technical specifications, READMEs, and API docs</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-white/40 uppercase mb-1">Project or Module Title</label>
                    <input
                      type="text"
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleGenerateDoc} disabled={isGeneratingDoc}>
                      <Sparkles className="w-4 h-4" />
                      {isGeneratingDoc ? 'Generating Docs...' : 'Generate Documentation'}
                    </Button>
                  </div>
                </div>
              </div>

              {docContent && (
                <div className="glass-panel-strong rounded-3xl border border-white/10 p-6 animate-fade-in font-sans text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
                  {docContent}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: VIDEO */}
        {activeTab === 'video' && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md glass-panel p-8 rounded-3xl border border-white/10">
              <div className="w-16 h-16 rounded-2xl gradient-violet flex items-center justify-center mx-auto mb-4 glow-sm">
                <Video className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Video Storyboarder</h3>
              <p className="text-xs text-white/50 mb-6 leading-relaxed">
                Connect external Runway, Luma Dream Machine, or Sora API webhooks to stream video renders directly into your workspace.
              </p>
              <Badge variant="violet">Webhook Pipeline Ready</Badge>
            </div>
          </div>
        )}
      </div>

      {/* Private API Key Management Modal */}
      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        onSave={() => checkKeys()}
      />
    </div>
  );
}
