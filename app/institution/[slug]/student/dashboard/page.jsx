'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  GraduationCap, 
  LogOut, 
  ChevronRight
} from 'lucide-react';
import { getInstitutions } from '@/lib/institutionsStore';

export default function StudentPortalDashboard() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug || 'bmsce';

  const [student, setStudent] = useState(null);
  const [institution, setInstitution] = useState(null);
  const [activeTab, setActiveTab] = useState('ATTENDANCE'); // 'ATTENDANCE', 'TEST_MARKS'
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);

  useEffect(() => {
    // Clear stale local storage if needed
    if (typeof window !== 'undefined') {
      const storedSession = localStorage.getItem(`student_session_${slug}`);
      if (storedSession) {
        try {
          const parsed = JSON.parse(storedSession);
          if (parsed.courses && parsed.courses[0]?.presentTable?.length > 8) {
            localStorage.removeItem(`student_session_${slug}`);
            localStorage.removeItem('students_store_v1');
          }
        } catch (e) {}
      }
    }

    const sessionStr = localStorage.getItem(`student_session_${slug}`);
    if (sessionStr) {
      const parsed = JSON.parse(sessionStr);
      setStudent(parsed);
    } else {
      // Fallback student dataset
      const fallbackStudent = {
        name: 'Aarav Sharma',
        rollNo: '1BM23CS001',
        email: 'aarav.cs23@bmsce.ac.in',
        department: 'Computer Science & Engineering',
        section: 'Section A',
        semester: 'Class 6',
        feePlan: 'Portal Registration & Processing Fee',
        feeAmount: 50,
        paymentStatus: 'PAID',
        utrNumber: 'UPI/420911849201',
        courses: [
          {
            code: '23BS4PCFLA',
            title: 'FORMAL LANGUAGE AND AUTOMATA THEORY',
            instructor: 'Prof. Rudramurthy',
            instructorRole: 'Assistant Professor, CSE',
            instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            classesAttended: 8,
            totalClasses: 12,
            stillToGo: 0,
            evaluations: {
              test1: 11.0,
              test1Max: 20,
              test2: 13.0,
              test2Max: 20,
              test3: 19.0,
              test3Max: 20,
              aat1: 7.0,
              aat1Max: 10,
              finalIa: 39.0,
              finalIaMax: 50,
              attendancePercent: 89
            },
            presentTable: [
              { slNo: 1, date: '03-03-2026', time: '14:00 TO 15:50', status: 'Present' },
              { slNo: 2, date: '05-03-2026', time: '08:55 TO 09:50', status: 'Present' },
              { slNo: 3, date: '10-03-2026', time: '14:00 TO 15:50', status: 'Present' },
              { slNo: 4, date: '12-03-2026', time: '08:55 TO 09:50', status: 'Present' },
              { slNo: 5, date: '13-03-2026', time: '11:15 TO 12:10', status: 'Present' },
              { slNo: 6, date: '17-03-2026', time: '14:00 TO 15:50', status: 'Present' },
              { slNo: 7, date: '24-03-2026', time: '14:00 TO 15:50', status: 'Present' },
              { slNo: 8, date: '26-03-2026', time: '08:55 TO 09:50', status: 'Present' }
            ],
            absentTable: [
              { slNo: 1, date: '27-02-2026', time: '11:15 TO 12:10', status: 'Absent' },
              { slNo: 2, date: '05-05-2026', time: '14:00 TO 15:50', status: 'Absent' },
              { slNo: 3, date: '12-05-2026', time: '14:00 TO 15:50', status: 'Absent' },
              { slNo: 4, date: '09-06-2026', time: '14:00 TO 15:50', status: 'Absent' }
            ]
          },
          {
            code: '23CS3PCDSA',
            title: 'DATA STRUCTURES AND ALGORITHMS',
            instructor: 'Dr. Suresh V. Nambiar',
            instructorRole: 'Professor & HOD, CSE',
            instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
            classesAttended: 8,
            totalClasses: 12,
            stillToGo: 0,
            evaluations: {
              test1: 16.0,
              test1Max: 20,
              test2: 17.0,
              test2Max: 20,
              test3: 18.0,
              test3Max: 20,
              aat1: 8.5,
              aat1Max: 10,
              finalIa: 43.5,
              finalIaMax: 50,
              attendancePercent: 88
            },
            presentTable: [
              { slNo: 1, date: '02-03-2026', time: '09:30 TO 10:30', status: 'Present' },
              { slNo: 2, date: '04-03-2026', time: '09:30 TO 10:30', status: 'Present' },
              { slNo: 3, date: '09-03-2026', time: '09:30 TO 10:30', status: 'Present' },
              { slNo: 4, date: '11-03-2026', time: '09:30 TO 10:30', status: 'Present' },
              { slNo: 5, date: '16-03-2026', time: '09:30 TO 10:30', status: 'Present' },
              { slNo: 6, date: '18-03-2026', time: '09:30 TO 10:30', status: 'Present' },
              { slNo: 7, date: '23-03-2026', time: '09:30 TO 10:30', status: 'Present' },
              { slNo: 8, date: '25-03-2026', time: '09:30 TO 10:30', status: 'Present' }
            ],
            absentTable: [
              { slNo: 1, date: '10-07-2026', time: '09:30 TO 10:30', status: 'Absent' },
              { slNo: 2, date: '15-07-2026', time: '09:30 TO 10:30', status: 'Absent' },
              { slNo: 3, date: '20-07-2026', time: '09:30 TO 10:30', status: 'Absent' },
              { slNo: 4, date: '23-07-2026', time: '09:30 TO 10:30', status: 'Absent' }
            ]
          }
        ]
      };
      setStudent(fallbackStudent);
    }

    const instList = getInstitutions();
    const inst = instList.find(i => i.slug === slug || i.code.toLowerCase() === slug.toLowerCase());
    setInstitution(inst || { name: 'B.M.S. College of Engineering', code: 'BMSCE-01' });
  }, [slug]);

  const handleLogout = () => {
    localStorage.removeItem(`student_session_${slug}`);
    router.push(`/institution/${slug}/student/login`);
  };

  const currentCourse = student?.courses?.[selectedCourseIndex] || student?.courses?.[0];

  const presentCount = currentCourse?.presentTable?.length || 8;
  const absentCount = currentCourse?.absentTable?.length || 4;
  const stillToGo = currentCourse?.stillToGo || 0;

  const evals = currentCourse?.evaluations || {
    test1: 11, test1Max: 20,
    test2: 13, test2Max: 20,
    test3: 19, test3Max: 20,
    aat1: 7, aat1Max: 10,
    finalIa: 39, finalIaMax: 50,
    attendancePercent: 89
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-slate-800 p-4 md:p-8 font-sans border-t-4 border-indigo-600">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Student Header */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs text-indigo-700 font-mono font-bold">
              <span>STUDENT ACADEMIC PORTAL</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span>{institution?.name}</span>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <GraduationCap className="w-7 h-7 text-indigo-600" />
              {student?.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-0.5">
              <span className="font-mono bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-0.5 rounded font-bold">
                USN / Roll No: {student?.rollNo}
              </span>
              <span className="font-semibold text-slate-800">{student?.section}</span>
              <span className="text-slate-400">• {student?.semester || student?.department}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleLogout}
              className="p-2.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selector Bar & Course Switcher */}
        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Course Selector Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-700">Select Subject:</span>
            <select
              value={selectedCourseIndex}
              onChange={(e) => setSelectedCourseIndex(Number(e.target.value))}
              className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {student?.courses?.map((c, i) => (
                <option key={i} value={i}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Main View Tabs (ATTENDANCE TRACKER & TEST MARKS ONLY) */}
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('ATTENDANCE')}
              className={`px-4 py-1.5 rounded-md transition-all ${
                activeTab === 'ATTENDANCE'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Attendance Tracker
            </button>
            <button
              onClick={() => setActiveTab('TEST_MARKS')}
              className={`px-4 py-1.5 rounded-md transition-all ${
                activeTab === 'TEST_MARKS'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Test Marks
            </button>
          </div>
        </div>

        {/* TAB 1: ATTENDANCE TRACKER */}
        {activeTab === 'ATTENDANCE' && (
          <div className="space-y-5">
            {/* Top Cards Row: Instructor Profile Card + Attendance Percentage/Status Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              
              {/* TOP LEFT CARD: Instructor & Course Name */}
              <div className="md:col-span-6 bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-300">
                  {currentCourse?.instructorAvatar ? (
                    <img 
                      src={currentCourse.instructorAvatar} 
                      alt={currentCourse.instructor} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white font-bold text-xl">
                      {currentCourse?.instructor?.charAt(0) || 'P'}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {currentCourse?.instructor}
                  </h3>
                  <p className="text-xs font-mono font-bold text-slate-600 uppercase mt-0.5">
                    {currentCourse?.code} - {currentCourse?.title}
                  </p>
                </div>
              </div>

              {/* TOP RIGHT CARD: Attendance Percentage & Attendance Status Bar */}
              <div className="md:col-span-6 bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
                {/* Line 1: Attendance Percentage */}
                <div className="flex items-center space-x-3">
                  <span className="text-xl font-bold text-slate-900">Attendance Percentage</span>
                  <span className="bg-[#1e3a8a] text-white text-xs font-mono font-bold px-3 py-1 rounded text-center">
                    OVERALL : {evals.attendancePercent || 89} %
                  </span>
                </div>

                {/* Line 2: Attendance Status Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xl font-bold text-slate-900 mr-1">Attendance Status</span>
                  
                  {/* PRESENT Pill Badge */}
                  <span className="bg-[#15803d] text-white text-xs font-mono font-bold px-2.5 py-1 rounded inline-flex items-center">
                    PRESENT[{presentCount}]
                  </span>

                  {/* ABSENT Pill Badge */}
                  <span className="bg-[#dc2626] text-white text-xs font-mono font-bold px-2.5 py-1 rounded inline-flex items-center">
                    ABSENT[{absentCount}]
                  </span>

                  {/* STILL TO GO Pill Badge */}
                  <span className="bg-[#475569] text-white text-xs font-mono font-bold px-2.5 py-1 rounded inline-flex items-center">
                    STILL TO GO [{stillToGo}]
                  </span>
                </div>

                {/* Dual Color Progress Line */}
                <div className="w-full h-1.5 rounded-full overflow-hidden flex bg-slate-200">
                  <div 
                    className="bg-[#16a34a] h-full transition-all duration-500" 
                    style={{ width: `${evals.attendancePercent || 89}%` }}
                  ></div>
                  <div 
                    className="bg-[#dc2626] h-full transition-all duration-500" 
                    style={{ width: `${100 - (evals.attendancePercent || 89)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Bottom Tables Row: Present Table + Absent List Table */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              
              {/* BOTTOM LEFT CARD: Present Table */}
              <div className="md:col-span-6 bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-base font-bold text-slate-900">Present</span>
                  <span className="bg-[#15803d] text-white text-xs font-mono font-bold px-2.5 py-0.5 rounded">
                    CLASSES {presentCount}
                  </span>
                </div>

                {/* Present Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                        <th className="py-2.5 px-3">SL NO</th>
                        <th className="py-2.5 px-3">DATE</th>
                        <th className="py-2.5 px-3">TIME</th>
                        <th className="py-2.5 px-3">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentCourse?.presentTable?.slice(0, 8).map((row, idx) => (
                        <tr 
                          key={idx} 
                          className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}
                        >
                          <td className="py-3 px-3 font-mono text-slate-600">{row.slNo}</td>
                          <td className="py-3 px-3 font-mono text-slate-800 font-medium">{row.date}</td>
                          <td className="py-3 px-3 font-mono text-slate-600">{row.time}</td>
                          <td className="py-3 px-3 text-slate-900 font-medium">{row.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* BOTTOM RIGHT CARD: Absent List Table */}
              <div className="md:col-span-6 bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-base font-bold text-slate-900">Absent List</span>
                  <span className="bg-[#dc2626] text-white text-xs font-mono font-bold px-2.5 py-0.5 rounded">
                    CLASSES {absentCount}
                  </span>
                </div>

                {/* Absent Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                        <th className="py-2.5 px-3">SL NO</th>
                        <th className="py-2.5 px-3">DATE</th>
                        <th className="py-2.5 px-3">TIME</th>
                        <th className="py-2.5 px-3">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentCourse?.absentTable?.map((row, idx) => (
                        <tr 
                          key={idx} 
                          className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}
                        >
                          <td className="py-3 px-3 font-mono text-slate-600">{row.slNo}</td>
                          <td className="py-3 px-3 font-mono text-slate-800 font-medium">{row.date}</td>
                          <td className="py-3 px-3 font-mono text-slate-600">{row.time}</td>
                          <td className="py-3 px-3 text-slate-900 font-medium">{row.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: TEST MARKS */}
        {activeTab === 'TEST_MARKS' && (
          <div className="space-y-6">
            
            {/* Test Marks Table Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-lg font-extrabold text-slate-900 font-sans">
                  Test Marks Summary — {currentCourse?.title} ({currentCourse?.code})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px] bg-slate-50">
                      <th className="py-3.5 px-5">TEST 1</th>
                      <th className="py-3.5 px-5">TEST 2</th>
                      <th className="py-3.5 px-5">TEST 3</th>
                      <th className="py-3.5 px-5">AAT1</th>
                      <th className="py-3.5 px-5">FINAL IA</th>
                      <th className="py-3.5 px-5">ATTENDANCE %</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-5 font-mono text-slate-900 text-sm font-bold">
                        {(evals.test1 || evals.cie1 || 11)?.toFixed(2)} / 20
                      </td>
                      <td className="py-4 px-5 font-mono text-slate-900 text-sm font-bold">
                        {(evals.test2 || evals.cie2 || 13)?.toFixed(2)} / 20
                      </td>
                      <td className="py-4 px-5 font-mono text-slate-900 text-sm font-bold">
                        {(evals.test3 || evals.cie3 || 19)?.toFixed(2)} / 20
                      </td>
                      <td className="py-4 px-5 font-mono text-slate-900 text-sm font-bold">
                        {evals.aat1?.toFixed(2) || '7.00'} / 10
                      </td>
                      <td className="py-4 px-5 font-mono text-indigo-700 text-sm font-bold">
                        {evals.finalIa || 39} / 50
                      </td>
                      <td className="py-4 px-5 font-mono text-emerald-700 text-sm font-bold">
                        {evals.attendancePercent || 89}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
