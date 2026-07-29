'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  UserCheck, 
  BookOpen, 
  CheckSquare, 
  Award, 
  LogOut, 
  Save, 
  CheckCircle2, 
  Users, 
  ChevronRight, 
  Building2
} from 'lucide-react';
import { getInstitutions } from '@/lib/institutionsStore';
import { updateStudentGradeByTeacher } from '@/lib/systemSync';

export default function TeacherPortalDashboard() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug || 'grgarts';

  const [teacher, setTeacher] = useState(null);
  const [institution, setInstitution] = useState(null);
  const [activeTab, setActiveTab] = useState('COURSES'); // 'COURSES', 'ATTENDANCE', 'EVALUATION'
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Student Roster Data for Selected Course
  const [students, setStudents] = useState([
    {
      id: 'std-101',
      rollNo: '1BM23CS001',
      name: 'Aarav Sharma',
      attendanceStatus: 'PRESENT', // PRESENT, ABSENT, LATE
      evaluations: { test1: 18, test2: 19, midSem: 26, endSem: 45 }
    },
    {
      id: 'std-102',
      rollNo: '1BM23CS002',
      name: 'Ananya Deshmukh',
      attendanceStatus: 'PRESENT',
      evaluations: { test1: 16, test2: 17, midSem: 24, endSem: 42 }
    },
    {
      id: 'std-103',
      rollNo: '1BM23CS003',
      name: 'Bhuvan Gowda',
      attendanceStatus: 'ABSENT',
      evaluations: { test1: 12, test2: 14, midSem: 20, endSem: 34 }
    },
    {
      id: 'std-104',
      rollNo: '1BM23CS004',
      name: 'Diya Kulkarni',
      attendanceStatus: 'PRESENT',
      evaluations: { test1: 20, test2: 19, midSem: 29, endSem: 48 }
    },
    {
      id: 'std-105',
      rollNo: '1BM23CS005',
      name: 'Eshwar Reddy',
      attendanceStatus: 'LATE',
      evaluations: { test1: 14, test2: 15, midSem: 22, endSem: 38 }
    }
  ]);

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    // Load Teacher Session
    const sessionStr = localStorage.getItem(`teacher_session_${slug}`);
    if (sessionStr) {
      const t = JSON.parse(sessionStr);
      setTeacher(t);
      if (t.assignedCourses && t.assignedCourses.length > 0) {
        setSelectedCourse(t.assignedCourses[0]);
      }
    } else {
      // Default fallback teacher for demo
      const fallbackTeacher = {
        name: 'Dr. Suresh V. Nambiar',
        teacherId: 'EMP-BMS-101',
        email: 'prof.suresh@bmsce.ac.in',
        department: 'Computer Science & Engineering',
        designation: 'Professor & HOD',
        assignedCourses: [
          { id: 'crs-1', code: 'CS-201', title: 'Data Structures & Algorithms', semester: 'Semester 3', totalStudents: 64 },
          { id: 'crs-2', code: 'CS-304', title: 'Database Management Systems', semester: 'Semester 5', totalStudents: 58 }
        ]
      };
      setTeacher(fallbackTeacher);
      setSelectedCourse(fallbackTeacher.assignedCourses[0]);
    }

    const instList = getInstitutions();
    const inst = instList.find(i => i.slug === slug || i.code.toLowerCase() === slug.toLowerCase());
    setInstitution(inst || { name: 'B.M.S. College of Engineering', code: 'BMSCE-01' });
  }, [slug]);

  const showToast = (text) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem(`teacher_session_${slug}`);
    router.push(`/institution/${slug}/login`);
  };

  // Toggle Student Attendance
  const toggleAttendance = (studentId, status) => {
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, attendanceStatus: status } : s))
    );
  };

  // Update Evaluation Score
  const updateGrade = (studentId, field, value) => {
    const maxVal = field === 'midSem' ? 30 : field === 'endSem' ? 50 : 20;
    const num = Math.min(Math.max(0, Number(value) || 0), maxVal);
    
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          const updatedEvals = { ...s.evaluations, [field]: num };
          if (selectedCourse?.code) {
            updateStudentGradeByTeacher(s.rollNo || s.id, selectedCourse.code, updatedEvals);
          }
          return { ...s, evaluations: updatedEvals };
        }
        return s;
      })
    );
  };

  const calculateTotal = (evals) => {
    return (evals.test1 || 0) + (evals.test2 || 0) + (evals.midSem || 0) + (evals.endSem || 0);
  };

  const computeLetterGrade = (total) => {
    if (total >= 90) return { grade: 'S (Outstanding)', color: 'text-emerald-700 font-bold' };
    if (total >= 80) return { grade: 'A (Excellent)', color: 'text-teal-700 font-bold' };
    if (total >= 70) return { grade: 'B (Good)', color: 'text-indigo-700 font-bold' };
    if (total >= 50) return { grade: 'C (Average)', color: 'text-amber-700 font-bold' };
    return { grade: 'F (Re-appear)', color: 'text-red-700 font-bold' };
  };

  // Attendance stats
  const presentCount = students.filter(s => s.attendanceStatus === 'PRESENT').length;
  const absentCount = students.filter(s => s.attendanceStatus === 'ABSENT').length;
  const lateCount = students.filter(s => s.attendanceStatus === 'LATE').length;
  const attendanceRate = Math.round(((presentCount + lateCount * 0.5) / students.length) * 100);

  return (
    <div className="min-h-screen bg-[#ffffff] text-slate-800 p-6 md:p-10 font-sans border-t-4 border-emerald-600 pb-16">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-xl shadow-lg bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Shell */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-emerald-700 font-mono font-bold mb-1">
              <span>FACULTY ACADEMIC PORTAL</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span>{institution?.name}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <UserCheck className="w-8 h-8 text-emerald-600" />
              {teacher?.name}
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Faculty ID: <span className="text-emerald-700 font-mono font-bold">{teacher?.teacherId}</span> — {teacher?.designation}, {teacher?.department}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleLogout}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Faculty</span>
            </button>
          </div>
        </div>

        {/* Course Switcher Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-slate-700">Active Teaching Course:</span>
            <select
              value={selectedCourse?.id || ''}
              onChange={(e) => {
                const c = teacher?.assignedCourses?.find(item => item.id === e.target.value);
                if (c) setSelectedCourse(c);
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {teacher?.assignedCourses?.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.title} ({c.semester})
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('COURSES')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'COURSES' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Assigned Courses
            </button>
            <button
              onClick={() => setActiveTab('ATTENDANCE')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'ATTENDANCE' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Attendance Manager
            </button>
            <button
              onClick={() => setActiveTab('EVALUATION')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'EVALUATION' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Evaluation & Marks
            </button>
          </div>
        </div>

        {/* TAB 1: ASSIGNED COURSES */}
        {activeTab === 'COURSES' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              Assigned Academic Courses
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teacher?.assignedCourses?.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md font-bold">
                        {course.code}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{course.semester}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-1">{course.title}</h3>
                    <p className="text-xs text-slate-500 mb-6">Course offered under {teacher?.department}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs">
                    <span className="text-slate-600 flex items-center space-x-1.5 font-medium">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <span>{course.totalStudents} Enrolled Students</span>
                    </span>

                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setActiveTab('EVALUATION');
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-all shadow-sm"
                    >
                      Open Gradebook
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ATTENDANCE MANAGER */}
        {activeTab === 'ATTENDANCE' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                  Attendance Roster — {selectedCourse?.code}: {selectedCourse?.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Mark daily attendance for enrolled students</p>
              </div>

              <div className="flex items-center space-x-4 text-xs font-semibold">
                <span className="text-emerald-700">Present: {presentCount}</span>
                <span className="text-red-700">Absent: {absentCount}</span>
                <span className="text-amber-700">Late: {lateCount}</span>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md font-mono font-bold">
                  {attendanceRate}% Rate
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[10px]">
                    <th className="py-4 px-5">Roll No & Student Name</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5 text-right">Quick Mark Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {students.map((std) => (
                    <tr key={std.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900 text-sm">{std.name}</div>
                        <div className="font-mono text-[10px] text-emerald-700 font-bold mt-0.5">{std.rollNo}</div>
                      </td>

                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                          std.attendanceStatus === 'PRESENT'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : std.attendanceStatus === 'ABSENT'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            std.attendanceStatus === 'PRESENT' ? 'bg-emerald-600' : std.attendanceStatus === 'ABSENT' ? 'bg-red-600' : 'bg-amber-600'
                          }`}></span>
                          <span>{std.attendanceStatus}</span>
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => toggleAttendance(std.id, 'PRESENT')}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                              std.attendanceStatus === 'PRESENT'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            onClick={() => toggleAttendance(std.id, 'ABSENT')}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                              std.attendanceStatus === 'ABSENT'
                                ? 'bg-red-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Absent
                          </button>
                          <button
                            onClick={() => toggleAttendance(std.id, 'LATE')}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                              std.attendanceStatus === 'LATE'
                                ? 'bg-amber-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Late
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => showToast('Attendance roster saved successfully!')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs shadow-sm flex items-center space-x-2 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Attendance Sheet</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: STUDENT EVALUATION GRADEBOOK */}
        {activeTab === 'EVALUATION' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  Student Evaluation Gradebook — {selectedCourse?.code}: {selectedCourse?.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Input evaluation scores across required components: <span className="text-emerald-700 font-semibold font-mono">Test 1, Test 2, Mid Sem, End Sem</span>
                </p>
              </div>

              <button
                onClick={() => showToast('Evaluation scores saved to institution database!')}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs shadow-sm flex items-center space-x-2 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save & Compute Grades</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[10px]">
                      <th className="py-4 px-5">Roll No & Student Name</th>
                      <th className="py-4 px-5 text-center">Test 1 (Max 20)</th>
                      <th className="py-4 px-5 text-center">Test 2 (Max 20)</th>
                      <th className="py-4 px-5 text-center">Mid Sem (Max 30)</th>
                      <th className="py-4 px-5 text-center">End Sem (Max 50)</th>
                      <th className="py-4 px-5 text-center">Total Score (Max 120)</th>
                      <th className="py-4 px-5 text-center">Calculated Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {students.map((std) => {
                      const total = calculateTotal(std.evaluations);
                      const gradeObj = computeLetterGrade(total);
                      return (
                        <tr key={std.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-5">
                            <div className="font-bold text-slate-900 text-sm">{std.name}</div>
                            <div className="font-mono text-[10px] text-emerald-700 font-bold mt-0.5">{std.rollNo}</div>
                          </td>

                          {/* Test 1 */}
                          <td className="py-4 px-5 text-center">
                            <input
                              type="number"
                              min={0}
                              max={20}
                              value={std.evaluations.test1}
                              onChange={(e) => updateGrade(std.id, 'test1', e.target.value)}
                              className="w-16 text-center py-1.5 rounded-lg border border-slate-300 bg-white font-mono text-slate-900 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </td>

                          {/* Test 2 */}
                          <td className="py-4 px-5 text-center">
                            <input
                              type="number"
                              min={0}
                              max={20}
                              value={std.evaluations.test2}
                              onChange={(e) => updateGrade(std.id, 'test2', e.target.value)}
                              className="w-16 text-center py-1.5 rounded-lg border border-slate-300 bg-white font-mono text-slate-900 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </td>

                          {/* Mid Sem */}
                          <td className="py-4 px-5 text-center">
                            <input
                              type="number"
                              min={0}
                              max={30}
                              value={std.evaluations.midSem}
                              onChange={(e) => updateGrade(std.id, 'midSem', e.target.value)}
                              className="w-16 text-center py-1.5 rounded-lg border border-slate-300 bg-white font-mono text-slate-900 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </td>

                          {/* End Sem */}
                          <td className="py-4 px-5 text-center">
                            <input
                              type="number"
                              min={0}
                              max={50}
                              value={std.evaluations.endSem}
                              onChange={(e) => updateGrade(std.id, 'endSem', e.target.value)}
                              className="w-16 text-center py-1.5 rounded-lg border border-slate-300 bg-white font-mono text-slate-900 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </td>

                          {/* Total Score */}
                          <td className="py-4 px-5 text-center">
                            <span className="font-mono font-bold text-slate-900 text-sm">
                              {total} / 120
                            </span>
                          </td>

                          {/* Computed Grade */}
                          <td className="py-4 px-5 text-center">
                            <span className={`font-mono text-xs font-bold ${gradeObj.color}`}>
                              {gradeObj.grade}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
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
