'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  UserCheck, 
  Mail, 
  Eye, 
  EyeOff, 
  BadgeCheck, 
  ChevronLeft, 
  AlertCircle, 
  CheckCircle2, 
  CreditCard, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { getInstitutions } from '@/lib/institutionsStore';
import { registerTeacher } from '@/lib/teachersStore';

function RegisterFormContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug || 'bmsce';

  const [institution, setInstitution] = useState(null);
  const [formData, setFormData] = useState({
    teacherId: '',
    name: '',
    email: '',
    department: 'Computer Science & Engineering',
    designation: 'Assistant Professor',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const list = getInstitutions();
    const found = list.find((i) => i.slug === slug || i.code.toLowerCase() === slug.toLowerCase());
    if (found) {
      setInstitution(found);
      setFormData(prev => ({
        ...prev,
        email: `prof.${prev.name.toLowerCase().replace(/\s+/g, '') || 'faculty'}@${found.officialEmail.split('@')[1] || 'college.edu'}`
      }));
    } else {
      setInstitution({
        name: slug.toUpperCase().replace(/-/g, ' ') + ' COLLEGE',
        code: slug.toUpperCase(),
        officialEmail: `admin@${slug}.edu`
      });
    }
  }, [slug]);

  const departments = [
    'Computer Science & Engineering',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Information Technology',
    'Electrical & Electronics',
    'Basic Sciences & Mathematics'
  ];

  const designations = [
    'Professor & HOD',
    'Professor',
    'Associate Professor',
    'Assistant Professor',
    'Senior Lecturer',
    'Lab Instructor & Staff'
  ];

  const fillDemoTeacher = () => {
    const code = institution?.code?.split('-')[0] || 'BMS';
    setFormData({
      teacherId: `EMP-${code}-${Math.floor(100 + Math.random() * 900)}`,
      name: 'Dr. Rajesh Kumar V',
      email: `rajesh.k@${institution?.officialEmail.split('@')[1] || 'bmsce.ac.in'}`,
      department: 'Computer Science & Engineering',
      designation: 'Assistant Professor',
      password: 'Teacher#123',
      confirmPassword: 'Teacher#123'
    });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.teacherId.trim()) return setErrorMessage('Employee/Faculty ID is required.');
    if (!formData.name.trim()) return setErrorMessage('Full Name is required.');
    if (!formData.email.trim()) return setErrorMessage('Official Email is required.');
    if (formData.password !== formData.confirmPassword) {
      return setErrorMessage('Passwords do not match.');
    }
    if (formData.password.length < 6) {
      return setErrorMessage('Password must be at least 6 characters.');
    }

    setLoading(true);

    try {
      const created = registerTeacher({
        institutionSlug: slug,
        institutionCode: institution?.code || slug.toUpperCase(),
        teacherId: formData.teacherId,
        name: formData.name,
        email: formData.email,
        department: formData.department,
        designation: formData.designation,
        password: formData.password,
        status: 'PENDING'
      });

      setSuccessMessage(`Registration submitted! Your faculty account (${created.teacherId}) is pending approval by the ${institution?.name} Administrator.`);
      
      setTimeout(() => {
        router.push(`/institution/${slug}/login?registered=true`);
      }, 2500);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl font-sans">
      {/* Header */}
      <div className="text-center mb-6 space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-emerald-600 text-white mb-2 shadow-sm">
          <UserCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Teacher & Staff Registration
        </h1>
        <p className="text-xs text-emerald-800 font-mono font-bold">
          Associated Institution: <span className="text-slate-900">{institution?.name} ({institution?.code})</span>
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm relative">
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 font-medium">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Institutional Data Isolation Active</span>
          </div>
          <button
            type="button"
            onClick={fillDemoTeacher}
            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] rounded-md transition-all shadow-sm"
          >
            Auto-fill Sample
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2">
            <div className="flex items-center space-x-2 font-bold text-sm text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Application Received!</span>
            </div>
            <p>{successMessage}</p>
            <p className="text-[11px] text-slate-500">Redirecting to login portal in 2 seconds...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Employee ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Faculty / Employee ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.teacherId}
                  onChange={(e) => setFormData({ ...formData, teacherId: e.target.value.toUpperCase() })}
                  placeholder="e.g. EMP-BMS-104"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. Rajesh Kumar"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Official Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Institutional Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="prof.rajesh@bmsce.ac.in"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Designation */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Designation
              </label>
              <select
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {designations.map((desig) => (
                  <option key={desig} value={desig}>{desig}</option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-600 space-y-1 border border-slate-200">
            <p className="flex items-center space-x-1 font-semibold text-slate-800">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hierarchical Association Guarantee</span>
            </p>
            <p>Your faculty account will be bound exclusively to {institution?.name}. Once approved by the Institution Admin, you can access your assigned courses and student evaluation gradebook.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Submitting Application...</span>
            ) : (
              <>
                <span>Register Faculty Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="mt-6 text-center text-xs text-slate-500">
        Already registered?{' '}
        <Link href={`/institution/${slug}/login`} className="text-emerald-700 font-semibold hover:underline">
          Sign In to Institution Portal
        </Link>
      </div>
    </div>
  );
}

export default function TeacherRegisterPage() {
  return (
    <div className="min-h-screen bg-[#ffffff] text-slate-800 flex flex-col justify-between relative overflow-hidden font-sans border-t-4 border-emerald-600">
      <div className="p-6">
        <Link 
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Main Gateway</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <Suspense fallback={<div className="text-xs text-slate-500">Loading Registration Portal...</div>}>
          <RegisterFormContent />
        </Suspense>
      </div>

      <div className="p-4 text-center text-xs text-slate-500 border-t border-slate-100">
        Hierarchical Academic System — Tier 3 Faculty Registration Engine
      </div>
    </div>
  );
}
