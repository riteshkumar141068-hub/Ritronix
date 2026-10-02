import { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Check, X, Shield, ExternalLink, Sparkles } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { getStoredApiKeys, saveStoredApiKeys, type UserApiKeys } from '@/lib/aiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export function ApiKeyModal({ isOpen, onClose, onSave }: ApiKeyModalProps) {
  const [keys, setKeys] = useState<UserApiKeys>({});
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setKeys(getStoredApiKeys());
      setSavedMessage(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleVisibility = (provider: string) => {
    setVisible((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleSave = () => {
    saveStoredApiKeys(keys);
    setSavedMessage(true);
    if (onSave) onSave();
    setTimeout(() => {
      setSavedMessage(false);
      onClose();
    }, 1200);
  };

  const handleClearAll = () => {
    const empty = {};
    saveStoredApiKeys(empty);
    setKeys(empty);
    if (onSave) onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl glass-panel-strong rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-violet flex items-center justify-center text-white glow-sm">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Private AI API Keys</h2>
                <Badge variant="violet" className="text-[10px]">Client-Side Only</Badge>
              </div>
              <p className="text-xs text-white/40">Paste your keys below to chat with any model directly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice */}
        <div className="px-6 py-3 bg-accent-violet/10 border-b border-accent-violet/15 flex items-center gap-2.5 text-xs text-violet-200">
          <Shield className="w-4 h-4 flex-shrink-0 text-accent-violet" />
          <span>
            <strong>100% Private & Local:</strong> Keys are stored directly in your browser's local storage. They are never sent to any backend server.
          </span>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto scrollbar-thin space-y-4 flex-1">
          {/* Google Gemini */}
          <div className="p-4 rounded-2xl bg-white/3 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">Google Gemini</span>
                {keys.gemini && <Badge variant="success" className="text-[10px]">Active</Badge>}
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-accent-violet hover:underline flex items-center gap-1"
              >
                Get Free Gemini Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <input
                type={visible.gemini ? 'text' : 'password'}
                placeholder="AIzaSy..."
                value={keys.gemini || ''}
                onChange={(e) => setKeys({ ...keys, gemini: e.target.value.trim() })}
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-accent-violet/50"
              />
              <button
                type="button"
                onClick={() => toggleVisibility('gemini')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                {visible.gemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-white/30">Powers Gemini 2.0 Flash, Gemini 1.5 Pro, and Gemini 1.5 Flash.</p>
          </div>

          {/* Groq */}
          <div className="p-4 rounded-2xl bg-white/3 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">Groq Cloud</span>
                {keys.groq && <Badge variant="success" className="text-[10px]">Active</Badge>}
              </div>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-accent-violet hover:underline flex items-center gap-1"
              >
                Get Free Groq Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <input
                type={visible.groq ? 'text' : 'password'}
                placeholder="gsk_..."
                value={keys.groq || ''}
                onChange={(e) => setKeys({ ...keys, groq: e.target.value.trim() })}
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-accent-violet/50"
              />
              <button
                type="button"
                onClick={() => toggleVisibility('groq')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                {visible.groq ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-white/30">Ultra-fast inference (300+ t/s) for Llama 3.3 70B & DeepSeek R1 Distill.</p>
          </div>

          {/* OpenAI */}
          <div className="p-4 rounded-2xl bg-white/3 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">OpenAI</span>
                {keys.openai && <Badge variant="success" className="text-[10px]">Active</Badge>}
              </div>
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-accent-violet hover:underline flex items-center gap-1"
              >
                OpenAI Dashboard <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <input
                type={visible.openai ? 'text' : 'password'}
                placeholder="sk-proj-..."
                value={keys.openai || ''}
                onChange={(e) => setKeys({ ...keys, openai: e.target.value.trim() })}
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-accent-violet/50"
              />
              <button
                type="button"
                onClick={() => toggleVisibility('openai')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                {visible.openai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-white/30">Enables GPT-4o and GPT-4o Mini.</p>
          </div>

          {/* OpenRouter & DeepSeek */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white/3 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">OpenRouter</span>
                {keys.openrouter && <Badge variant="success" className="text-[10px]">Active</Badge>}
              </div>
              <div className="relative">
                <input
                  type={visible.openrouter ? 'text' : 'password'}
                  placeholder="sk-or-v1-..."
                  value={keys.openrouter || ''}
                  onChange={(e) => setKeys({ ...keys, openrouter: e.target.value.trim() })}
                  className="w-full px-3 py-2 pr-8 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-accent-violet/50"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility('openrouter')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {visible.openrouter ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/3 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">DeepSeek</span>
                {keys.deepseek && <Badge variant="success" className="text-[10px]">Active</Badge>}
              </div>
              <div className="relative">
                <input
                  type={visible.deepseek ? 'text' : 'password'}
                  placeholder="sk-..."
                  value={keys.deepseek || ''}
                  onChange={(e) => setKeys({ ...keys, deepseek: e.target.value.trim() })}
                  className="w-full px-3 py-2 pr-8 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-accent-violet/50"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility('deepseek')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {visible.deepseek ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Custom Endpoint / Ollama */}
          <div className="p-4 rounded-2xl bg-white/3 border border-white/5 space-y-2">
            <span className="text-sm font-semibold text-white">Custom Endpoint (Ollama / Local / vLLM)</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Endpoint URL (e.g. http://localhost:11434/v1)"
                value={keys.customEndpoint || ''}
                onChange={(e) => setKeys({ ...keys, customEndpoint: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-accent-violet/50"
              />
              <input
                type="text"
                placeholder="Model Name (e.g. llama3.2)"
                value={keys.customModel || ''}
                onChange={(e) => setKeys({ ...keys, customModel: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-accent-violet/50"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between bg-bg-secondary">
          <Button variant="ghost" size="sm" onClick={handleClearAll} className="text-rose-400 hover:text-rose-300">
            Clear All
          </Button>

          <div className="flex items-center gap-3">
            {savedMessage && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 animate-fade-in font-medium">
                <Check className="w-4 h-4" />
                Saved Privately!
              </span>
            )}
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} className="min-w-[100px]">
              <Sparkles className="w-4 h-4" />
              Save Keys
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
