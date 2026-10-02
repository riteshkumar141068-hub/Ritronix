import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const sizes = {
    sm: { box: 'w-7 h-7', text: 'text-base', icon: 14 },
    md: { box: 'w-9 h-9', text: 'text-lg', icon: 18 },
    lg: { box: 'w-12 h-12', text: 'text-2xl', icon: 24 },
  };
  const s = sizes[size];

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center rounded-xl gradient-violet glow-sm',
          s.box
        )}
      >
        <svg
          width={s.icon}
          height={s.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
        </svg>
      </div>
      {showText && (
        <span className={cn('font-bold tracking-tight text-white', s.text)}>
          Ritronix<span className="text-accent-violet"> Ai</span>
        </span>
      )}
    </div>
  );
}

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  title?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  type = 'button',
  disabled,
  title,
}: ButtonProps) {
  const variants = {
    primary:
      'gradient-violet text-white hover:opacity-90 shadow-lg shadow-accent-violet/20',
    secondary: 'bg-white/10 text-white hover:bg-white/15 border border-white/10',
    ghost: 'text-white/70 hover:text-white hover:bg-white/5',
    outline:
      'border border-white/15 text-white hover:bg-white/5 hover:border-white/25',
  };
  const sizes = {
    sm: 'px-3.5 py-1.5 text-sm rounded-lg',
    md: 'px-5 py-2.5 text-sm rounded-xl',
    lg: 'px-7 py-3.5 text-base rounded-xl',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'font-medium transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </button>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'violet';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-white/8 text-white/60 border-white/10',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    error: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
    info: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
    violet: 'bg-accent-violet/15 text-accent-violet border-accent-violet/20',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'elevated-panel rounded-2xl',
        hover && 'transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-black/40 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return (
    <div
      className={cn(
        'border-2 border-white/10 border-t-accent-violet rounded-full animate-spin',
        sizes[size]
      )}
    />
  );
}
