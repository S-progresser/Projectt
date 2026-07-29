'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  Building2, 
  GraduationCap, 
  UserCheck, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  QrCode
} from 'lucide-react';

export default function LandingPage() {
  const tiers = [
    {
      level: 'SUPERADMIN',
      title: 'Superadmin Console',
      description: 'Master Control Center to provision educational institutions, manage administrative credentials, and monitor system metrics.',
      icon: ShieldAlert,
      color: 'bg-indigo-600 text-white',
      link: '/superadmin/dashboard',
      buttonText: 'Access Superadmin Console',
    },
    {
      level: 'INSTITUTION ADMIN',
      title: 'Institution Portal',
      description: 'Institutional administration workspace to manage faculty rosters, student enrollments, and academic departments.',
      icon: Building2,
      color: 'bg-teal-600 text-white',
      link: '/institution/grgarts/admin/dashboard',
      buttonText: 'Access Institution Portal',
    },
    {
      level: 'FACULTY',
      title: 'Faculty Portal',
      description: 'Faculty portal for real-time attendance management, class rosters, and test mark evaluations.',
      icon: UserCheck,
      color: 'bg-emerald-600 text-white',
      link: '/institution/grgarts/teacher/dashboard',
      buttonText: 'Access Faculty Portal',
    },
    {
      level: 'STUDENT',
      title: 'Student Portal',
      description: 'Student academic portal for attendance tracking, course evaluations, and web portal registration.',
      icon: GraduationCap,
      color: 'bg-amber-600 text-white',
      link: '/institution/grgarts/student/register',
      buttonText: 'Access Student Portal',
    },
  ];

  return (
    <div className="min-h-screen bg-[#ffffff] text-slate-800 relative flex flex-col justify-between overflow-hidden font-sans border-t-4 border-indigo-600">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-2">
                EduPortal
              </h1>
              <p className="text-xs text-slate-500">Academic Management Portal Platform</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/institution/grgarts/student/register"
              className="hidden sm:inline-flex items-center space-x-2 text-xs bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl transition-all shadow-sm font-semibold"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Student Registration</span>
            </Link>

            <Link
              href="/superadmin/login"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm flex items-center space-x-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Superadmin Login</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero */}
      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unified Academic Ecosystem</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            G.R.G. Arts & Y.A.P. Commerce College, Indi <br />
            <span className="text-indigo-600">Academic Portal Platform</span>
          </h2>
          <p className="text-slate-600 text-sm md:text-base">
            Comprehensive multi-tier platform connecting Superadmin management, Institution administration, Faculty grading, and Student academic tracking.
          </p>
        </div>

        {/* Quick Access Institutions Bar */}
        <div className="mb-10 max-w-4xl mx-auto p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold">
          <span className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">Active Institution:</span>
          
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/institution/grgarts/student/register"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all shadow-sm flex items-center space-x-1.5"
            >
              <GraduationCap className="w-4 h-4" />
              <span>G.R.G. Arts & Y.A.P. Commerce College, Indi — Student Portal Registration</span>
            </Link>
          </div>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, idx) => {
            const Icon = tier.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${tier.color} shadow-sm`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700">
                      {tier.level}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {tier.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {tier.description}
                  </p>
                </div>

                <div>
                  <Link
                    href={tier.link}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm"
                  >
                    <span>{tier.buttonText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Grid */}
        <div className="mt-12 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-600 w-5 h-5" />
            Complete Academic Platform Capabilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-slate-600">
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-900">1. Superadmin Administration</h4>
              <p className="text-slate-500 text-[11px]">Provision institutions, issue initial access credentials, and manage system configuration.</p>
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-900">2. Institution Administration</h4>
              <p className="text-slate-500 text-[11px]">Approve faculty registrations, manage student rosters filterable by Class and Section.</p>
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-900">3. Faculty Management</h4>
              <p className="text-slate-500 text-[11px]">Track student class attendance and evaluate Test 1, Test 2, Test 3, and Final IA marks.</p>
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-900">4. Student Academic Portal</h4>
              <p className="text-slate-500 text-[11px]">Access attendance breakdown, class schedules, test performance summaries, and web portal registration.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 bg-white">
        © 2026 Academic Management Portal System. All rights reserved.
      </footer>
    </div>
  );
}
