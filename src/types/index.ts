export type View =
  | 'landing'
  | 'auth'
  | 'dashboard'
  | 'projects'
  | 'ai-studio'
  | 'app-builder'
  | 'workflow-builder'
  | 'agents'
  | 'deployments'
  | 'domains'
  | 'analytics'
  | 'templates'
  | 'integrations'
  | 'settings';

export interface Project {
  id: string;
  name: string;
  description: string;
  type: 'website' | 'web-app' | 'api' | 'workflow';
  status: 'draft' | 'building' | 'deployed' | 'failed';
  framework: string;
  thumbnail: string;
  updatedAt: string;
  url?: string;
}

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  language?: string;
  content?: string;
  children?: FileNode[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  streaming?: boolean;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  icon: string;
  tools: string[];
  maxSteps: number;
  lastRun?: string;
}

export interface Deployment {
  id: string;
  projectName: string;
  provider: 'vercel' | 'cloudflare' | 'netlify' | 'github-pages';
  status: 'queued' | 'building' | 'deploying' | 'live' | 'failed';
  url: string;
  duration: string;
  createdAt: string;
  commit: string;
}

export interface WorkflowNode {
  id: string;
  type: string;
  label: string;
  category: 'trigger' | 'ai' | 'logic' | 'integration' | 'output';
  position: { x: number; y: number };
  config?: Record<string, unknown>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  popularity: number;
}

export interface Integration {
  id: string;
  name: string;
  category: string;
  status: 'connected' | 'disconnected';
  icon: string;
  description: string;
}
