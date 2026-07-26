'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldAlert, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound,
  ChevronLeft
} from 'lucide-react';
import { SUPERADMIN_CREDENTIALS } from '@/lib/auth';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState('superadmin@eduportal.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (searchParams.get('error') === 'unauthorized') {
      setErrorMessage('Access Restricted: Only Superadmin accounts can view that page.');
    }
  }, [searchParams]);

  const fillMasterCredentials = () => {
    setEmail(SUPERADMIN_CREDENTIALS.email);
    setPassword(SUPERADMIN_CREDENTIALS.password);
    setErrorMessage('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      // Set client session state
      localStorage.setItem('superadmin_authenticated', 'true');
      localStorage.setItem('superadmin_user', JSON.stringify(data.user));

      setSuccessMessage('Authentication verified! Redirecting to Superadmin Dashboard...');
      setTimeout(() => {
        router.push('/superadmin/dashboard');
      }, 1000);
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify master credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Superadmin Badge */}
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 mb-2 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Superadmin Portal
        </h1>
        <p className="text-xs text-slate-500">
          Restricted Master System Control & Authentication
        </p>
      </div>

      {/* Form Panel */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative">
        {/* Master Credentials Quick Auto-fill Banner */}
        <div className="mb-6 p-3 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-indigo-800 font-medium">
            <KeyRound className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span>Demo Master Account</span>
          </div>
          <button
            type="button"
            onClick={fillMasterCredentials}
            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium text-[11px] transition-all shadow-sm"
          >
            Auto-fill
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Official Superadmin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="superadmin@eduportal.com"
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Master Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-3 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>System Security Active</span>
            </span>
            <span className="font-mono text-[11px] text-indigo-600 font-semibold">Master Level 1</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Authenticating...</span>
              </span>
            ) : (
              <>
                <span>Access Superadmin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-slate-500">
        Authorized Personnel Only — Session ID: <span className="font-mono text-slate-700">SA-SYS-MASTER</span>
      </p>
    </div>
  );
}

export default function SuperAdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#ffffff] text-slate-800 flex flex-col justify-between relative overflow-hidden font-sans border-t-4 border-indigo-600">
      {/* Top Bar */}
      <div className="p-6">
        <Link 
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-medium text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Main Gateway</span>
        </Link>
      </div>

      {/* Login Card inside Suspense */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Suspense fallback={
          <div className="text-slate-500 text-xs">Loading Security Portal...</div>
        }>
          <LoginFormContent />
        </Suspense>
      </div>

      <div className="p-4 text-center text-xs text-slate-500 border-t border-slate-100">
        EduPortal Superadmin Authentication Engine v1.0
      </div>
    </div>
  );
}
