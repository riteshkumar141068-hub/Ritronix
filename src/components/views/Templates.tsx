import { useState } from 'react';
import {
  Layout, UtensilsCrossed, BarChart3, ShoppingBag, Briefcase,
  FileText, Calendar, MessageSquare, Megaphone, Settings,
  Users, BookOpen, Star, ArrowRight, Search,
} from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { mockTemplates } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import type { View } from '@/types';

const iconMap: Record<string, typeof Layout> = {
  Layout, UtensilsCrossed, BarChart3, ShoppingBag, Briefcase,
  FileText, Calendar, MessageSquare, Megaphone, Settings, Users, BookOpen,
};

interface TemplatesProps {
  onNavigate: (view: View) => void;
}

export function Templates({ onNavigate }: TemplatesProps) {
  const [category, setCategory] = useState('all');
  const categories = ['all', ...Array.from(new Set(mockTemplates.map((t) => t.category)))];
  const filtered = category === 'all' ? mockTemplates : mockTemplates.filter((t) => t.category === category);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Templates</h1>
          <p className="text-sm text-white/40">Start from a pre-built template</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all',
                  category === cat ? 'bg-accent-violet/15 text-accent-violet border border-accent-violet/20' : 'text-white/40 hover:text-white/60 hover:bg-white/5 border border-transparent'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
            <input
              placeholder="Search templates..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-accent-violet/30 w-44"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((template) => {
            const Icon = iconMap[template.icon] ?? Layout;
            return (
              <Card key={template.id} hover onClick={() => onNavigate('app-builder')} className="p-5 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent-violet/20 to-accent-cyan/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent-violet" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-white/30">
                    <Star className="w-3 h-3 text-amber-400" />
                    {template.popularity}
                  </div>
                </div>
                <h3 className="font-semibold text-sm mb-1 group-hover:text-accent-violet transition-colors">{template.name}</h3>
                <p className="text-xs text-white/40 mb-4 line-clamp-2">{template.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="default">{template.category}</Badge>
                  <span className="text-xs text-accent-violet flex items-center gap-1 group-hover:gap-2 transition-all">
                    Use Template <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
