import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(searchParams.get('signup') === 'true');
  const [isForgot, setIsForgot] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn, resetPassword, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isForgot) {
      const { error } = await resetPassword(email);
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success('Password reset email sent. Check your inbox.');
      setIsForgot(false);
      return;
    }

    if (isSignup) {
      const { error } = await signUp(email, password);
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success('Account created! Check your email to confirm.');
    } else {
      const { error } = await signIn(email, password);
      setLoading(false);
      if (error) return toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="h-10 w-10 rounded-lg gradient-hero flex items-center justify-center">
            <span className="text-primary-foreground font-bold">IS</span>
          </div>
          <span className="font-semibold text-foreground text-xl">ISSS Planner</span>
        </div>

        <div className="rounded-xl bg-card border border-border p-6 card-shadow">
          <h2 className="text-xl font-semibold text-foreground mb-1">
            {isForgot ? 'Reset Password' : isSignup ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {isForgot
              ? 'Enter your email to receive a reset link.'
              : isSignup
                ? 'Start planning your ISSS degree.'
                : 'Sign in to your degree planner.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@uni-bamberg.de"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {!isForgot && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isForgot ? 'Send Reset Link' : isSignup ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-4 space-y-2 text-center">
            {isForgot ? (
              <button onClick={() => setIsForgot(false)} className="text-sm text-primary hover:underline flex items-center justify-center gap-1 mx-auto">
                <ArrowLeft className="h-3 w-3" /> Back to sign in
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-sm text-primary hover:underline"
                >
                  {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
                {!isSignup && (
                  <button
                    onClick={() => setIsForgot(true)}
                    className="block text-sm text-muted-foreground hover:text-foreground mx-auto"
                  >
                    Forgot password?
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
