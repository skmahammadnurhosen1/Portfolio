import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from './api';

interface LoginScreenProps {
  onLoginSuccess: (email: string) => void;
  onBackToPortfolio?: () => void;
}

export function LoginScreen({ onLoginSuccess, onBackToPortfolio }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const performLogin = async (loginEmail: string, loginPass: string) => {
    setErrorMessage(null);

    if (!loginEmail.trim() || !loginPass) {
      setErrorMessage('Invalid credentials');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: loginEmail.trim(),
        password: loginPass,
      });

      if (response.data && response.data.success) {
        if (response.data.token) {
          localStorage.setItem('noor_admin_token', response.data.token);
        }
        onLoginSuccess(response.data.email);
      } else {
        setErrorMessage(response.data?.error || 'Invalid credentials');
      }
    } catch (err: any) {
      if (err.response?.status === 429) {
        setErrorMessage(err.response.data?.error || 'Too many failed attempts. Access temporarily restricted.');
      } else {
        setErrorMessage(err.response?.data?.error || 'Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await performLogin(email, password);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F4F2EA] p-4 sm:p-6 lg:p-10 font-sans text-stone-900">
      {/* Return to Portfolio subtle back button */}
      {onBackToPortfolio && (
        <button
          onClick={onBackToPortfolio}
          className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50 text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-stone-950 bg-white/80 hover:bg-white backdrop-blur-md px-3.5 py-2 rounded-full border border-stone-200/80 shadow-xs transition-all flex items-center gap-1.5"
        >
          <span>←</span> Back to Portfolio
        </button>
      )}

      {/* Main Split Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-5xl min-h-[620px] bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-stone-200/60"
      >
        {/* LEFT COLUMN: Warm Buttery Yellow Visual Panel */}
        <div className="lg:col-span-6 bg-[#FEF9E7] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden select-none">
          {/* Subtle Ambient Curved Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-100/60 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

          {/* Top Brand Header */}
          <div className="relative z-10">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black tracking-tight text-stone-950">NOOR</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block mb-1" />
            </div>
            <p className="text-xs font-medium text-stone-500 mt-0.5 tracking-wide uppercase">
              Admin Panel
            </p>
          </div>

          {/* Center Graphic & Headline */}
          <div className="relative z-10 my-8 sm:my-auto flex flex-col items-center text-center">
            <div className="max-w-xs mb-6 text-left w-full">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight leading-tight">
                Welcome Back!
              </h1>
              <p className="text-stone-600 text-sm mt-2 leading-relaxed">
                Sign in to manage your portfolio, projects and personal details.
              </p>
            </div>

            {/* Circular Portrait with "Build Create Grow" Doodle */}
            <div className="relative flex items-center justify-center mt-2">
              {/* Profile Cutout Image Container */}
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full border-4 border-amber-300/80 bg-amber-100 overflow-hidden shadow-lg">
                <img
                  src="/file_00000000704c8230a66055ead8603089.png"
                  alt="Noor"
                  className="w-full h-full object-cover object-top scale-105"
                />
              </div>

              {/* Doodle Graphic Badge: "Build Create Grow" */}
              <div className="absolute -bottom-2 -right-6 sm:-right-8 bg-white/95 backdrop-blur-xs border border-amber-200 shadow-md rounded-2xl px-4 py-2 rotate-6 text-left pointer-events-none">
                <div className="flex items-center gap-1 text-amber-500 mb-0.5">
                  <span className="text-xs">✦</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Vision</span>
                </div>
                <div className="font-serif italic font-bold text-stone-900 leading-tight text-sm">
                  Build<br />
                  Create<br />
                  <span className="text-amber-600">Grow</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom subtle copyright placeholder */}
          <div className="relative z-10 text-xs text-stone-400 font-medium">
            Authorized Personnel Access Only
          </div>
        </div>

        {/* RIGHT COLUMN: Pure White Silent Blind Login Form */}
        <div className="lg:col-span-6 bg-white p-8 sm:p-12 lg:p-14 flex flex-col justify-between relative">
          <div className="w-full max-w-md mx-auto my-auto py-4">
            {/* Header Greeting */}
            <div className="mb-8">
              <span className="text-base font-semibold text-stone-700 flex items-center gap-1.5">
                Hey, <span className="inline-block animate-wave">👋</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight mt-1">
                Login to Admin Panel
              </h2>
              <p className="text-stone-500 text-sm mt-1.5">
                Enter your credentials to continue.
              </p>
            </div>

            {/* Generic Error Notification Box */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2.5 shadow-xs"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Silent Confidential Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Address Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-stone-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3 bg-stone-50/70 hover:bg-stone-50 focus:bg-white text-stone-900 placeholder:text-stone-400 text-sm rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-stone-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    disabled={loading}
                    className="w-full pl-10 pr-11 py-3 bg-stone-50/70 hover:bg-stone-50 focus:bg-white text-stone-900 placeholder:text-stone-400 text-sm rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-hidden transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3.5 text-stone-400 hover:text-stone-700 p-1 rounded-md transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Toggle */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-sm border-stone-300 text-amber-500 focus:ring-amber-400 accent-amber-500"
                  />
                  <span className="text-xs font-medium text-stone-600">Remember me</span>
                </label>
                {/* No forgot password link as strictly mandated */}
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-stone-950 font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Login</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer Copyright */}
          <div className="text-center pt-6 text-xs text-stone-400">
            © 2025 Noor. All rights reserved.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
