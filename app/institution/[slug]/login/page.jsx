'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  UserCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  ChevronLeft, 
  ShieldCheck,
  Layers,
  AlertCircle,
  UserPlus,
  KeyRound
} from 'lucide-react';
import { getInstitutions } from '@/lib/institutionsStore';
import { verifyTeacherLogin, getTeachersByInstitution } from '@/lib/teachersStore';

function InstitutionLoginContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params?.slug || 'bmsce';

  const [activeTab, setActiveTab] = useState('TEACHER'); // 'TEACHER' or 'ADMIN'
  const [institution, setInstitution] = useState(null);
  
  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const list = getInstitutions();
    const found = list.find((i) => i.slug === slug || i.code.toLowerCase() === slug.toLowerCase());

    if (found) {
      setInstitution(found);
    } else {
      setInstitution({
        name: slug.toUpperCase().replace(/-/g, ' ') + ' COLLEGE',
        code: slug.toUpperCase(),
        officialEmail: `admin@${slug}.edu`,
        generatedPassword: 'Inst#Pass9012',
        status: 'ACTIVE'
      });
    }

    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('Registration submitted successfully! You can sign in once approved by the Institution Admin.');
    }
  }, [slug, searchParams]);

  // Pre-fill helper for demo purposes
  const autoFillCredentials = () => {
    setErrorMessage('');
    if (activeTab === 'ADMIN') {
      setEmail(institution?.officialEmail || 'admin@bmsce.ac.in');
      setPassword(institution?.generatedPassword || 'Inst#Pass9012');
    } else {
      const teachers = getTeachersByInstitution(slug);
      const approvedTeacher = teachers.find(t => t.status === 'APPROVED');
      if (approvedTeacher) {
        setEmail(approvedTeacher.email);
        setPassword(approvedTeacher.password);
      } else {
        setEmail('prof.suresh@bmsce.ac.in');
        setPassword('Teacher#123');
      }
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    if (activeTab === 'ADMIN') {
      // Verify Institution Admin Login
      setTimeout(() => {
        setLoading(false);
        const validPass = institution?.generatedPassword || 'Inst#Pass9012';
        const validEmail = institution?.officialEmail || `admin@${slug}.edu`;

        if (password === validPass || email.toLowerCase() === validEmail.toLowerCase()) {
          setSuccessMessage('Institution Admin Authenticated! Entering Admin Portal...');
          localStorage.setItem(`inst_admin_auth_${slug}`, 'true');
          setTimeout(() => {
            router.push(`/institution/${slug}/admin/dashboard`);
          }, 1000);
        } else {
          setErrorMessage('Invalid Institution Admin password or email. Please check access pass issued by Superadmin.');
        }
      }, 700);
    } else {
      // Verify Teacher / Staff Login
      setTimeout(() => {
        setLoading(false);
        const result = verifyTeacherLogin(slug, email, password);

        if (!result.success) {
          setErrorMessage(result.error);
        } else {
          setSuccessMessage(`Welcome back, ${result.teacher.name}! Entering Teacher Portal...`);
          localStorage.setItem(`teacher_session_${slug}`, JSON.stringify(result.teacher));
          setTimeout(() => {
            router.push(`/institution/${slug}/teacher/dashboard`);
          }, 1000);
        }
      }, 700);
    }
  };

  return (
    <div className="w-full max-w-md font-sans">
      {/* Institution Branding Banner */}
      <div className="text-center mb-6 space-y-2">
        <div className="inline-flex p-3.5 rounded-2xl bg-teal-600 text-white mb-2 shadow-sm">
          <Building2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          {institution?.name || 'Institution Workspace'}
        </h1>
        <p className="text-xs text-slate-500 font-mono">
          Workspace Code: <span className="text-teal-700 font-bold">{institution?.code || 'INST-CODE'}</span>
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm relative">
        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 border border-slate-200 mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('TEACHER');
              setErrorMessage('');
              setEmail('');
              setPassword('');
            }}
            className={`py-2 px-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'TEACHER'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Teacher / Staff</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('ADMIN');
              setErrorMessage('');
              setEmail('');
              setPassword('');
            }}
            className={`py-2 px-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'ADMIN'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Institution Admin</span>
          </button>
        </div>

        {/* Auto-fill Helper Banner */}
        <div className="mb-5 p-3 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between text-xs text-teal-900 font-medium">
          <div className="flex items-center space-x-2">
            <KeyRound className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <span>
              {activeTab === 'ADMIN' ? 'Demo Admin Pass' : 'Demo Faculty Login'}
            </span>
          </div>
          <button
            type="button"
            onClick={autoFillCredentials}
            className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white font-medium text-[11px] rounded-md transition-all shadow-sm"
          >
            Auto-fill
          </button>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {activeTab === 'ADMIN' ? 'Official Admin Email' : 'Registered Faculty Email'}
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
                placeholder={activeTab === 'ADMIN' ? institution?.officialEmail : 'prof.suresh@bmsce.ac.in'}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {activeTab === 'ADMIN' ? 'Access Pass Password' : 'Account Password'}
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
                className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl text-white font-semibold text-xs shadow-sm flex items-center justify-center space-x-2 transition-all disabled:opacity-50 ${
              activeTab === 'ADMIN'
                ? 'bg-teal-600 hover:bg-teal-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Enter {activeTab === 'ADMIN' ? 'Institution Admin Portal' : 'Teacher Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {activeTab === 'TEACHER' && (
          <div className="mt-5 pt-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500">
              New faculty at {institution?.name}?
            </p>
            <Link
              href={`/institution/${slug}/register`}
              className="mt-2 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Faculty Account</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InstitutionWorkspaceLoginPage() {
  return (
    <div className="min-h-screen bg-[#ffffff] text-slate-800 flex flex-col justify-between relative overflow-hidden font-sans border-t-4 border-teal-600">
      <div className="p-6 flex items-center justify-between">
        <Link 
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Gateway</span>
        </Link>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-bold">
          <Layers className="w-3.5 h-3.5 text-teal-600" />
          <span>TIER 2 WORKSPACE PORTAL</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <Suspense fallback={<div className="text-xs text-slate-500">Loading Workspace Login...</div>}>
          <InstitutionLoginContent />
        </Suspense>
      </div>

      <div className="p-4 text-center text-xs text-slate-500 border-t border-slate-100">
        Hierarchical Academic Portal System — Tier 2 Workspace Active
      </div>
    </div>
  );
}
