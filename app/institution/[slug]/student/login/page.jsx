'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  GraduationCap, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  ChevronLeft, 
  Layers,
  AlertCircle,
  UserPlus,
  KeyRound,
  CreditCard,
  Users
} from 'lucide-react';
import { getInstitutions } from '@/lib/institutionsStore';
import { verifyStudentLogin, getStudentsByInstitution } from '@/lib/studentsStore';

function StudentLoginContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params?.slug || 'bmsce';

  const [institution, setInstitution] = useState(null);
  const [section, setSection] = useState('Section A');
  const [rollNo, setRollNo] = useState('1BM23CS001');
  const [password, setPassword] = useState('Student#123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const list = getInstitutions();
    const found = list.find((i) => i.slug === slug || i.code.toLowerCase() === slug.toLowerCase());
    setInstitution(found || { name: `${slug.toUpperCase()} College`, code: slug.toUpperCase() });

    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('Payment verified & registration complete! Log into your Student Portal.');
    }
  }, [slug, searchParams]);

  const autoFillCredentials = () => {
    const students = getStudentsByInstitution(slug);
    const validStudent = students.find(s => s.paymentStatus === 'PAID') || students[0];
    if (validStudent) {
      setSection(validStudent.section || 'Section A');
      setRollNo(validStudent.rollNo || '1BM23CS001');
      setPassword(validStudent.password || 'Student#123');
    } else {
      setSection('Section A');
      setRollNo('1BM23CS001');
      setPassword('Student#123');
    }
    setErrorMessage('');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!section) return setErrorMessage('Section is required.');
    if (!rollNo.trim()) return setErrorMessage('Roll Number is required.');
    if (!password.trim()) return setErrorMessage('Password is required.');

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const result = verifyStudentLogin(slug, section, rollNo, password);

      if (!result.success) {
        setErrorMessage(result.error);
      } else {
        setSuccessMessage(`Welcome back, ${result.student.name}! Redirecting to Student Dashboard...`);
        localStorage.setItem(`student_session_${slug}`, JSON.stringify(result.student));
        setTimeout(() => {
          router.push(`/institution/${slug}/student/dashboard`);
        }, 1000);
      }
    }, 600);
  };

  return (
    <div className="w-full max-w-md font-sans">
      {/* Branding */}
      <div className="text-center mb-6 space-y-2">
        <div className="inline-flex p-3.5 rounded-2xl bg-amber-600 text-white mb-2 shadow-sm">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Student Portal Gateway
        </h1>
        <p className="text-xs text-amber-800 font-mono font-bold">
          Institution: <span className="text-slate-900">{institution?.name} ({institution?.code})</span>
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm relative">


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
          
          {/* 1. Section */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Section <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Users className="w-4 h-4" />
              </div>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Section A">Section A</option>
                <option value="Section B">Section B</option>
                <option value="Section C">Section C</option>
              </select>
            </div>
          </div>

          {/* 2. Roll No */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Roll No <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value.toUpperCase())}
                placeholder="e.g. 1BM23CS001"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* 3. Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password <span className="text-red-500">*</span>
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
                className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
            className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating Student...</span>
            ) : (
              <>
                <span>Enter Student Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-500">
            New Student at {institution?.name}?
          </p>
          <Link
            href={`/institution/${slug}/student/register`}
            className="mt-2 inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register & Pay Fee via QR</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function StudentLoginPage() {
  return (
    <div className="min-h-screen bg-[#ffffff] text-slate-800 flex flex-col justify-between relative overflow-hidden font-sans border-t-4 border-amber-600">
      <div className="p-6 flex items-center justify-between">
        <Link 
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Gateway</span>
        </Link>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono font-bold">
          <Layers className="w-3.5 h-3.5 text-amber-600" />
          <span>TIER 4 STUDENT PORTAL</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <Suspense fallback={<div className="text-xs text-slate-500">Loading Student Login...</div>}>
          <StudentLoginContent />
        </Suspense>
      </div>

      <div className="p-4 text-center text-xs text-slate-500 border-t border-slate-100">
        Hierarchical Academic System — Tier 4 Student Portal Active
      </div>
    </div>
  );
}
