'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  ExternalLink, 
  Copy, 
  Plus, 
  Layers, 
  ShieldCheck, 
  CreditCard,
  TrendingUp
} from 'lucide-react';
import { getGlobalSystemMetrics } from '@/lib/systemSync';

export default function SuperAdminDashboardOverview() {
  const [metrics, setMetrics] = useState({
    totalInstitutions: 0,
    activeInstitutions: 0,
    totalTeachers: 0,
    approvedTeachers: 0,
    totalStudents: 0,
    activePaidStudents: 0,
    totalRevenue: 0,
    institutionBreakdown: []
  });

  const [copiedSlug, setCopiedSlug] = useState(null);

  useEffect(() => {
    refreshMetrics();
  }, []);

  const refreshMetrics = () => {
    try {
      const data = getGlobalSystemMetrics();
      if (data) {
        setMetrics(data);
      }
    } catch (e) {
      console.error('Error loading superadmin metrics', e);
    }
  };

  const copyPortalLink = (inst) => {
    const pUrl = inst?.portalUrl || `/institution/${inst?.slug || 'bmsce'}/login`;
    const fullUrl = `${window.location.origin}${pUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(inst.slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Superadmin Master Control Center</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Global System Overview & Analytics
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-2xl">
              Cross-institution control center monitoring provisioned institutions, approved faculty rosters, student enrollments, and web processing revenues.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/superadmin/dashboard/institutions"
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs shadow-sm flex items-center space-x-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Register Institution</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Global Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Institutions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Institutions</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{metrics.totalInstitutions}</p>
          <p className="text-[10px] text-emerald-700 mt-1 font-semibold">{metrics.activeInstitutions} Active Portals</p>
        </div>

        {/* Total Teachers */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Faculty Roster</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-extrabold text-purple-900">{metrics.totalTeachers}</p>
          <p className="text-[10px] text-slate-600 mt-1">{metrics.approvedTeachers} Approved Faculty</p>
        </div>

        {/* Total Students */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Students Enrolled</span>
            <GraduationCap className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-amber-900">{metrics.totalStudents}</p>
          <p className="text-[10px] text-slate-600 mt-1">{metrics.activePaidStudents} Registered</p>
        </div>

        {/* Web Portal Fee Collection */}
        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 shadow-sm col-span-2">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Web Processing Fee Collection</span>
            <CreditCard className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-950 font-mono">
            ₹{(metrics.totalRevenue || 0).toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-700 mt-1 flex items-center space-x-1 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>₹50 Web Portal processing revenue across network</span>
          </p>
        </div>
      </div>

      {/* Institution Directory Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Institutions Overview
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Real-time status of connected Institutions, Faculty, Students, and Processing Collections</p>
          </div>

          <button
            onClick={refreshMetrics}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-1"
          >
            <span>Sync Real-Time Metrics</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-4">Institution</th>
                <th className="pb-3 px-4">Faculty Count</th>
                <th className="pb-3 px-4">Student Count</th>
                <th className="pb-3 px-4">Processing Fee Collected</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 px-4">Portal Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {metrics.institutionBreakdown.map((inst) => {
                const targetPortalUrl = inst.portalUrl || `/institution/${inst.slug || 'bmsce'}/login`;
                return (
                  <tr key={inst.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{inst.name}</div>
                      <div className="text-[10px] font-mono text-indigo-600 font-bold mt-0.5">{inst.code}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className="text-purple-700 font-bold">{inst.approvedTeacherCount}</span> / {inst.teacherCount} Teachers
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className="text-amber-700 font-bold">{inst.paidStudentCount}</span> / {inst.studentCount} Students
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                      ₹{(inst.totalRevenue || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        inst.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${inst.status === 'ACTIVE' ? 'bg-emerald-600' : 'bg-red-600'}`}></span>
                        <span>{inst.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={targetPortalUrl}
                          target="_blank"
                          className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-800 rounded-lg transition-all flex items-center space-x-1.5 border border-slate-200 text-[11px]"
                        >
                          <span className="font-mono text-[10px]">{targetPortalUrl}</span>
                          <ExternalLink className="w-3 h-3 text-indigo-600" />
                        </Link>

                        <button
                          onClick={() => copyPortalLink(inst)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                          title="Copy Portal Link"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
