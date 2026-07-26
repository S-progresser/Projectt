'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  GraduationCap, 
  Mail, 
  Eye, 
  EyeOff, 
  ChevronLeft, 
  AlertCircle, 
  CheckCircle2, 
  QrCode, 
  ArrowRight, 
  ShieldCheck,
  Copy,
  Check,
  Receipt,
  User,
  BookOpen,
  Users,
  Lock,
  Info
} from 'lucide-react';
import { getInstitutions } from '@/lib/institutionsStore';
import { registerStudent } from '@/lib/studentsStore';

function StudentRegisterContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug || 'bmsce';

  const [institution, setInstitution] = useState(null);
  const [step, setStep] = useState(1); // 1 = Student Details, 2 = QR Code Payment

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentClass: 'Class 6',
    section: 'Section A',
    password: '',
    confirmPassword: '',
    rollNo: '',
    feePlan: 'Portal Registration & Processing Fee',
    feeAmount: 50,
    utrNumber: '',
    autoApprove: true
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  useEffect(() => {
    const list = getInstitutions();
    const found = list.find((i) => i.slug === slug || i.code.toLowerCase() === slug.toLowerCase());
    if (found) {
      setInstitution(found);
    } else {
      setInstitution({
        name: slug.toUpperCase().replace(/-/g, ' ') + ' COLLEGE',
        code: slug.toUpperCase(),
        officialEmail: `admin@${slug}.edu`
      });
    }
  }, [slug]);

  // Demo auto-fill password matching 11+ chars, 1 Upper, 1 Lower, 1 Number, 1 Special
  const fillDemoStudent = () => {
    const randomNum = Math.floor(100 + Math.random() * 899);
    setFormData({
      name: 'Kavya Kulkarni',
      email: `kavya.cs23@${institution?.officialEmail.split('@')[1] || 'bmsce.ac.in'}`,
      studentClass: 'Class 6',
      section: 'Section A',
      password: 'Student#1234',
      confirmPassword: 'Student#1234',
      rollNo: `1BM23CS${randomNum}`,
      feePlan: 'Portal Registration & Processing Fee',
      feeAmount: 50,
      utrNumber: `UPI/4209${Math.floor(10000000 + Math.random() * 89999999)}`,
      autoApprove: true
    });
    setErrorMessage('');
  };

  const validatePasswordRequirements = (pwd) => {
    if (pwd.length < 11) {
      return 'Password must be at least 11 characters long.';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Password must contain at least one capital letter (A-Z).';
    }
    if (!/[a-z]/.test(pwd)) {
      return 'Password must contain at least one lowercase letter (a-z).';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Password must contain at least one number (0-9).';
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
      return 'Password must contain at least one special symbol (e.g. @, #, $, !).';
    }
    return null;
  };

  const handleStep1Next = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) return setErrorMessage('Full Name is required.');
    if (!formData.email.trim()) return setErrorMessage('Email ID is required.');
    if (!formData.studentClass.trim()) return setErrorMessage('Class is required.');
    if (!formData.section.trim()) return setErrorMessage('Section is required.');
    
    // Strict Password Validation
    const pwdErr = validatePasswordRequirements(formData.password);
    if (pwdErr) {
      return setErrorMessage(pwdErr);
    }

    if (formData.password !== formData.confirmPassword) {
      return setErrorMessage('Passwords do not match.');
    }

    if (!formData.rollNo) {
      setFormData(prev => ({
        ...prev,
        rollNo: `1BM23CS${Math.floor(100 + Math.random() * 899)}`
      }));
    }

    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.utrNumber.trim()) {
      return setErrorMessage('Transaction Reference ID / UTR Number is required for processing fee verification.');
    }

    setLoading(true);

    try {
      const registered = registerStudent({
        institutionSlug: slug,
        institutionCode: institution?.code || slug.toUpperCase(),
        rollNo: formData.rollNo,
        name: formData.name,
        email: formData.email,
        semester: formData.studentClass,
        section: formData.section,
        password: formData.password,
        feePlan: formData.feePlan,
        feeAmount: formData.feeAmount,
        utrNumber: formData.utrNumber,
        autoApprove: formData.autoApprove
      });

      setSuccessMessage(
        formData.autoApprove
          ? `₹50 Processing fee verified & account activated! Allocated Roll No: ${registered.rollNo} (${registered.section}). Redirecting to Student Dashboard...`
          : `Registration & UTR (${registered.utrNumber}) submitted! Pending verification by ${institution?.name} Admin.`
      );

      localStorage.setItem(`student_session_${slug}`, JSON.stringify(registered));

      setTimeout(() => {
        router.push(`/institution/${slug}/student/dashboard`);
      }, 2000);
    } catch (err) {
      setErrorMessage(err.message || 'Payment submission failed.');
    } finally {
      setLoading(false);
    }
  };

  const upiId = `${slug}.fee@upi`;

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div className="w-full max-w-xl font-sans">
      {/* Header */}
      <div className="text-center mb-6 space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-amber-600 text-white mb-2 shadow-sm">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Student Portal Self-Registration
        </h1>
        <p className="text-xs text-amber-800 font-mono font-bold">
          Institution: <span className="text-slate-900">{institution?.name} ({institution?.code})</span>
        </p>
      </div>

      {/* Progress Wizard Tabs */}
      <div className="grid grid-cols-2 gap-2 mb-6 font-semibold">
        <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
          step === 1 ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-slate-100 border-slate-200 text-slate-600'
        }`}>
          <span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-mono">1</span>
          <span>1. Initial Registration</span>
        </div>

        <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
          step === 2 ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-slate-100 border-slate-200 text-slate-600'
        }`}>
          <span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-mono">2</span>
          <span>2. ₹50 Processing Fee</span>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm relative">
        <div className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900 font-medium">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Student Registration Engine</span>
          </div>
          <button
            type="button"
            onClick={fillDemoStudent}
            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-medium text-[11px] rounded-md transition-all shadow-sm"
          >
            Auto-fill Sample
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2 font-medium">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2">
            <div className="flex items-center space-x-2 font-bold text-sm text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Registration & Processing Fee Verified!</span>
            </div>
            <p>{successMessage}</p>
          </div>
        )}

        {/* STEP 1 INITIAL REGISTRATION FORM */}
        {step === 1 && (
          <form onSubmit={handleStep1Next} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* 1. Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Kavya Kulkarni"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* 2. Email ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email ID <span className="text-red-500">*</span>
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
                    placeholder="kavya.cs23@bmsce.ac.in"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* 3. Class */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <select
                    value={formData.studentClass}
                    onChange={(e) => setFormData({ ...formData, studentClass: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  >
                    <option value="Class 6">Class 6</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                  </select>
                </div>
              </div>

              {/* 4. Section */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  >
                    <option value="Section A">Section A</option>
                    <option value="Section B">Section B</option>
                    <option value="Section C">Section C</option>
                  </select>
                </div>
              </div>

              {/* 5. Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="e.g. Student#1234"
                    className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
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

              {/* 6. Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="e.g. Student#1234"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

            </div>

            {/* Password Criteria Notice */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                <Info className="w-3.5 h-3.5 text-amber-600" />
                <span>Password Requirements</span>
              </div>
              <p>Must be <strong>at least 11 characters</strong> containing at least: 1 uppercase letter (A-Z), 1 lowercase letter (a-z), 1 number (0-9), and 1 special symbol (e.g. @, #, $, !).</p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center space-x-2 transition-all mt-4"
            >
              <span>Proceed to Pay ₹50 Processing Fee</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: QR CODE PAYMENT FOR ₹50 WEB PROCESSING FEE */}
        {step === 2 && (
          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-2xl bg-amber-50 border border-amber-200">
              {/* QR Code Container */}
              <div className="p-4 bg-white rounded-2xl shadow-sm flex flex-col items-center flex-shrink-0 border border-slate-200">
                <div className="w-44 h-44 bg-slate-900 rounded-xl p-3 flex flex-col items-center justify-center border-2 border-dashed border-amber-500 text-center relative overflow-hidden">
                  <QrCode className="w-24 h-24 text-amber-400 mb-1" />
                  <span className="text-[10px] font-mono text-amber-300 font-bold">SCAN TO PAY ₹50</span>
                  <span className="text-[9px] text-slate-300">{institution?.code} WEB PAY</span>
                </div>
                <div className="mt-2 flex items-center space-x-1.5 text-[11px] text-slate-800 font-bold font-mono">
                  <span>{upiId}</span>
                  <button type="button" onClick={copyUpi} className="text-amber-600 hover:text-amber-700">
                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="space-y-3 flex-1 text-xs">
                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-mono font-bold">Portal Processing Invoice</span>
                  <h4 className="font-bold text-slate-900 text-sm">{institution?.name}</h4>
                  <p className="text-slate-700">Student: <span className="text-amber-800 font-bold">{formData.name} ({formData.studentClass} - {formData.section})</span></p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <span className="text-xs font-semibold text-slate-700 block">Fee Purpose:</span>
                  <div className="font-bold text-slate-900">Web Portal Registration & Processing Fee</div>
                  <p className="text-[11px] text-slate-500">One-time registration fee for student account activation on this website portal.</p>
                </div>

                <div className="p-3 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-between font-bold">
                  <span className="text-amber-900">Total Payable Amount:</span>
                  <span className="text-xl text-slate-900 font-mono">₹50</span>
                </div>
              </div>
            </div>

            {/* UTR Input Form */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Transaction Reference ID / UTR Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.utrNumber}
                    onChange={(e) => setFormData({ ...formData, utrNumber: e.target.value.toUpperCase() })}
                    placeholder="e.g. UPI/420911849201 or UTR-99887766"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Enter the 12-digit UTR/UPI reference code from your GPay, PhonePe, Paytm, or bank receipt after paying ₹50.
                </p>
              </div>

              {/* Instant Auto-Verification Toggle */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-900">Instant Payment Verification (Demo)</span>
                  <p className="text-[10px] text-slate-500">Instantly activate student portal upon submitting UTR.</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.autoApprove}
                  onChange={(e) => setFormData({ ...formData, autoApprove: e.target.checked })}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs"
                >
                  Back to Profile
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span>Verifying ₹50 Processing Fee...</span>
                  ) : (
                    <>
                      <span>Submit ₹50 UTR & Activate Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      <div className="mt-6 text-center text-xs text-slate-500">
        Already registered & paid?{' '}
        <Link href={`/institution/${slug}/student/login`} className="text-amber-800 font-bold hover:underline">
          Sign In to Student Portal
        </Link>
      </div>
    </div>
  );
}

export default function StudentRegisterPage() {
  return (
    <div className="min-h-screen bg-[#ffffff] text-slate-800 flex flex-col justify-between relative overflow-hidden font-sans border-t-4 border-amber-600">
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
        <Suspense fallback={<div className="text-xs text-slate-500">Loading Student Registration...</div>}>
          <StudentRegisterContent />
        </Suspense>
      </div>

      <div className="p-4 text-center text-xs text-slate-500 border-t border-slate-100">
        Hierarchical Academic System — Tier 4 Student Registration & ₹50 Web Processing Engine
      </div>
    </div>
  );
}
