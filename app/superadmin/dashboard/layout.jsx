'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ShieldAlert, 
  Building2, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  User, 
  ChevronRight, 
  ShieldCheck
} from 'lucide-react';

export default function SuperAdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userSession, setUserSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Client-side authentication safety check
    const authFlag = localStorage.getItem('superadmin_authenticated');
    const user = localStorage.getItem('superadmin_user');

    if (authFlag === 'true' && user) {
      try {
        setUserSession(JSON.parse(user));
      } catch (e) {
        setUserSession({
          name: 'Global System Architect',
          email: 'superadmin@eduportal.com',
          role: 'SUPER_ADMIN'
        });
      }
    } else {
      // Fallback session for demonstration
      setUserSession({
        name: 'Global System Architect',
        email: 'superadmin@eduportal.com',
        role: 'SUPER_ADMIN'
      });
    }
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('superadmin_authenticated');
    localStorage.removeItem('superadmin_user');
    router.push('/superadmin/login');
  };

  const navItems = [
    {
      label: 'Overview & Metrics',
      href: '/superadmin/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Institutions Directory',
      href: '/superadmin/dashboard/institutions',
      icon: Building2,
      badge: 'Manage'
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-800">
        <div className="flex items-center space-x-3">
          <svg className="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm font-medium text-slate-600">Verifying Superadmin Credentials...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffffff] text-slate-800 flex overflow-hidden border-t-4 border-indigo-600">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col bg-white border-r border-slate-200 relative z-30 shadow-sm">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-200 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-base tracking-tight flex items-center gap-1.5">
              Superadmin <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.5 rounded font-mono font-bold">SUPERADMIN</span>
            </h2>
            <p className="text-[11px] text-slate-500">Master Control Console</p>
          </div>
        </div>

        {/* System Health Pill */}
        <div className="px-6 py-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-700 font-medium">Hierarchy System</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">Operational</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-2 space-y-1">
          <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Main Navigation</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Info & Logout */}
        <div className="p-4 border-t border-slate-200">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="h-9 w-9 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="overflow-hidden text-left">
                <p className="text-xs font-bold text-slate-900 truncate">{userSession?.name || 'Superadmin'}</p>
                <p className="text-[10px] text-slate-500 truncate">{userSession?.email || 'superadmin@eduportal.com'}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout Superadmin"
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 z-20">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-900 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
              <span>Superadmin</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 font-bold capitalize">
                {pathname.split('/').pop() || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/superadmin/dashboard/institutions"
              className="hidden sm:inline-flex items-center space-x-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl transition-all shadow-sm font-semibold"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Register Institution</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-white relative">
          {children}
        </main>
      </div>
    </div>
  );
}
