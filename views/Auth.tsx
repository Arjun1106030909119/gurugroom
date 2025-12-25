import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, AlertCircle, LayoutTemplate, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface Props {
  onComplete: () => void;
  onCancel: () => void;
  onDemoLogin: () => void;
}

type AuthMode = 'LOGIN' | 'SIGNUP' | 'FORGOT';

const Auth: React.FC<Props> = ({ onComplete, onCancel, onDemoLogin }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (authMode === 'LOGIN') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onComplete();
      } else if (authMode === 'SIGNUP') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
            }
          }
        });
        if (error) throw error;
        
        // Create initial profile if it doesn't exist
        if (data.user) {
          const { error: profileError } = await supabase.from('profiles').insert([
            {
              id: data.user.id,
              name: name,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
              email: email,
              credits: 10,
              role: 'learner',
              skills: [],
            }
          ]);
          if (profileError) {
              if (!profileError.message.includes('duplicate key')) {
                  console.error('Profile creation error:', profileError);
              }
          }
        }
        onComplete();
      } else if (authMode === 'FORGOT') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setSuccessMessage("Password reset instructions have been sent to your email.");
      }
    } catch (err: any) {
      if (err.message && (err.message.includes("sending confirmation email") || err.message.includes("rate limit"))) {
         setError("Email limit reached. Please try again later.");
      } else {
         setError(err.message || 'An error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (authMode) {
      case 'LOGIN': return 'Welcome back';
      case 'SIGNUP': return 'Create an account';
      case 'FORGOT': return 'Reset Password';
    }
  };

  const getSubtitle = () => {
    switch (authMode) {
      case 'LOGIN': return 'Sign in to access your sessions';
      case 'SIGNUP': return 'Join the community of learners and experts';
      case 'FORGOT': return 'Enter your email to receive reset instructions';
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {getTitle()}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {getSubtitle()}
          </p>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle size={16} /> <span className="flex-1">{error}</span>
            </div>
          )}
          
          {successMessage && (
            <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg flex items-center gap-2">
              <CheckCircle size={16} /> <span className="flex-1">{successMessage}</span>
            </div>
          )}

          {/* Demo Login Button */}
          {authMode !== 'FORGOT' && (
            <div className="grid grid-cols-1 gap-3">
               <button
                onClick={onDemoLogin}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-xl shadow-sm bg-slate-50 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                <LayoutTemplate size={18} className="text-slate-600" />
                Demo Login (Skip Auth)
              </button>
            </div>
          )}

          {authMode !== 'FORGOT' && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with email</span>
              </div>
            </div>
          )}

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {authMode === 'SIGNUP' && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                  placeholder="Full Name"
                />
              </div>
            )}
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                placeholder="Email address"
              />
            </div>

            {authMode !== 'FORGOT' && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                  placeholder="Password"
                />
              </div>
            )}

            {authMode === 'LOGIN' && (
              <div className="flex justify-end">
                <button 
                  type="button"
                  onClick={() => setAuthMode('FORGOT')}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                'Processing...'
              ) : (
                <span className="flex items-center gap-2">
                  {authMode === 'LOGIN' && <>Sign In <ArrowRight size={16} /></>}
                  {authMode === 'SIGNUP' && <>Create Account <ArrowRight size={16} /></>}
                  {authMode === 'FORGOT' && <>Send Reset Instructions</>}
                </span>
              )}
            </button>
          </form>
        </div>

        <div className="text-center space-y-2">
          {authMode === 'LOGIN' && (
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <button
                onClick={() => setAuthMode('SIGNUP')}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign up
              </button>
            </p>
          )}

          {authMode === 'SIGNUP' && (
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <button
                onClick={() => setAuthMode('LOGIN')}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Log in
              </button>
            </p>
          )}

          {authMode === 'FORGOT' && (
            <button
              onClick={() => setAuthMode('LOGIN')}
              className="flex items-center justify-center gap-2 w-full text-sm text-slate-600 hover:text-slate-900 font-medium"
            >
              <ArrowLeft size={16} /> Back to Login
            </button>
          )}
          
          <button onClick={onCancel} className="mt-4 text-xs text-slate-400 hover:text-slate-600 underline">
            Cancel and go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;