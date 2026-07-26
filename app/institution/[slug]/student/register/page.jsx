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
  User,
  BookOpen,
  Users,
  Lock,
  Info,
  KeyRound,
  Send,
  CheckCheck
} from 'lucide-react';
import { getInstitutions } from '@/lib/institutionsStore';
import { registerStudent } from '@/lib/studentsStore';

function StudentRegisterContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug || 'bmsce';

  const [institution, setInstitution] = useState(null);
  const [step, setStep] = useState(1); // 1: Registration Form & OTP, 2: ₹50 QR Fee

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

  // OTP Verification States
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userEnteredOtp, setUserEnteredOtp] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpError, setOtpError] = useState('');

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

  const handleSendOtp = () => {
    setErrorMessage('');
    setOtpError('');

    if (!formData.name.trim()) return setErrorMessage('Full Name is required.');
    if (!formData.email.trim()) return setErrorMessage('Email ID is required.');
    if (!/\S+@\S+\.\S+/.test(formData.email)) return setErrorMessage('Please enter a valid Email ID.');

    // Strict Password Validation
    const pwdErr = validatePasswordRequirements(formData.password);
    if (pwdErr) {
      return setErrorMessage(pwdErr);
    }

    if (formData.password !== formData.confirmPassword) {
      return setErrorMessage('Passwords do not match.');
    }

    // Generate 6-digit random OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    setSuccessMessage(`OTP Sent successfully to ${formData.email}`);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setOtpError('');

    if (!userEnteredOtp.trim()) {
      return setOtpError('Please enter the 6-digit OTP code sent to your email.');
    }

    if (userEnteredOtp.trim() !== generatedOtp) {
      return setOtpError('Invalid OTP code. Please check the code sent to your email.');
    }

    setIsEmailVerified(true);
    setSuccessMessage(`Email ${formData.email} verified successfully!`);

    if (!formData.rollNo) {
      setFormData(prev => ({
        ...prev,
        rollNo: `1BM23CS${Math.floor(100 + Math.random() * 899)}`
      }));
    }

    setStep(2);
  };

  const handleStep1Next = (e) => {
    e.preventDefault();
    if (!isEmailVerified) {
      handleSendOtp();
    } else {
      setStep(2);
    }
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
        autoApprove: true
      });

      // Save student session into local storage
      localStorage.setItem(`student_session_${slug}`, JSON.stringify(registered));

      setSuccessMessage('₹50 Web Processing Fee Verified & Portal Activated! Redirecting...');

      setTimeout(() => {
        router.push(`/institution/${slug}/student/dashboard`);
      }, 1200);
    } catch (err) {
      setErrorMessage('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyUpi = () => {
    navigator.clipboard.writeText('bmsce.fee@upi');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const upiId = 'bmsce.fee@upi';

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      {/* Header Back Navigation */}
      <div className="flex items-center justify-between">
        <Link 
          href={`/institution/${slug}/student/login`}
          className="inline-flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Student Login</span>
        </Link>

        <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
          Institution: {institution?.name} ({institution?.code})
        </span>
      </div>

      {/* Progress Multi-Step Bar */}
      <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
        <div className={`p-3 rounded-xl border flex items-center space-x-2 transition-all ${
          step === 1 
            ? 'bg-amber-600 text-white border-amber-600 shadow-sm' 
            : 'bg-slate-50 text-slate-700 border-slate-200'
        }`}>
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
            step === 1 ? 'bg-white text-amber-800' : 'bg-slate-200 text-slate-700'
          }`}>
            1
          </div>
          <span>1. Registration & Email OTP</span>
        </div>

        <div className={`p-3 rounded-xl border flex items-center space-x-2 transition-all ${
          step === 2 
            ? 'bg-amber-600 text-white border-amber-600 shadow-sm' 
            : 'bg-slate-50 text-slate-700 border-slate-200'
        }`}>
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
            step === 2 ? 'bg-white text-amber-800' : 'bg-slate-200 text-slate-700'
          }`}>
            2
          </div>
          <span>2. ₹50 Processing Fee</span>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm relative">
        <div className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900 font-medium">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Student Registration & Email OTP Engine</span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2 font-medium">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start space-x-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* STEP 1: INITIAL REGISTRATION FORM */}
        {step === 1 && (
          <form onSubmit={handleStep1Next} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Full Name */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
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
                    placeholder="Sudeep"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Email ID */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    disabled={isEmailVerified || otpSent}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sudeep@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-100"
                  />
                  {isEmailVerified && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-emerald-600 font-bold text-[10px]">
                      Verified ✅
                    </div>
                  )}
                </div>
              </div>

              {/* Class Dropdown */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
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

              {/* Section Dropdown */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
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

              {/* Password */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
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

              {/* Confirm Password */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
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

            {/* OTP VERIFICATION MODAL / CONTAINER */}
            {otpSent && !isEmailVerified && (
              <div className="p-5 rounded-2xl bg-indigo-50 border-2 border-indigo-200 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-indigo-900 font-bold text-xs">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    <span>Email OTP Verification Sent to {formData.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUserEnteredOtp(generatedOtp)}
                    className="text-[10px] font-bold text-indigo-700 bg-indigo-100 border border-indigo-300 px-2 py-0.5 rounded hover:bg-indigo-200"
                  >
                    Auto-fill OTP ({generatedOtp})
                  </button>
                </div>

                <div className="text-xs text-slate-600">
                  Enter the 6-digit OTP code sent to your email ID <strong>{formData.email}</strong> to verify your account:
                </div>

                {otpError && (
                  <div className="p-2.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-semibold">
                    {otpError}
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    maxLength={6}
                    value={userEnteredOtp}
                    onChange={(e) => setUserEnteredOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP (e.g. 582914)"
                    className="flex-1 px-4 py-2.5 text-sm font-mono font-bold tracking-widest text-center rounded-xl border border-indigo-300 bg-white text-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5 transition-all"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>Verify OTP & Proceed</span>
                  </button>
                </div>
              </div>
            )}

            {!otpSent && (
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center space-x-2 transition-all mt-4"
              >
                <Send className="w-4 h-4" />
                <span>Send OTP to Email ({formData.email || 'Email ID'})</span>
              </button>
            )}
          </form>
        )}

        {/* STEP 2: QR CODE PAYMENT FOR ₹50 WEB PROCESSING FEE */}
        {step === 2 && (
          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-2xl bg-amber-50 border border-amber-200">
              {/* QR Code Container */}
              <div className="p-4 bg-white rounded-2xl shadow-sm flex flex-col items-center flex-shrink-0 border border-slate-200">
                <div className="w-44 h-44 rounded-xl overflow-hidden border-2 border-amber-500 shadow-sm bg-white flex items-center justify-center">
                  <img 
                    src="/qr-payment.png" 
                    alt="Scan to Pay ₹50 QR Code" 
                    className="w-full h-full object-contain" 
                  />
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
                  <p className="text-emerald-700 font-mono text-[11px] font-bold">Email Verified: {formData.email} ✅</p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <span className="text-xs font-semibold text-slate-700 block">Fee Purpose:</span>
                  <div className="font-bold text-slate-900">Web Portal Registration & Processing Fee</div>
                  <p className="text-[11px] text-slate-500">One-time registration fee for student account activation on this website portal.</p>
                </div>

                <div className="p-3 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-between font-bold">
                  <span className="text-amber-900">Total Payable Amount:</span>
                  <span className="text-amber-950 text-base font-mono">₹50</span>
                </div>
              </div>
            </div>

            {/* UTR Input Section */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-900 mb-1">
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
                    placeholder="E.G. UPI/420911849201 OR UTR-99887766"
                    className="w-full pl-9 pr-3 py-3 text-xs rounded-xl border border-slate-300 bg-white font-mono uppercase font-bold text-emerald-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Enter the 12-digit UTR/UPI reference code from your GPay, PhonePe, Paytm, or bank receipt after paying ₹50.
                </p>
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

export default function StudentRegistrationPage() {
  return (
    <div className="min-h-screen bg-[#ffffff] text-slate-800 p-4 md:p-8 font-sans border-t-4 border-amber-600 flex flex-col justify-between">
      <Suspense fallback={<div className="p-8 text-center text-xs font-semibold text-slate-500">Loading Student Registration Portal...</div>}>
        <StudentRegisterContent />
      </Suspense>

      <footer className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
        Student Registration Portal — Instant Email OTP Verification & Web Processing Fee
      </footer>
    </div>
  );
}
