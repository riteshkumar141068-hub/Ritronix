import { useEffect, useState } from 'react';
import {
  Sparkles, Zap, Code2, Layout, Rocket, Workflow, Bot, Globe,
  ArrowRight, Check, Terminal, MessageSquare, GitBranch, Cloud,
  ChevronRight, Cpu, Layers, Shield, Play, Menu, X,
} from 'lucide-react';
import { Logo, Button, Badge } from '@/components/ui';
import { ParticleBackground } from '@/components/ParticleBackground';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export function LandingPage({ onGetStarted, onSignIn }: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const features = [
    { icon: Code2, title: 'Prompt-to-App Generation', desc: 'Describe what you want in plain English. Ritronix Ai generates structured project files, components, and full-stack code — not one giant blob.' },
    { icon: Layout, title: 'Visual Builder', desc: 'Drag-and-drop visual editing with live synchronization. Changes in the visual editor update the code, and code changes update the preview.' },
    { icon: Workflow, title: 'Workflow Automation', desc: 'Build n8n-inspired visual workflows with triggers, AI nodes, conditions, and integrations. Connect anything to everything.' },
    { icon: Bot, title: 'AI Agent Engine', desc: 'Deploy stateful agents with tool access, budget controls, approval gates, and audit logs. Full control over autonomous execution.' },
    { icon: Rocket, title: 'One-Click Deploy', desc: 'Deploy to Vercel, Cloudflare, Netlify, or GitHub Pages with a single click. View build logs, manage domains, and rollback instantly.' },
    { icon: MessageSquare, title: 'AI Copilot', desc: 'Chat with AI that understands your project context. Highlight code, ask for fixes, request refactors, and get structured patches.' },
  ];

  const stats = [
    { value: '50K+', label: 'Projects Built' },
    { value: '120+', label: 'AI Agents Running' },
    { value: '99.9%', label: 'Uptime' },
    { value: '4 Providers', label: 'Deploy Targets' },
  ];

  const providers = ['Vercel', 'Cloudflare', 'Netlify', 'GitHub Pages', 'Supabase', 'Gemini', 'Groq', 'Ollama'];

  return (
    <div className="min-h-screen bg-bg-primary text-white overflow-x-hidden">
      {/* Nav */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-panel-strong py-3' : 'py-5 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
          <Logo />
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#workflow" className="hover:text-white transition-colors">Workflows</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onSignIn}>Sign In</Button>
            <Button size="sm" onClick={onGetStarted}>
              Start Building Free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 text-white/80 hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-panel-strong border-b border-white/10 px-6 py-4 space-y-3 animate-fade-in">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-white/70 hover:text-white py-1"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-white/70 hover:text-white py-1"
            >
              How It Works
            </a>
            <a
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-white/70 hover:text-white py-1"
            >
              Workflows
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-white/70 hover:text-white py-1"
            >
              Pricing
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignIn();
                }}
              >
                Sign In
              </Button>
              <Button
                size="sm"
                className="w-full justify-center"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGetStarted();
                }}
              >
                Start Building Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/50 to-bg-primary" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-violet/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[120px]" />
        <ParticleBackground />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-accent-violet" />
            <span className="text-sm text-white/70">AI-Native Development Platform</span>
            <Badge variant="violet">New</Badge>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-balance animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Your AI-Powered
            <br />
            <span className="gradient-text">Software Studio</span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed mb-10 text-balance animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Design websites, generate applications, automate workflows, and deploy
            production-ready projects from one intelligent workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button size="lg" onClick={onGetStarted} className="w-full sm:w-auto">
              <Sparkles className="w-5 h-5" />
              Start Building Free
            </Button>
            <Button variant="outline" size="lg" onClick={onSignIn} className="w-full sm:w-auto">
              <Play className="w-5 h-5" />
              Explore Demo
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold gradient-text">{s.value}</div>
                <div className="text-sm text-white/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Preview Mock */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="violet" className="mb-4">The Workspace</Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Everything in one <span className="gradient-text">intelligent workspace</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Move between AI Chat, Visual Builder, Code Editor, Live Preview, Workflow Builder,
              and Deployment without ever leaving your project.
            </p>
          </div>

          <ProductMockup />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="violet" className="mb-4">Capabilities</Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Built for <span className="gradient-text">serious builders</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              A complete platform that combines the best of Lovable, Bolt, Replit, v0, n8n, and more.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`group glass-panel rounded-2xl p-6 transition-all duration-300 cursor-pointer ${
                  activeFeature === i
                    ? 'border-accent-violet/60 shadow-xl shadow-accent-violet/10'
                    : 'hover:border-accent-violet/30 hover:shadow-xl hover:shadow-accent-violet/5'
                }`}
                onMouseEnter={() => setActiveFeature(i)}
              >
                <div className="w-12 h-12 rounded-xl gradient-violet flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="violet" className="mb-4">Workflow</Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              From prompt to <span className="gradient-text">production</span>
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent-violet/0 via-accent-violet/30 to-accent-violet/0 hidden md:block" />
            {[
              { icon: MessageSquare, title: 'Describe Your Vision', desc: 'Tell Ritronix Ai what you want to build in plain English. No technical specs required.' },
              { icon: Cpu, title: 'AI Generates the Project', desc: 'Structured files, components, dependencies, and configuration — generated with production quality.' },
              { icon: Code2, title: 'Edit Visually or in Code', desc: 'Switch between visual builder and Monaco code editor. Changes sync in real time.' },
              { icon: Rocket, title: 'Deploy with One Click', desc: 'Ship to Vercel, Cloudflare, Netlify, or GitHub Pages. Custom domains, SSL, and rollback built in.' },
            ].map((step, i) => (
              <div key={step.title} className={`relative flex gap-6 mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="hidden md:block flex-1" />
                <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full gradient-violet flex items-center justify-center z-10 glow-sm hidden md:flex">
                  <step.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 glass-panel rounded-2xl p-6 md:max-w-md">
                  <div className="flex items-center gap-3 mb-3 md:hidden">
                    <div className="w-10 h-10 rounded-full gradient-violet flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="text-xs text-accent-violet font-mono mb-2">STEP {i + 1}</div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="violet" className="mb-4">Automation</Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Visual <span className="gradient-text">workflow automation</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Build complex automations with a drag-and-drop node editor. Triggers, AI nodes,
              conditions, integrations, and outputs — all connected visually.
            </p>
          </div>

          <WorkflowMockup />
        </div>
      </section>

      {/* Provider Independence */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass-panel rounded-3xl p-10 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-violet/10 rounded-full blur-[100px]" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <Layers className="w-6 h-6 text-accent-violet" />
                <h2 className="text-3xl font-bold">Provider Independence</h2>
              </div>
              <p className="text-white/50 mb-8 max-w-2xl">
                Never locked into one provider. Swap AI models, deployment targets, and storage
                backends without rewriting your application.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  { icon: Cpu, title: 'AI Providers', items: ['Gemini', 'Groq', 'Ollama', 'HuggingFace', 'OpenAI-compatible'] },
                  { icon: Cloud, title: 'Deployment', items: ['Vercel', 'Cloudflare Pages', 'Netlify', 'GitHub Pages'] },
                  { icon: Shield, title: 'Storage', items: ['Supabase Storage', 'S3-compatible', 'Local storage'] },
                ].map((cat) => (
                  <div key={cat.title} className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
                      <cat.icon className="w-4 h-4 text-accent-violet" />
                      {cat.title}
                    </div>
                    {cat.items.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm text-white/50">
                        <Check className="w-4 h-4 text-emerald-400" />
                        {item}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                {providers.map((p) => (
                  <span key={p} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/40 font-mono">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="violet" className="mb-4">Pricing</Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Start free, <span className="gradient-text">scale when ready</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Start on the free tier with Gemini, Groq, and Supabase. Upgrade for more power when you need it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Free', price: '$0', period: 'forever', features: ['5 projects', 'AI chat (Gemini free tier)', 'Community templates', 'GitHub Pages deploy', '1 workspace'], cta: 'Start Free', highlight: false },
              { name: 'Pro', price: '$19', period: '/month', features: ['Unlimited projects', 'All AI providers', 'Priority builds', 'Vercel + Cloudflare deploy', 'Custom domains', 'AI agents (5 active)', 'Version history'], cta: 'Get Pro', highlight: true },
              { name: 'Team', price: '$49', period: '/month', features: ['Everything in Pro', '5 team members', 'Shared workspaces', 'Workflow automation', 'Unlimited agents', 'Audit logs', 'SSO ready'], cta: 'Get Team', highlight: false },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-7 ${plan.highlight ? 'gradient-border glass-panel-strong glow-sm' : 'glass-panel'}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="violet">Most Popular</Badge>
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-sm text-white/40">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-white/60">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.highlight ? 'primary' : 'outline'}
                  className="w-full"
                  onClick={onGetStarted}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative glass-panel rounded-3xl p-12 md:p-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-violet/10 via-transparent to-accent-cyan/10" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent-violet/15 rounded-full blur-[100px]" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
                Build. Automate.
                <br />
                <span className="gradient-text">Deploy. With AI.</span>
              </h2>
              <p className="text-white/50 max-w-xl mx-auto mb-10 text-lg">
                Start building your next project in seconds. No credit card required.
              </p>
              <Button size="lg" onClick={onGetStarted}>
                <Sparkles className="w-5 h-5" />
                Start Building Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-10">
            <div className="md:col-span-2">
              <Logo className="mb-4" />
              <p className="text-sm text-white/40 max-w-xs">
                The AI-native development platform for building, automating, and deploying software.
              </p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Templates', 'Integrations', 'Changelog'] },
              { title: 'Resources', links: ['Documentation', 'API Reference', 'Guides', 'Community', 'Blog'] },
              { title: 'Company', links: ['About', 'Privacy', 'Terms', 'Security', 'Contact'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold text-white/80 mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
            <p className="text-sm text-white/30">© 2026 Ritronix Ai. All rights reserved.</p>
            <div className="flex items-center gap-4 text-white/30">
              <span className="text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProductMockup() {
  return (
    <div className="relative">
      <div className="glass-panel-strong rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-bg-secondary">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/60" />
            <div className="w-3 h-3 rounded-full bg-amber-500/60" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
          </div>
          <div className="flex-1 flex justify-center">
            <span className="text-xs text-white/30 font-mono">aurora-restaurant.ritronix.ai</span>
          </div>
        </div>

        {/* IDE layout */}
        <div className="flex h-[440px] bg-bg-primary">
          {/* File tree */}
          <div className="w-44 border-r border-white/5 p-3 hidden md:block">
            <div className="text-xs text-white/30 font-mono mb-3 uppercase tracking-wider">Explorer</div>
            <div className="space-y-1 text-xs font-mono">
              {['app/', '  page.tsx', '  layout.tsx', 'components/', '  Hero.tsx', '  Navbar.tsx', '  Menu.tsx', 'lib/', '  utils.ts', 'package.json'].map((f, i) => (
                <div
                  key={f}
                  className={`px-2 py-1 rounded ${i === 4 ? 'bg-accent-violet/15 text-accent-violet' : 'text-white/40 hover:bg-white/5'}`}
                >
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Code editor */}
          <div className="flex-1 p-4 font-mono text-xs overflow-hidden hidden md:block">
            <div className="flex gap-4">
              <div className="text-white/20 select-none">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <div key={n} className="leading-6">{n}</div>
                ))}
              </div>
              <div className="flex-1 leading-6">
                <div className="text-rose-400">export function <span className="text-violet-400">Hero</span>() {'{'}</div>
                <div className="text-white/60">  return (</div>
                <div className="text-white/60">    {'<'}<span className="text-rose-400">section</span> <span className="text-cyan-400">className</span>=<span className="text-emerald-400">"relative"</span>{'>'}</div>
                <div className="text-white/60">      {'<'}<span className="text-rose-400">div</span> <span className="text-cyan-400">className</span>=<span className="text-emerald-400">"gradient"</span> /{'>'}</div>
                <div className="text-white/60">      {'<'}<span className="text-rose-400">h1</span>{'>'}<span className="text-amber-300">Aurora</span>{'</'}<span className="text-rose-400">h1</span>{'>'}</div>
                <div className="text-white/60">      {'<'}<span className="text-rose-400">p</span>{'>'}Fine dining...{'</'}<span className="text-rose-400">p</span>{'>'}</div>
                <div className="text-white/60">    {'</'}<span className="text-rose-400">section</span>{'>'}</div>
                <div className="text-white/60">  );</div>
                <div className="text-rose-400">{'}'}</div>
                <div className="h-3" />
                <div className="text-white/30">// AI suggestion: Add animated</div>
                <div className="text-white/30">// gradient background</div>
              </div>
            </div>
          </div>

          {/* AI Copilot */}
          <div className="w-56 border-l border-white/5 p-3 hidden lg:flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg gradient-violet flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-semibold">AI Copilot</span>
            </div>
            <div className="space-y-2 flex-1 overflow-hidden">
              <div className="text-xs text-white/40 bg-white/5 rounded-lg p-2.5">
                Make the hero more premium
              </div>
              <div className="text-xs text-white/60 bg-accent-violet/10 rounded-lg p-2.5 border border-accent-violet/20">
                I'll add an animated gradient, staggered text animation, and gold accent line...
              </div>
              <div className="flex items-center gap-1.5 text-xs text-accent-violet">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-violet animate-pulse" />
                Generating patch...
              </div>
            </div>
          </div>
        </div>

        {/* Terminal bar */}
        <div className="border-t border-white/5 px-4 py-2.5 bg-bg-secondary flex items-center gap-3 text-xs font-mono">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-white/40">npm run build</span>
          <span className="text-emerald-400">✓ Compiled in 42s</span>
          <div className="flex-1" />
          <Badge variant="success" className="hidden md:flex">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Live
          </Badge>
        </div>
      </div>

      {/* Floating glow accents */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent-violet/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent-cyan/10 rounded-full blur-[80px] pointer-events-none" />
    </div>
  );
}

function WorkflowMockup() {
  const nodes = [
    { icon: Globe, label: 'Webhook', sub: 'POST /hook', x: 5, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
    { icon: Bot, label: 'AI Agent', sub: 'Classify intent', x: 32, color: 'text-accent-violet bg-accent-violet/10 border-accent-violet/20' },
    { icon: GitBranch, label: 'Condition', sub: 'If lead_score > 7', x: 58, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { icon: MessageSquare, label: 'Send Email', sub: 'Welcome template', x: 85, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  ];

  return (
    <div className="glass-panel-strong rounded-2xl p-8 md:p-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 relative">
          {nodes.map((node, i) => (
            <div key={node.label} className="flex items-center gap-4 md:flex-1">
              <div className={`flex-1 rounded-xl border p-4 ${node.color} backdrop-blur-sm`}>
                <div className="flex items-center gap-2 mb-1">
                  <node.icon className="w-4 h-4" />
                  <span className="text-sm font-semibold text-white">{node.label}</span>
                </div>
                <div className="text-xs text-white/40 font-mono">{node.sub}</div>
              </div>
              {i < nodes.length - 1 && (
                <div className="hidden md:flex items-center">
                  <div className="w-8 h-px bg-gradient-to-r from-accent-violet/40 to-accent-violet/40" />
                  <ChevronRight className="w-4 h-4 text-accent-violet/40 -ml-1" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Zap, label: 'Triggers', count: '4 types' },
            { icon: Cpu, label: 'AI Nodes', count: '5 types' },
            { icon: GitBranch, label: 'Logic', count: '5 types' },
            { icon: Cloud, label: 'Integrations', count: '10+' },
          ].map((cat) => (
            <div key={cat.label} className="glass-panel rounded-xl p-4 text-center">
              <cat.icon className="w-5 h-5 text-accent-violet mx-auto mb-2" />
              <div className="text-sm font-semibold">{cat.label}</div>
              <div className="text-xs text-white/40">{cat.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
