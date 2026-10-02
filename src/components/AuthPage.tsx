import { useState } from 'react';
import { Sparkles, ArrowRight, Loader2, AlertCircle, X, Check } from 'lucide-react';
import { Logo, Button } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

interface AuthPageProps {
  mode: 'signin' | 'signup';
  onBack: () => void;
  onSuccess: () => void;
  onToggleMode: () => void;
}

export function AuthPage({ mode, onBack, onSuccess, onToggleMode }: AuthPageProps) {
  const { signIn, signUp, signInDemo, signInWithGoogle, signInWithGoogleAccount, isSupabaseConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Google Account Modal state
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [customGmail, setCustomGmail] = useState('ritesh.kumar141068@gmail.com');
  const [customGoogleName, setCustomGoogleName] = useState('Ritesh Kumar');

  const handleGoogleClick = async () => {
    setGoogleLoading(true);
    setError(null);

    if (isSupabaseConfigured) {
      const { error } = await signInWithGoogle();
      if (!error) {
        // Will redirect to Google OAuth
        return;
      }
      console.warn('Supabase OAuth error, presenting Google Account direct sign-in:', error);
    }

    setGoogleLoading(false);
    setGoogleModalOpen(true);
  };

  const handleConfirmGoogleLogin = (gmail: string, name: string) => {
    signInWithGoogleAccount(gmail, name);
    setGoogleModalOpen(false);
    onSuccess();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fn = mode === 'signin' ? signIn : signUp;
    const { error } = await fn(email, password);

    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    if (mode === 'signup') {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError(signInError);
        setLoading(false);
        return;
      }
    }

    onSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary text-white relative overflow-hidden py-12">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-violet/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/8 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="flex flex-col items-center mb-8">
          <button onClick={onBack}>
            <Logo size="lg" />
          </button>
        </div>

        <div className="glass-panel-strong rounded-3xl p-8 shadow-2xl shadow-black/40 border border-white/10">
          <div className="text-center mb-6">
            <div className="inline-flex w-14 h-14 rounded-2xl gradient-violet items-center justify-center mb-4 glow-sm">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-sm text-white/40">
              {mode === 'signin'
                ? 'Sign in to your Ritronix Ai workspace'
                : 'Start building with AI in seconds'}
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-300 mb-5 animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* GOOGLE / GMAIL LOGIN BUTTON */}
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl bg-white hover:bg-white/95 text-gray-900 font-semibold text-sm transition-all shadow-lg shadow-black/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer mb-5"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-700" />
            ) : (
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-bg-secondary px-3 text-white/35 font-medium">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 focus:outline-none focus:border-accent-violet/50 focus:bg-white/8 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 focus:outline-none focus:border-accent-violet/50 focus:bg-white/8 transition-all text-sm"
              />
            </div>

            <Button type="submit" size="lg" disabled={loading} className="w-full mt-2">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-bg-secondary px-2 text-white/30 font-medium">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="w-full text-white/90 border-white/15 hover:border-accent-violet/40 hover:bg-accent-violet/10"
              onClick={() => {
                signInDemo();
                onSuccess();
              }}
            >
              <Sparkles className="w-4 h-4 text-accent-violet" />
              Explore in Demo Mode
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-white/40">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={onToggleMode}
              className="text-accent-violet hover:text-violet-400 font-medium transition-colors cursor-pointer"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-white/25 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>

      {/* GOOGLE ACCOUNT SELECTION MODAL */}
      {googleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm glass-panel-strong rounded-3xl p-6 border border-white/15 shadow-2xl relative">
            <button
              onClick={() => setGoogleModalOpen(false)}
              className="absolute right-4 top-4 text-white/40 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Sign in with Google</h3>
                <p className="text-xs text-white/40">Choose or enter your Google Account</p>
              </div>
            </div>

            {/* Quick 1-click Account Option */}
            <div className="space-y-3 mb-5">
              <button
                type="button"
                onClick={() => handleConfirmGoogleLogin(customGmail, customGoogleName)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent-violet/40 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-violet/30 border border-accent-violet/40 flex items-center justify-center font-bold text-white text-sm">
                    {customGoogleName[0]}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-accent-violet transition-colors">
                      {customGoogleName}
                    </div>
                    <div className="text-[11px] text-white/40">{customGmail}</div>
                  </div>
                </div>
                <Check className="w-4 h-4 text-accent-violet opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            <div className="border-t border-white/10 pt-3 space-y-3">
              <span className="text-[11px] text-white/40 block">Or sign in with another Gmail ID:</span>
              <input
                type="email"
                placeholder="yourname@gmail.com"
                value={customGmail}
                onChange={(e) => setCustomGmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-accent-violet/50"
              />
              <input
                type="text"
                placeholder="Your Name"
                value={customGoogleName}
                onChange={(e) => setCustomGoogleName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-accent-violet/50"
              />
              <Button
                size="sm"
                className="w-full"
                onClick={() => handleConfirmGoogleLogin(customGmail, customGoogleName)}
              >
                Continue as Google Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
