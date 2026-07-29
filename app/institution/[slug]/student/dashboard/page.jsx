'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  GraduationCap, 
  LogOut, 
  ChevronDown,
  BookOpen,
  FileText,
  CheckCircle2,
  Calendar,
  CreditCard,
  Award,
  Send,
  Printer,
  Download,
  AlertCircle,
  Clock,
  User,
  Compass,
  Sparkles,
  Search,
  ExternalLink,
  QrCode,
  Star
} from 'lucide-react';
import { getInstitutions } from '@/lib/institutionsStore';

export default function StudentPortalDashboard() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = params?.slug || 'grgarts';

  // Normalize slug to match GRG or BMSCE
  const cleanSlug = rawSlug.toLowerCase().replace(/[^a-z0-9]/g, '');
  const isGrgSlug = cleanSlug.includes('grg') || cleanSlug.includes('indi') || cleanSlug.includes('yap');
  const slug = isGrgSlug ? 'grgarts' : rawSlug;

  const [student, setStudent] = useState(null);
  const [institution, setInstitution] = useState(null);
  
  // Navigation & Active Sub-views
  const [activeTab, setActiveTab] = useState('HOME'); // 'HOME', 'FEE', 'FEEDBACK', 'REGISTRATION', 'HALL-TICKET', 'OTHERS', 'APPLY_FORMS', 'RESULTS'
  const [feedbackType, setFeedbackType] = useState('FACULTY'); // 'FACULTY' or 'COURSE'
  const [othersSubTab, setOthersSubTab] = useState('SEATING'); // 'SEATING', 'TIMETABLE', 'CIRCULARS'
  const [theme, setTheme] = useState('CLASSIC'); // 'CLASSIC', 'DARK', 'SLATE'
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);
  const [showDetailedCourseModal, setShowDetailedCourseModal] = useState(false);

  // Form & Interaction States
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [revalSubmitted, setRevalSubmitted] = useState(false);
  const [showPayFeeModal, setShowPayFeeModal] = useState(false);
  const [feeUtr, setFeeUtr] = useState('');
  const [feePaidSuccess, setFeePaidSuccess] = useState(false);

  useEffect(() => {
    // Read session from local storage or set default realistic student
    const sessionStr = localStorage.getItem(`student_session_${slug}`);
    let currentStudent = null;

    if (sessionStr) {
      try {
        currentStudent = JSON.parse(sessionStr);
      } catch (e) {}
    }

    if (!currentStudent) {
      // Redirect to student registration page if no session is active
      router.push(`/institution/${slug}/student/register`);
      return;
    }

    setStudent(currentStudent);

    // Fetch institution details
    const instList = getInstitutions();
    const inst = instList.find(i => i.slug === slug || i.code.toLowerCase() === slug.toLowerCase() || (isGrgSlug && i.slug === 'grgarts'));
    
    if (inst) {
      setInstitution(inst);
    } else if (isGrgSlug) {
      setInstitution({
        name: 'G.R.G. Arts & Y.A.P. Commerce College, Indi',
        code: 'GRG-INDI-01',
        location: 'Indi, Vijayapura, Karnataka',
        slug: 'grgarts'
      });
    } else {
      setInstitution({
        name: 'B.M.S. College of Engineering',
        code: 'BMSCE-01',
        location: 'Bengaluru, Karnataka',
        slug: 'bmsce'
      });
    }
  }, [slug, rawSlug, isGrgSlug]);

  const handleLogout = () => {
    localStorage.removeItem(`student_session_${slug}`);
    router.push(`/institution/${slug}/student/login`);
  };

  const handlePrintHallTicket = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const toggleTheme = () => {
    if (theme === 'CLASSIC') setTheme('DARK');
    else if (theme === 'DARK') setTheme('SLATE');
    else setTheme('CLASSIC');
  };

  const currentCourse = student?.courses?.[selectedCourseIndex] || student?.courses?.[0];
  const presentCount = currentCourse?.presentTable?.length || 8;
  const absentCount = currentCourse?.absentTable?.length || 2;
  const stillToGo = currentCourse?.stillToGo || 0;

  const evals = currentCourse?.evaluations || {
    test1: 18, test1Max: 20,
    test2: 17, test2Max: 20,
    test3: 19, test3Max: 20,
    aat1: 9, aat1Max: 10,
    finalIa: 45, finalIaMax: 50,
    attendancePercent: 88
  };

  // Theme styling overrides
  const isDark = theme === 'DARK';
  const isSlate = theme === 'SLATE';

  const containerBg = isDark ? 'bg-[#18181b] text-slate-100' : isSlate ? 'bg-[#0f172a] text-slate-100' : 'bg-[#f4f6f9] text-slate-800';
  const cardBg = isDark ? 'bg-[#27272a] border-zinc-700 text-white' : isSlate ? 'bg-[#1e293b] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800';

  return (
    <div className={`min-h-screen ${containerBg} font-sans flex flex-col justify-between transition-colors duration-300 print:bg-white print:text-black`}>
      
      <div>
        {/* ========================================== */}
        {/* 1. TOP NAVBAR HEADER (MATCHING SCREENSHOT)  */}
        {/* ========================================== */}
        <header className="bg-[#26272b] text-white border-b border-slate-700 sticky top-0 z-40 shadow-md print:hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
            
            {/* Logo & College Title */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm border border-blue-400">
                <Compass className="w-5 h-5 animate-spin-slow" />
              </div>
              <span className="font-extrabold text-base tracking-wide text-white font-sans flex items-center gap-2">
                {institution?.name || 'G.R.G. Arts & Y.A.P. Commerce College, Indi'}
              </span>
            </div>

            {/* Nav Menu Links */}
            <nav className="hidden lg:flex items-center space-x-1 text-xs font-bold tracking-wider uppercase">
              <button
                onClick={() => setActiveTab('HOME')}
                className={`px-3 py-2 rounded transition-colors ${
                  activeTab === 'HOME' ? 'bg-[#1d4ed8] text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                HOME
              </button>

              <button
                onClick={() => setActiveTab('FEE')}
                className={`px-3 py-2 rounded transition-colors ${
                  activeTab === 'FEE' ? 'bg-[#1d4ed8] text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                FEE
              </button>

              {/* FEEDBACK Dropdown */}
              <div className="relative group">
                <button
                  onClick={() => setActiveTab('FEEDBACK')}
                  className={`px-3 py-2 rounded transition-colors flex items-center space-x-1 ${
                    activeTab === 'FEEDBACK' ? 'bg-[#1d4ed8] text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>FEEDBACK</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                <div className="absolute left-0 top-full hidden group-hover:block bg-[#1f2937] text-slate-200 rounded shadow-xl border border-slate-700 py-1 min-w-[160px] z-50">
                  <button
                    onClick={() => { setActiveTab('FEEDBACK'); setFeedbackType('FACULTY'); }}
                    className="w-full text-left px-4 py-2 text-[11px] hover:bg-blue-600 hover:text-white"
                  >
                    FACULTY FEEDBACK
                  </button>
                  <button
                    onClick={() => { setActiveTab('FEEDBACK'); setFeedbackType('COURSE'); }}
                    className="w-full text-left px-4 py-2 text-[11px] hover:bg-blue-600 hover:text-white"
                  >
                    COURSE FEEDBACK
                  </button>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('REGISTRATION')}
                className={`px-3 py-2 rounded transition-colors ${
                  activeTab === 'REGISTRATION' ? 'bg-[#1d4ed8] text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                REGISTRATION
              </button>

              <button
                onClick={() => setActiveTab('HALL-TICKET')}
                className={`px-3 py-2 rounded transition-colors ${
                  activeTab === 'HALL-TICKET' ? 'bg-[#1d4ed8] text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                HALL-TICKET
              </button>

              {/* OTHERS Dropdown */}
              <div className="relative group">
                <button
                  onClick={() => setActiveTab('OTHERS')}
                  className={`px-3 py-2 rounded transition-colors flex items-center space-x-1 ${
                    activeTab === 'OTHERS' ? 'bg-[#1d4ed8] text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>OTHERS</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                <div className="absolute left-0 top-full hidden group-hover:block bg-[#1f2937] text-slate-200 rounded shadow-xl border border-slate-700 py-1 min-w-[160px] z-50">
                  <button
                    onClick={() => { setActiveTab('OTHERS'); setOthersSubTab('SEATING'); }}
                    className="w-full text-left px-4 py-2 text-[11px] hover:bg-blue-600 hover:text-white"
                  >
                    SEATING DATA
                  </button>
                  <button
                    onClick={() => { setActiveTab('OTHERS'); setOthersSubTab('TIMETABLE'); }}
                    className="w-full text-left px-4 py-2 text-[11px] hover:bg-blue-600 hover:text-white"
                  >
                    EXAM TIMETABLE
                  </button>
                  <button
                    onClick={() => { setActiveTab('OTHERS'); setOthersSubTab('CIRCULARS'); }}
                    className="w-full text-left px-4 py-2 text-[11px] hover:bg-blue-600 hover:text-white"
                  >
                    CIRCULARS & NOTICES
                  </button>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('APPLY_FORMS')}
                className={`px-3 py-2 rounded transition-colors ${
                  activeTab === 'APPLY_FORMS' ? 'bg-[#1d4ed8] text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                APPLY FORMS
              </button>

              <button
                onClick={() => setActiveTab('RESULTS')}
                className={`px-3 py-2 rounded transition-colors ${
                  activeTab === 'RESULTS' ? 'bg-[#1d4ed8] text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                RESULTS
              </button>

              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded text-red-300 hover:text-white hover:bg-red-600 transition-colors"
              >
                LOGOUT
              </button>
            </nav>

            {/* Mobile Menu Icon */}
            <div className="flex lg:hidden items-center space-x-2">
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-bold"
              >
                LOGOUT
              </button>
            </div>
          </div>

          {/* Mobile sub-menu bar */}
          <div className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-[#1e2024] overflow-x-auto text-[11px] font-bold text-slate-300">
            <button onClick={() => setActiveTab('HOME')} className={`px-2 py-1 ${activeTab === 'HOME' ? 'text-white underline' : ''}`}>HOME</button>
            <button onClick={() => setActiveTab('FEE')} className={`px-2 py-1 ${activeTab === 'FEE' ? 'text-white underline' : ''}`}>FEE</button>
            <button onClick={() => setActiveTab('FEEDBACK')} className={`px-2 py-1 ${activeTab === 'FEEDBACK' ? 'text-white underline' : ''}`}>FEEDBACK</button>
            <button onClick={() => setActiveTab('REGISTRATION')} className={`px-2 py-1 ${activeTab === 'REGISTRATION' ? 'text-white underline' : ''}`}>REGISTRATION</button>
            <button onClick={() => setActiveTab('HALL-TICKET')} className={`px-2 py-1 ${activeTab === 'HALL-TICKET' ? 'text-white underline' : ''}`}>HALL-TICKET</button>
            <button onClick={() => setActiveTab('OTHERS')} className={`px-2 py-1 ${activeTab === 'OTHERS' ? 'text-white underline' : ''}`}>OTHERS</button>
            <button onClick={() => setActiveTab('APPLY_FORMS')} className={`px-2 py-1 ${activeTab === 'APPLY_FORMS' ? 'text-white underline' : ''}`}>APPLY FORMS</button>
            <button onClick={() => setActiveTab('RESULTS')} className={`px-2 py-1 ${activeTab === 'RESULTS' ? 'text-white underline' : ''}`}>RESULTS</button>
          </div>
        </header>

        {/* Main Content Workspace Wrapper */}
        <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">

          {/* ==================================================== */}
          {/* 2. STUDENT PROFILE HEADER BANNER (EXACT SCREENSHOT) */}
          {/* ==================================================== */}
          <div className="shadow-sm border border-slate-300 rounded-none overflow-hidden print:border-none">
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[110px]">
              
              {/* Left Blue Box: Name & Protruding Circular Avatar */}
              <div className="md:col-span-4 bg-[#1d4ed8] text-white p-5 relative flex items-center justify-between">
                <div>
                  <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-white font-sans">
                    {student?.name || 'Sudeep Suresh Biradar'}
                  </h2>
                </div>

                {/* Overlapping Circular Avatar */}
                <div className="w-24 h-24 rounded-full border-4 border-red-500 overflow-hidden bg-white shadow-xl flex-shrink-0 translate-x-4 md:translate-x-6 z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80" 
                    alt={student?.name}
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>

              {/* Right Light Grey Box: Email, Roll No, Class Info */}
              <div className="md:col-span-8 bg-[#d1d5db] text-slate-800 p-5 flex flex-col justify-between items-end text-right font-sans">
                <div className="text-sm md:text-base font-semibold text-slate-700 font-mono">
                  {student?.email || 'sudeepsuresh.bs24@bmsce.ac.in'}
                </div>
                <div className="text-lg md:text-xl font-bold font-mono text-slate-900 tracking-wider">
                  {student?.rollNo || '1BM24CB050'}
                </div>
                <div className="text-xs md:text-sm font-bold text-slate-700 tracking-wide uppercase">
                  {student?.department || 'B.E-CB'}, {student?.semester || 'SEM 04'}, {student?.section || 'Sec A'}
                </div>
              </div>
            </div>

            {/* Sub-bar: Theme Switcher & Last Updated Date */}
            <div className="bg-[#e5e7eb] px-4 py-2 border-t border-slate-300 flex items-center justify-between text-xs text-slate-700 font-sans print:hidden">
              <button
                onClick={toggleTheme}
                className="bg-[#9ca3af] hover:bg-[#868e96] text-slate-900 px-3 py-1 font-semibold rounded text-xs transition-colors shadow-sm"
              >
                Switch Theme
              </button>
              <span className="font-semibold text-slate-600">
                Last Updated On: {new Date().toLocaleDateString('en-GB')}
              </span>
            </div>
          </div>

          {/* ==================================================== */}
          {/* 3. HOME TAB / MAIN DASHBOARD (EXACT MATCH SCREENSHOT)*/}
          {/* ==================================================== */}
          {activeTab === 'HOME' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Course registration - CIE and attendance status Header */}
              <div className={`${cardBg} p-5 border shadow-sm`}>
                <h3 className="text-lg font-bold tracking-tight text-slate-900 font-sans mb-4">
                  Course registration - CIE and attendance status
                </h3>

                {/* Summary Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b border-slate-300 text-slate-700 font-extrabold uppercase tracking-wider text-[11px] bg-slate-50">
                        <th className="py-3 px-4">COURSE CODE</th>
                        <th className="py-3 px-4">COURSE NAME</th>
                        <th className="py-3 px-4">NOTES</th>
                        <th className="py-3 px-4">ATTENDANCE</th>
                        <th className="py-3 px-4">CIE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {student?.courses?.map((course, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                            {course.code}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800">
                            {course.title}
                          </td>
                          <td className="py-3.5 px-4">
                            <a 
                              href={course.notesUrl || '#'} 
                              onClick={(e) => { e.preventDefault(); alert(`Downloading study materials & notes for ${course.code}`); }}
                              className="inline-flex items-center space-x-1 text-indigo-700 hover:text-indigo-900 font-bold underline"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View Notes</span>
                            </a>
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => { setSelectedCourseIndex(idx); setShowDetailedCourseModal(true); }}
                              className="inline-flex items-center space-x-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded font-mono font-bold hover:bg-emerald-200 transition-colors"
                            >
                              <span>{course.evaluations?.attendancePercent || 88}%</span>
                              <span className="text-[10px] text-emerald-700 font-sans font-normal">(View Details)</span>
                            </button>
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => { setSelectedCourseIndex(idx); setShowDetailedCourseModal(true); }}
                              className="inline-flex items-center space-x-1.5 bg-indigo-100 text-indigo-800 border border-indigo-300 px-2.5 py-1 rounded font-mono font-bold hover:bg-indigo-200 transition-colors"
                            >
                              <span>{course.evaluations?.finalIa || 45} / 50</span>
                              <span className="text-[10px] text-indigo-700 font-sans font-normal">(View Scores)</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Detailed Breakdown Card below Table */}
              <div className={`${cardBg} p-5 border shadow-sm space-y-5`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-3 gap-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-slate-700 uppercase">Inspect Detailed Breakdown For:</span>
                    <select
                      value={selectedCourseIndex}
                      onChange={(e) => setSelectedCourseIndex(Number(e.target.value))}
                      className="px-3 py-1.5 rounded bg-slate-100 border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none"
                    >
                      {student?.courses?.map((c, i) => (
                        <option key={i} value={i}>
                          {c.code} - {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded border border-indigo-200">
                    FACULTY: {currentCourse?.instructor} ({currentCourse?.instructorRole || 'Faculty'})
                  </span>
                </div>

                {/* Dual Grid: Attendance Badges & Marks Table */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  
                  {/* Left Column: Attendance Percentage & Pills */}
                  <div className="md:col-span-6 bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">Attendance Percentage</span>
                      <span className="bg-[#1e3a8a] text-white text-xs font-mono font-bold px-3 py-1 rounded">
                        OVERALL : {evals.attendancePercent || 88} %
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="bg-[#15803d] text-white text-xs font-mono font-bold px-2.5 py-1 rounded">
                        PRESENT[{presentCount}]
                      </span>
                      <span className="bg-[#dc2626] text-white text-xs font-mono font-bold px-2.5 py-1 rounded">
                        ABSENT[{absentCount}]
                      </span>
                      <span className="bg-[#475569] text-white text-xs font-mono font-bold px-2.5 py-1 rounded">
                        STILL TO GO [{stillToGo}]
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-200">
                      <div 
                        className="bg-[#16a34a] h-full" 
                        style={{ width: `${evals.attendancePercent || 88}%` }}
                      ></div>
                      <div 
                        className="bg-[#dc2626] h-full" 
                        style={{ width: `${100 - (evals.attendancePercent || 88)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Right Column: CIE Test Marks Summary Table */}
                  <div className="md:col-span-6 bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-900 uppercase block">
                      CIE Test Marks Summary — {currentCourse?.code}
                    </span>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-sans">
                        <thead>
                          <tr className="border-b border-slate-300 text-slate-700 font-bold uppercase text-[10px]">
                            <th className="py-2 px-2">TEST 1</th>
                            <th className="py-2 px-2">TEST 2</th>
                            <th className="py-2 px-2">TEST 3</th>
                            <th className="py-2 px-2">AAT1</th>
                            <th className="py-2 px-2">FINAL IA</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="font-mono text-slate-900 font-bold text-xs">
                            <td className="py-2 px-2">{evals.test1 || 18} / 20</td>
                            <td className="py-2 px-2">{evals.test2 || 17} / 20</td>
                            <td className="py-2 px-2">{evals.test3 || 19} / 20</td>
                            <td className="py-2 px-2">{evals.aat1 || 9} / 10</td>
                            <td className="py-2 px-2 text-indigo-700 font-extrabold">{evals.finalIa || 45} / 50</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Attendance Present & Absent Detailed Tables */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
                  
                  {/* Present Table */}
                  <div className="md:col-span-6 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-900">Present Log</span>
                      <span className="bg-[#15803d] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                        CLASSES {presentCount}
                      </span>
                    </div>
                    <div className="overflow-x-auto border border-slate-200 rounded">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700 text-[10px]">
                          <tr>
                            <th className="py-2 px-3">SL NO</th>
                            <th className="py-2 px-3">DATE</th>
                            <th className="py-2 px-3">TIME</th>
                            <th className="py-2 px-3">STATUS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {currentCourse?.presentTable?.map((row, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                              <td className="py-2 px-3 font-mono text-slate-600">{row.slNo}</td>
                              <td className="py-2 px-3 font-mono text-slate-800 font-medium">{row.date}</td>
                              <td className="py-2 px-3 font-mono text-slate-600">{row.time}</td>
                              <td className="py-2 px-3 text-emerald-700 font-bold">{row.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Absent Table */}
                  <div className="md:col-span-6 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-900">Absent Log</span>
                      <span className="bg-[#dc2626] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                        CLASSES {absentCount}
                      </span>
                    </div>
                    <div className="overflow-x-auto border border-slate-200 rounded">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700 text-[10px]">
                          <tr>
                            <th className="py-2 px-3">SL NO</th>
                            <th className="py-2 px-3">DATE</th>
                            <th className="py-2 px-3">TIME</th>
                            <th className="py-2 px-3">STATUS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {currentCourse?.absentTable?.map((row, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                              <td className="py-2 px-3 font-mono text-slate-600">{row.slNo}</td>
                              <td className="py-2 px-3 font-mono text-slate-800 font-medium">{row.date}</td>
                              <td className="py-2 px-3 font-mono text-slate-600">{row.time}</td>
                              <td className="py-2 px-3 text-red-600 font-bold">{row.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* 4. FEE MODULE TAB                                    */}
          {/* ==================================================== */}
          {activeTab === 'FEE' && (
            <div className={`${cardBg} p-6 border shadow-sm space-y-6 animate-fadeIn`}>
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Student Fee Ledger & Online Payments
                  </h3>
                  <p className="text-xs text-slate-500">Track paid receipts, tuition fees, and pay online via QR.</p>
                </div>

                <button
                  onClick={() => setShowPayFeeModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold shadow-sm transition-colors flex items-center space-x-1.5"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Pay Fee Online via QR</span>
                </button>
              </div>

              {/* Fee Ledger Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                      <th className="py-3 px-4">INVOICE NO</th>
                      <th className="py-3 px-4">FEE DESCRIPTION</th>
                      <th className="py-3 px-4">AMOUNT</th>
                      <th className="py-3 px-4">DUE DATE</th>
                      <th className="py-3 px-4">STATUS</th>
                      <th className="py-3 px-4 text-right">RECEIPT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">INV-2026-001</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">Web Portal Registration & Processing Fee</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">₹ 50</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">15-02-2026</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded text-[10px] font-mono">
                          PAID ✅
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button 
                          onClick={() => alert('Downloading official fee receipt PDF...')}
                          className="text-blue-600 hover:text-blue-800 font-bold text-xs underline inline-flex items-center space-x-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Receipt PDF</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">INV-2026-002</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">Semester Tuition & Examination Fee</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">₹ 12,500</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">30-08-2026</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded text-[10px] font-mono">
                          PAID ✅
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button 
                          onClick={() => alert('Downloading official tuition fee receipt PDF...')}
                          className="text-blue-600 hover:text-blue-800 font-bold text-xs underline inline-flex items-center space-x-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Receipt PDF</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* 5. FEEDBACK TAB                                      */}
          {/* ==================================================== */}
          {activeTab === 'FEEDBACK' && (
            <div className={`${cardBg} p-6 border shadow-sm space-y-6 animate-fadeIn`}>
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  {feedbackType === 'FACULTY' ? 'Faculty Teaching Feedback' : 'Course Curriculum Feedback'}
                </h3>
                <p className="text-xs text-slate-500">Provide constructive ratings and feedback for your department faculty.</p>
              </div>

              {feedbackSent ? (
                <div className="p-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Thank you! Your feedback has been securely submitted to the Academic Quality Committee.</span>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setFeedbackSent(true);
                  }}
                  className="space-y-4 max-w-xl text-xs"
                >
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Select Faculty / Course:</label>
                    <select className="w-full p-2.5 rounded border border-slate-300 bg-white font-medium">
                      {student?.courses?.map((c, i) => (
                        <option key={i} value={c.code}>
                          {c.instructor} — {c.code} ({c.title})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Rating (1 to 5 Stars):</label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRating(star)}
                          className="p-1 text-2xl focus:outline-none"
                        >
                          <Star className={`w-6 h-6 ${star <= feedbackRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Detailed Comments / Observations:</label>
                    <textarea
                      rows={4}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Write your feedback regarding syllabus coverage, teaching methodology, and clarity..."
                      className="w-full p-2.5 rounded border border-slate-300 bg-white text-slate-900"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-xs shadow-sm flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Feedback</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* 6. REGISTRATION TAB                                  */}
          {/* ==================================================== */}
          {activeTab === 'REGISTRATION' && (
            <div className={`${cardBg} p-6 border shadow-sm space-y-6 animate-fadeIn`}>
              <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Course Registration Confirmation Slip
                  </h3>
                  <p className="text-xs text-slate-500">Official registered core & elective subjects for the current semester.</p>
                </div>
                <span className="bg-blue-100 text-blue-800 font-mono font-bold text-xs px-3 py-1 rounded">
                  TOTAL CREDITS: 22
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                      <th className="py-3 px-4">SL NO</th>
                      <th className="py-3 px-4">COURSE CODE</th>
                      <th className="py-3 px-4">COURSE TITLE</th>
                      <th className="py-3 px-4">TYPE</th>
                      <th className="py-3 px-4">CREDITS</th>
                      <th className="py-3 px-4">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {student?.courses?.map((c, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4 font-mono">{i + 1}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{c.code}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">{c.title}</td>
                        <td className="py-3.5 px-4 text-slate-600">CORE PROGRAM</td>
                        <td className="py-3.5 px-4 font-mono font-bold">4.0</td>
                        <td className="py-3.5 px-4">
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                            REGISTERED ✅
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* 7. HALL-TICKET TAB (PRINTABLE ADMISSION TICKET)      */}
          {/* ==================================================== */}
          {activeTab === 'HALL-TICKET' && (
            <div className={`${cardBg} p-8 border shadow-md space-y-6 animate-fadeIn print:p-0 print:border-none`}>
              <div className="flex items-center justify-between border-b border-slate-300 pb-4 print:hidden">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Printer className="w-5 h-5 text-indigo-600" />
                  Semester Examination Hall Ticket / Admission Ticket
                </h3>

                <button
                  onClick={handlePrintHallTicket}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold shadow-sm transition-colors flex items-center space-x-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Admission Ticket</span>
                </button>
              </div>

              {/* Printable Ticket Box */}
              <div className="border-2 border-slate-900 p-6 space-y-6 bg-white text-black font-sans">
                {/* Header */}
                <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                  <h2 className="text-xl font-extrabold uppercase tracking-wide">
                    {institution?.name || 'G.R.G. Arts & Y.A.P. Commerce College, Indi'}
                  </h2>
                  <p className="text-xs font-semibold">AFILIATED TO RANI CHANNAMMA UNIVERSITY, BELAGAVI</p>
                  <p className="text-sm font-extrabold underline uppercase pt-1">
                    SEMESTER END EXAMINATION ADMISSION TICKET — 2026
                  </p>
                </div>

                {/* Student Details Grid */}
                <div className="grid grid-cols-12 gap-4 text-xs">
                  <div className="col-span-9 space-y-2">
                    <div>
                      <span className="font-bold">STUDENT NAME: </span>
                      <span className="font-bold text-sm uppercase">{student?.name}</span>
                    </div>
                    <div>
                      <span className="font-bold">USN / REG NO: </span>
                      <span className="font-mono font-bold text-sm">{student?.rollNo}</span>
                    </div>
                    <div>
                      <span className="font-bold">DEGREE / BRANCH: </span>
                      <span>{student?.department} ({student?.semester})</span>
                    </div>
                    <div>
                      <span className="font-bold">CENTER CODE & NAME: </span>
                      <span>GRG-01 / Main Campus Auditorium</span>
                    </div>
                  </div>

                  {/* Photo & Stamp Box */}
                  <div className="col-span-3 flex flex-col items-center justify-center border border-slate-400 p-2">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                      alt="Student Photo"
                      className="w-20 h-24 object-cover border border-slate-900"
                    />
                    <span className="text-[9px] font-bold mt-1 uppercase">VERIFIED</span>
                  </div>
                </div>

                {/* Exam Schedule Table */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase block">Course Examination Timetable</span>
                  <table className="w-full text-left text-xs border-collapse border border-slate-900">
                    <thead>
                      <tr className="bg-slate-200 border-b border-slate-900 font-bold uppercase text-[10px]">
                        <th className="border border-slate-900 py-2 px-3">SL NO</th>
                        <th className="border border-slate-900 py-2 px-3">SUBJECT CODE</th>
                        <th className="border border-slate-900 py-2 px-3">SUBJECT TITLE</th>
                        <th className="border border-slate-900 py-2 px-3">EXAM DATE</th>
                        <th className="border border-slate-900 py-2 px-3">TIME SLOT</th>
                        <th className="border border-slate-900 py-2 px-3">INVIGILATOR SIGN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {student?.courses?.map((c, idx) => (
                        <tr key={idx} className="border-b border-slate-900">
                          <td className="border border-slate-900 py-2 px-3 font-mono">{idx + 1}</td>
                          <td className="border border-slate-900 py-2 px-3 font-mono font-bold">{c.code}</td>
                          <td className="border border-slate-900 py-2 px-3 font-bold">{c.title}</td>
                          <td className="border border-slate-900 py-2 px-3 font-mono">1{idx + 2}-08-2026</td>
                          <td className="border border-slate-900 py-2 px-3 font-mono">10:00 AM - 01:00 PM</td>
                          <td className="border border-slate-900 py-2 px-3"></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Signatures Footer */}
                <div className="flex justify-between items-end pt-8 text-xs font-bold">
                  <div className="text-center">
                    <p className="border-t border-slate-900 pt-1 w-36">Candidate Signature</p>
                  </div>
                  <div className="text-center">
                    <p className="border-t border-slate-900 pt-1 w-44">Controller of Examinations</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* 8. OTHERS TAB (SEATING DATA, TIMETABLE, CIRCULARS)   */}
          {/* ==================================================== */}
          {activeTab === 'OTHERS' && (
            <div className={`${cardBg} p-6 border shadow-sm space-y-6 animate-fadeIn`}>
              <div className="flex items-center space-x-3 border-b border-slate-200 pb-3 text-xs font-bold">
                <button
                  onClick={() => setOthersSubTab('SEATING')}
                  className={`px-4 py-2 rounded ${othersSubTab === 'SEATING' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                  SEATING DATA
                </button>
                <button
                  onClick={() => setOthersSubTab('TIMETABLE')}
                  className={`px-4 py-2 rounded ${othersSubTab === 'TIMETABLE' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                  EXAM TIMETABLE
                </button>
                <button
                  onClick={() => setOthersSubTab('CIRCULARS')}
                  className={`px-4 py-2 rounded ${othersSubTab === 'CIRCULARS' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                  CIRCULARS & NOTICES
                </button>
              </div>

              {othersSubTab === 'SEATING' && (
                <div className="space-y-4 text-xs">
                  <h4 className="font-bold text-slate-900 text-sm">Exam Seating Allocation</h4>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
                    <div>
                      <span className="text-slate-500 block">EXAM HALL NO:</span>
                      <span className="text-lg font-bold text-slate-900">Hall #104 (Block A)</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">BENCH NO:</span>
                      <span className="text-lg font-bold text-blue-700">Row 3 / Bench B-12</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">REPORTING TIME:</span>
                      <span className="text-lg font-bold text-emerald-700">09:30 AM</span>
                    </div>
                  </div>
                </div>
              )}

              {othersSubTab === 'TIMETABLE' && (
                <div className="space-y-4 text-xs">
                  <h4 className="font-bold text-slate-900 text-sm">Semester End Exam Schedule</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                          <th className="py-2.5 px-3">DATE</th>
                          <th className="py-2.5 px-3">SUBJECT CODE</th>
                          <th className="py-2.5 px-3">SUBJECT NAME</th>
                          <th className="py-2.5 px-3">TIME</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-mono">
                        {student?.courses?.map((c, i) => (
                          <tr key={i}>
                            <td className="py-3 px-3 font-bold">1{i + 2}-08-2026</td>
                            <td className="py-3 px-3 text-blue-700 font-bold">{c.code}</td>
                            <td className="py-3 px-3 font-sans font-semibold text-slate-800">{c.title}</td>
                            <td className="py-3 px-3">10:00 AM TO 01:00 PM</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {othersSubTab === 'CIRCULARS' && (
                <div className="space-y-3 text-xs">
                  <h4 className="font-bold text-slate-900 text-sm">Official College Announcements</h4>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-950 space-y-1">
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>📢 Notification: Semester Examination Fee Deadline</span>
                      <span className="font-mono text-[10px] text-blue-700">20-07-2026</span>
                    </div>
                    <p>All degree college students are requested to complete exam form submission before 10th August 2026.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* 9. APPLY FORMS TAB                                   */}
          {/* ==================================================== */}
          {activeTab === 'APPLY_FORMS' && (
            <div className={`${cardBg} p-6 border shadow-sm space-y-6 animate-fadeIn`}>
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Academic Application Forms Portal
                </h3>
                <p className="text-xs text-slate-500">Apply for answer script re-evaluation, photocopy, or make-up exams.</p>
              </div>

              {revalSubmitted ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs font-semibold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Application submitted successfully! Tracking Ref ID: REVAL-2026-9812</span>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => { e.preventDefault(); setRevalSubmitted(true); }}
                  className="space-y-4 max-w-lg text-xs"
                >
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Select Application Type:</label>
                    <select className="w-full p-2.5 rounded border border-slate-300 bg-white font-medium">
                      <option value="REVAL">Re-evaluation of Answer Script (₹300/subject)</option>
                      <option value="PHOTOCOPY">Photocopy of Answer Script (₹150/subject)</option>
                      <option value="MAKEUP">Make-up / Supplementary Exam Registration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Select Subject:</label>
                    <select className="w-full p-2.5 rounded border border-slate-300 bg-white font-medium">
                      {student?.courses?.map((c, i) => (
                        <option key={i} value={c.code}>
                          {c.code} — {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-xs shadow-sm"
                  >
                    Submit Application
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* 10. RESULTS TAB (SGPA / CGPA GRADE CARD)             */}
          {/* ==================================================== */}
          {activeTab === 'RESULTS' && (
            <div className={`${cardBg} p-6 border shadow-sm space-y-6 animate-fadeIn`}>
              <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    Semester Grade Card & Performance Summary
                  </h3>
                  <p className="text-xs text-slate-500">Official SGPA & CGPA Statement from University Examination Cell.</p>
                </div>

                <div className="flex items-center space-x-3 text-xs font-mono font-bold">
                  <div className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded">
                    SGPA: 8.85
                  </div>
                  <div className="bg-blue-100 text-blue-900 border border-blue-300 px-3 py-1.5 rounded">
                    CGPA: 8.92
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                      <th className="py-3 px-4">COURSE CODE</th>
                      <th className="py-3 px-4">COURSE TITLE</th>
                      <th className="py-3 px-4">CIE (50)</th>
                      <th className="py-3 px-4">SEE (50)</th>
                      <th className="py-3 px-4">TOTAL (100)</th>
                      <th className="py-3 px-4">GRADE</th>
                      <th className="py-3 px-4">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {student?.courses?.map((c, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{c.code}</td>
                        <td className="py-3.5 px-4 font-sans font-semibold text-slate-800">{c.title}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">{c.evaluations?.finalIa || 45}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">42</td>
                        <td className="py-3.5 px-4 font-bold text-indigo-700">{(c.evaluations?.finalIa || 45) + 42}</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-700">A+</td>
                        <td className="py-3.5 px-4">
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                            PASS ✅
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-300 py-4 text-center text-xs text-slate-500 bg-white print:hidden">
        © 2026 {institution?.name || 'G.R.G. Arts & Y.A.P. Commerce College, Indi'} — Student Academic Portal System
      </footer>

      {/* Pay Fee Modal */}
      {showPayFeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-xl p-6 border border-slate-200 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-600" />
                Pay Fee via UPI QR Code
              </h3>
              <button onClick={() => setShowPayFeeModal(false)} className="text-slate-400 hover:text-slate-800">✕</button>
            </div>

            {feePaidSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded space-y-2 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p>Fee Payment Verification Submitted! Receipt will be updated shortly.</p>
              </div>
            ) : (
              <form 
                onSubmit={(e) => { e.preventDefault(); setFeePaidSuccess(true); }}
                className="space-y-4 text-xs"
              >
                <div className="flex flex-col items-center p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="w-36 h-36 bg-white border-2 border-emerald-500 rounded p-2 flex items-center justify-center">
                    <img src="/qr-payment.png" alt="Scan QR Code" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-mono font-bold text-slate-800 mt-2">grgindi.fee@upi</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Enter Transaction Reference / UTR No:</label>
                  <input
                    type="text"
                    required
                    value={feeUtr}
                    onChange={(e) => setFeeUtr(e.target.value.toUpperCase())}
                    placeholder="e.g. UPI/420911849201"
                    className="w-full p-2.5 rounded border border-slate-300 font-mono font-bold text-slate-900 uppercase"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-sm"
                >
                  Verify UTR & Update Fee Ledger
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
