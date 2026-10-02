import type { Project, FileNode, Agent, Deployment, Template, Integration, ChatMessage } from '@/types';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Aurora Restaurant',
    description: 'Dark luxury restaurant website with reservations and menu',
    type: 'website',
    status: 'deployed',
    framework: 'Next.js + Tailwind',
    thumbnail: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    updatedAt: '2 hours ago',
    url: 'aurora-restaurant.vercel.app',
  },
  {
    id: '2',
    name: 'Nexus SaaS Landing',
    description: 'Premium SaaS landing page for AI productivity platform',
    type: 'website',
    status: 'building',
    framework: 'Vite + React',
    thumbnail: 'linear-gradient(135deg, #0f0c29, #302b63)',
    updatedAt: '5 hours ago',
  },
  {
    id: '3',
    name: 'FlowDash Analytics',
    description: 'Real-time analytics dashboard with charts and KPIs',
    type: 'web-app',
    status: 'draft',
    framework: 'Next.js + Recharts',
    thumbnail: 'linear-gradient(135deg, #0d1117, #161b22)',
    updatedAt: '1 day ago',
  },
  {
    id: '4',
    name: 'ShopWave Store',
    description: 'E-commerce storefront with cart and checkout',
    type: 'web-app',
    status: 'deployed',
    framework: 'Next.js + Stripe',
    thumbnail: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
    updatedAt: '3 days ago',
    url: 'shopwave.vercel.app',
  },
  {
    id: '5',
    name: 'Portfolio Pro',
    description: 'Developer portfolio with project showcase',
    type: 'website',
    status: 'draft',
    framework: 'Vite + React',
    thumbnail: 'linear-gradient(135deg, #14141b, #1a1a24)',
    updatedAt: '1 week ago',
  },
  {
    id: '6',
    name: 'Lead Qualifier Bot',
    description: 'AI workflow for automated lead qualification',
    type: 'workflow',
    status: 'deployed',
    framework: 'Ritronix Workflow',
    thumbnail: 'linear-gradient(135deg, #0d0d12, #1a1a24)',
    updatedAt: '4 days ago',
  },
];

export const mockFileTree: FileNode[] = [
  {
    name: 'app',
    type: 'folder',
    path: 'app',
    children: [
      { name: 'layout.tsx', type: 'file', path: 'app/layout.tsx', language: 'typescript' },
      { name: 'page.tsx', type: 'file', path: 'app/page.tsx', language: 'typescript' },
      {
        name: 'components',
        type: 'folder',
        path: 'app/components',
        children: [
          { name: 'Hero.tsx', type: 'file', path: 'app/components/Hero.tsx', language: 'typescript' },
          { name: 'Navbar.tsx', type: 'file', path: 'app/components/Navbar.tsx', language: 'typescript' },
          { name: 'Menu.tsx', type: 'file', path: 'app/components/Menu.tsx', language: 'typescript' },
          { name: 'Reservations.tsx', type: 'file', path: 'app/components/Reservations.tsx', language: 'typescript' },
          { name: 'Gallery.tsx', type: 'file', path: 'app/components/Gallery.tsx', language: 'typescript' },
          { name: 'Footer.tsx', type: 'file', path: 'app/components/Footer.tsx', language: 'typescript' },
        ],
      },
    ],
  },
  {
    name: 'lib',
    type: 'folder',
    path: 'lib',
    children: [
      { name: 'utils.ts', type: 'file', path: 'lib/utils.ts', language: 'typescript' },
      { name: 'supabase.ts', type: 'file', path: 'lib/supabase.ts', language: 'typescript' },
    ],
  },
  { name: 'package.json', type: 'file', path: 'package.json', language: 'json' },
  { name: 'tsconfig.json', type: 'file', path: 'tsconfig.json', language: 'json' },
  { name: 'tailwind.config.ts', type: 'file', path: 'tailwind.config.ts', language: 'typescript' },
  { name: 'README.md', type: 'file', path: 'README.md', language: 'markdown' },
];

export const mockFileContent: Record<string, string> = {
  'app/page.tsx': `import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { Menu } from './components/Menu';
import { Reservations } from './components/Reservations';
import { Gallery } from './components/Gallery';
import { Footer } from './components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />
      <Hero />
      <Menu />
      <Gallery />
      <Reservations />
      <Footer />
    </main>
  );
}`,
  'app/components/Hero.tsx': `export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 to-transparent" />
      <div className="relative z-10 text-center px-6">
        <p className="text-amber-400/80 text-sm tracking-[0.3em] uppercase mb-6">
          Fine Dining · Est. 2024
        </p>
        <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-6">
          Aurora
        </h1>
        <p className="text-xl text-white/60 max-w-2xl mx-auto font-light">
          A modern dining experience where culinary artistry meets timeless elegance.
        </p>
      </div>
    </section>
  );
}`,
  'app/components/Navbar.tsx': `import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-black/40 border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <span className="text-xl font-light tracking-widest">AURORA</span>
        <div className="flex gap-8 text-sm text-white/70">
          <Link href="#menu">Menu</Link>
          <Link href="#gallery">Gallery</Link>
          <Link href="#reservations">Reservations</Link>
        </div>
        <button className="px-5 py-2 bg-amber-500/90 text-black rounded-full text-sm font-medium">
          Book a Table
        </button>
      </div>
    </nav>
  );
}`,
};

export const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Website SEO Agent',
    description: 'Analyzes and optimizes website content for search engines',
    category: 'Marketing',
    status: 'completed',
    icon: 'Search',
    tools: ['web_search', 'file_read', 'file_write', 'http_request'],
    maxSteps: 15,
    lastRun: '1 hour ago',
  },
  {
    id: '2',
    name: 'Lead Qualification Agent',
    description: 'Automatically qualifies and scores inbound leads',
    category: 'Sales',
    status: 'running',
    icon: 'UserCheck',
    tools: ['database_query', 'http_request', 'email_send'],
    maxSteps: 10,
    lastRun: '5 min ago',
  },
  {
    id: '3',
    name: 'Customer Support Agent',
    description: 'Handles customer inquiries with AI-powered responses',
    category: 'Support',
    status: 'idle',
    icon: 'Headphones',
    tools: ['web_search', 'http_request', 'email_send', 'database_query'],
    maxSteps: 20,
    lastRun: '3 hours ago',
  },
  {
    id: '4',
    name: 'Content Generator',
    description: 'Generates blog posts, social content, and marketing copy',
    category: 'Content',
    status: 'idle',
    icon: 'PenLine',
    tools: ['code_generate', 'web_search', 'file_write'],
    maxSteps: 12,
    lastRun: '1 day ago',
  },
  {
    id: '5',
    name: 'Web Research Agent',
    description: 'Conducts deep research on any topic with citations',
    category: 'Research',
    status: 'completed',
    icon: 'Globe',
    tools: ['web_search', 'http_request', 'file_write'],
    maxSteps: 25,
    lastRun: '6 hours ago',
  },
  {
    id: '6',
    name: 'Deployment Assistant',
    description: 'Manages deployment pipelines and monitors build health',
    category: 'DevOps',
    status: 'idle',
    icon: 'Rocket',
    tools: ['deploy_site', 'http_request', 'file_read'],
    maxSteps: 8,
    lastRun: '2 days ago',
  },
  {
    id: '7',
    name: 'Website Monitoring Agent',
    description: 'Monitors uptime, performance, and alerts on issues',
    category: 'DevOps',
    status: 'running',
    icon: 'Activity',
    tools: ['http_request', 'webhook_call', 'email_send'],
    maxSteps: 5,
    lastRun: '1 min ago',
  },
  {
    id: '8',
    name: 'Email Response Agent',
    description: 'Drafts and sends contextual email replies automatically',
    category: 'Communication',
    status: 'idle',
    icon: 'Mail',
    tools: ['email_send', 'file_read', 'web_search'],
    maxSteps: 10,
    lastRun: '12 hours ago',
  },
];

export const mockDeployments: Deployment[] = [
  {
    id: '1',
    projectName: 'Aurora Restaurant',
    provider: 'vercel',
    status: 'live',
    url: 'aurora-restaurant.vercel.app',
    duration: '42s',
    createdAt: '2 hours ago',
    commit: 'a3f9c2e',
  },
  {
    id: '2',
    projectName: 'ShopWave Store',
    provider: 'cloudflare',
    status: 'live',
    url: 'shopwave.pages.dev',
    duration: '1m 12s',
    createdAt: '3 days ago',
    commit: 'b7e1d4a',
  },
  {
    id: '3',
    projectName: 'Nexus SaaS Landing',
    provider: 'vercel',
    status: 'building',
    url: 'nexus-saas.vercel.app',
    duration: '—',
    createdAt: '5 hours ago',
    commit: 'c2a8f1b',
  },
  {
    id: '4',
    projectName: 'FlowDash Analytics',
    provider: 'netlify',
    status: 'failed',
    url: '—',
    duration: '—',
    createdAt: '1 day ago',
    commit: 'd5c3e9f',
  },
  {
    id: '5',
    projectName: 'Portfolio Pro',
    provider: 'github-pages',
    status: 'live',
    url: 'user.github.io/portfolio-pro',
    duration: '38s',
    createdAt: '1 week ago',
    commit: 'e9b2a7c',
  },
];

export const mockTemplates: Template[] = [
  { id: '1', name: 'SaaS Landing Page', description: 'Premium landing page with hero, features, pricing, and CTA', category: 'Landing', icon: 'Layout', popularity: 98 },
  { id: '2', name: 'Restaurant Website', description: 'Dark luxury restaurant with menu, gallery, and reservations', category: 'Business', icon: 'UtensilsCrossed', popularity: 85 },
  { id: '3', name: 'Analytics Dashboard', description: 'KPI cards, charts, tables, and activity feed', category: 'Dashboard', icon: 'BarChart3', popularity: 92 },
  { id: '4', name: 'E-commerce Store', description: 'Product grid, cart, checkout, and order management', category: 'E-commerce', icon: 'ShoppingBag', popularity: 89 },
  { id: '5', name: 'Portfolio Site', description: 'Developer portfolio with projects and skills showcase', category: 'Portfolio', icon: 'Briefcase', popularity: 76 },
  { id: '6', name: 'Blog Platform', description: 'MDX blog with syntax highlighting and RSS', category: 'Content', icon: 'FileText', popularity: 71 },
  { id: '7', name: 'Booking System', description: 'Appointment booking with calendar integration', category: 'Business', icon: 'Calendar', popularity: 68 },
  { id: '8', name: 'AI Chat App', description: 'ChatGPT-style conversational AI interface', category: 'AI', icon: 'MessageSquare', popularity: 94 },
  { id: '9', name: 'Marketing Site', description: 'High-converting marketing page with A/B test ready sections', category: 'Landing', icon: 'Megaphone', popularity: 82 },
  { id: '10', name: 'Admin Panel', description: 'Full admin dashboard with CRUD and user management', category: 'Dashboard', icon: 'Settings', popularity: 79 },
  { id: '11', name: 'Social Platform', description: 'Social feed with posts, likes, and comments', category: 'Web App', icon: 'Users', popularity: 65 },
  { id: '12', name: 'Documentation Site', description: 'Clean docs site with search and sidebar navigation', category: 'Content', icon: 'BookOpen', popularity: 73 },
];

export const mockIntegrations: Integration[] = [
  { id: '1', name: 'GitHub', category: 'Version Control', status: 'connected', icon: 'Github', description: 'Connect repositories, commit changes, and manage branches' },
  { id: '2', name: 'Vercel', category: 'Deployment', status: 'connected', icon: 'Triangle', description: 'Deploy projects with edge network and custom domains' },
  { id: '3', name: 'Cloudflare', category: 'Deployment', status: 'disconnected', icon: 'Cloud', description: 'Deploy to Cloudflare Pages with global CDN' },
  { id: '4', name: 'Netlify', category: 'Deployment', status: 'disconnected', icon: 'Boxes', description: 'Continuous deployment with Netlify functions' },
  { id: '5', name: 'Google Gemini', category: 'AI Provider', status: 'connected', icon: 'Sparkles', description: 'Google Gemini AI for chat and code generation' },
  { id: '6', name: 'Groq', category: 'AI Provider', status: 'connected', icon: 'Zap', description: 'Ultra-fast inference with Groq accelerators' },
  { id: '7', name: 'HuggingFace', category: 'AI Provider', status: 'disconnected', icon: 'Flower2', description: 'Access open-source models via HuggingFace API' },
  { id: '8', name: 'Ollama', category: 'AI Provider', status: 'disconnected', icon: 'Brain', description: 'Run AI models locally with Ollama' },
  { id: '9', name: 'Resend', category: 'Email', status: 'disconnected', icon: 'Mail', description: 'Send transactional and marketing emails' },
  { id: '10', name: 'Supabase', category: 'Database', status: 'connected', icon: 'Database', description: 'PostgreSQL database with auth and storage' },
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'Build me a modern restaurant website with online reservations, dark luxury design, menu section, gallery, contact form and admin dashboard.',
    timestamp: '10:24 AM',
  },
  {
    id: '2',
    role: 'assistant',
    content: "I'll create a premium restaurant website with a dark luxury aesthetic. Here's my plan:\n\n1. **Hero** — Full-screen hero with elegant typography and subtle gradient\n2. **Navbar** — Fixed glassmorphic navigation with smooth scroll\n3. **Menu** — Grid-based menu with categories and pricing\n4. **Gallery** — Masonry image gallery with lightbox\n5. **Reservations** — Booking form with date/time picker\n6. **Contact** — Contact form with map integration\n7. **Footer** — Minimal footer with hours and social links\n\nI'll use Next.js with Tailwind CSS. Generating project files now...",
    timestamp: '10:24 AM',
  },
  {
    id: '3',
    role: 'user',
    content: 'Make the hero section more premium with a subtle animation.',
    timestamp: '10:31 AM',
  },
  {
    id: '4',
    role: 'assistant',
    content: "I'll enhance the hero with:\n- Animated gradient background with slow drift\n- Fade-in text on load with staggered timing\n- Subtle parallax on scroll\n- Gold accent line under the title\n\nUpdating `Hero.tsx` now...",
    timestamp: '10:31 AM',
  },
];

export const mockTerminalLogs = [
  { type: 'info', text: '$ npm install' },
  { type: 'success', text: 'added 247 packages in 8s' },
  { type: 'info', text: '$ npm run build' },
  { type: 'info', text: '  ▲ Next.js 14.2.4' },
  { type: 'info', text: '  Creating an optimized production build...' },
  { type: 'success', text: '  ✓ Compiled successfully' },
  { type: 'success', text: '  ✓ Linting and checking validity' },
  { type: 'success', text: '  ✓ Collecting page data' },
  { type: 'success', text: '  ✓ Generating static pages (6/6)' },
  { type: 'info', text: '  Route (app)                              Size     First Load' },
  { type: 'info', text: '  ┌ ○ /                                    2.3 kB         89 kB' },
  { type: 'info', text: '  └ ○ /admin                               3.1 kB        102 kB' },
  { type: 'success', text: '  ✓ Build completed in 42s' },
];
