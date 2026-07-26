'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  Users, 
  Search, 
  UserCheck, 
  UserX, 
  Copy, 
  LogOut, 
  ShieldCheck, 
  ChevronRight,
  GraduationCap,
  BookOpen,
  Filter
} from 'lucide-react';
import { getInstitutions } from '@/lib/institutionsStore';
import { getTeachersByInstitution, approveTeacher, rejectTeacher } from '@/lib/teachersStore';
import { getStudentsByInstitution } from '@/lib/studentsStore';

export default function InstitutionAdminDashboard() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug || 'bmsce';

  const [activeTab, setActiveTab] = useState('STUDENTS'); // 'STUDENTS', 'FACULTY'
  const [institution, setInstitution] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [sectionFilter, setSectionFilter] = useState('ALL');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    refreshData();
  }, [slug]);

  const refreshData = () => {
    const instList = getInstitutions();
    const found = instList.find(i => i.slug === slug || i.code.toLowerCase() === slug.toLowerCase());
    setInstitution(found || { name: `${slug.toUpperCase()} College`, code: slug.toUpperCase() });

    const faculty = getTeachersByInstitution(slug);
    setTeachers(faculty);

    const stdList = getStudentsByInstitution(slug);
    setStudents(stdList);
  };

  const handleApproveTeacher = (teacher) => {
    approveTeacher(teacher.id);
    refreshData();
  };

  const handleRejectTeacher = (teacher) => {
    rejectTeacher(teacher.id);
    refreshData();
  };

  const copyRegisterLink = (type) => {
    const url = type === 'student' 
      ? `${window.location.origin}/institution/${slug}/student/register`
      : `${window.location.origin}/institution/${slug}/register`;
    navigator.clipboard.writeText(url);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleLogout = () => {
    localStorage.removeItem(`inst_admin_auth_${slug}`);
    router.push(`/institution/${slug}/login`);
  };

  // Metrics
  const totalFaculty = teachers.length;
  const pendingFaculty = teachers.filter(t => t.status === 'PENDING').length;
  const totalStudents = students.length;

  // Filtered Faculty
  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.teacherId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Filtered Students
  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesClass = classFilter === 'ALL' || s.semester === classFilter;
    const matchesSection = sectionFilter === 'ALL' || s.section === sectionFilter;

    return matchesSearch && matchesClass && matchesSection;
  });

  return (
    <div className="min-h-screen bg-[#ffffff] text-slate-800 p-6 md:p-10 font-sans border-t-4 border-teal-600">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center space-x-2 text-xs text-teal-700 font-mono font-bold mb-1">
              <span>INSTITUTION ADMINISTRATION PORTAL</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span>ACADEMIC MANAGEMENT</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <Building2 className="w-8 h-8 text-teal-600" />
              {institution?.name}
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1">
              Code: <span className="text-teal-700 font-bold font-mono">{institution?.code}</span> — Faculty & Student Academic Management
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => copyRegisterLink('teacher')}
              className="px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedLink === 'teacher' ? 'Copied!' : 'Teacher Link'}</span>
            </button>

            <button
              onClick={() => copyRegisterLink('student')}
              className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedLink === 'student' ? 'Copied!' : 'Student Register Link'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
              title="Logout Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Enrolled Students</span>
              <GraduationCap className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-3xl font-extrabold text-amber-900">{totalStudents}</p>
            <p className="text-[11px] text-slate-500 mt-1">Class 6 to Class 10</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Faculty</span>
              <Users className="w-5 h-5 text-teal-600" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{totalFaculty}</p>
            <p className="text-[11px] text-slate-500 mt-1">{pendingFaculty} Pending approval</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Academic Classes</span>
              <BookOpen className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-3xl font-extrabold text-indigo-900">5 Classes</p>
            <p className="text-[11px] text-slate-500 mt-1">Class 6 to Class 10</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">System Status</span>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-extrabold text-emerald-600">ACTIVE</p>
            <p className="text-[11px] text-slate-500 mt-1">Institution Workspace Live</p>
          </div>
        </div>

        {/* Tab Switcher & Filters Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs w-full md:w-auto font-semibold">
            <button
              onClick={() => setActiveTab('STUDENTS')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'STUDENTS' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Student Roster ({filteredStudents.length} / {totalStudents})
            </button>
            <button
              onClick={() => setActiveTab('FACULTY')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'FACULTY' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Faculty Roster ({totalFaculty})
            </button>
          </div>

          {/* Class & Section Filters */}
          {activeTab === 'STUDENTS' && (
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold w-full md:w-auto">
              <div className="flex items-center space-x-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-600">Class:</span>
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="bg-transparent font-bold text-slate-900 focus:outline-none"
                >
                  <option value="ALL">All Classes (6 to 10)</option>
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                </select>
              </div>

              <div className="flex items-center space-x-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <span className="text-slate-600">Section:</span>
                <select
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value)}
                  className="bg-transparent font-bold text-slate-900 focus:outline-none"
                >
                  <option value="ALL">All Sections (A, B, C)</option>
                  <option value="Section A">Section A</option>
                  <option value="Section B">Section B</option>
                  <option value="Section C">Section C</option>
                </select>
              </div>

              <div className="relative w-full md:w-48">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* TAB 1: STUDENT ENROLLMENT ROSTER */}
        {activeTab === 'STUDENTS' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-2">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Showing {filteredStudents.length} Students</span>
            </div>

            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[10px] z-10">
                  <tr>
                    <th className="py-3.5 px-5">Student Roll No & Name</th>
                    <th className="py-3.5 px-5">Class & Section</th>
                    <th className="py-3.5 px-5">Official Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-slate-500">
                        <GraduationCap className="w-10 h-10 mx-auto text-slate-400 mb-3" />
                        <p className="font-semibold text-sm text-slate-800">No Student Records Found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="font-bold text-slate-900 text-sm">{s.name}</div>
                          <div className="font-mono text-[10px] text-amber-700 font-bold mt-0.5">{s.rollNo}</div>
                        </td>

                        <td className="py-3.5 px-5">
                          <div className="font-bold text-slate-900">{s.semester}</div>
                          <div className="text-[10px] text-slate-500 font-medium">{s.section}</div>
                        </td>

                        <td className="py-3.5 px-5 font-mono text-slate-700 text-[11px]">{s.email}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: FACULTY ROSTER */}
        {activeTab === 'FACULTY' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[10px]">
                    <th className="py-4 px-5">Faculty ID & Name</th>
                    <th className="py-4 px-5">Official Email</th>
                    <th className="py-4 px-5">Department & Designation</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5 text-right">Approval Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredTeachers.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                        <div className="font-mono text-[10px] text-teal-700 font-bold mt-0.5">{t.teacherId}</div>
                      </td>
                      <td className="py-4 px-5 font-mono text-slate-800">{t.email}</td>
                      <td className="py-4 px-5">
                        <div className="font-medium text-slate-900">{t.department}</div>
                        <div className="text-[10px] text-slate-500">{t.designation}</div>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                          t.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          <span>{t.status}</span>
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {t.status !== 'APPROVED' && (
                            <button
                              onClick={() => handleApproveTeacher(t)}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold flex items-center space-x-1 shadow-sm"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}
                          {t.status !== 'REJECTED' && (
                            <button
                              onClick={() => handleRejectTeacher(t)}
                              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 rounded-lg text-[11px] font-semibold flex items-center space-x-1"
                            >
                              <UserX className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
