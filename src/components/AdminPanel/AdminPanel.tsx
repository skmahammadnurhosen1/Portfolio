import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  Folder,
  User,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  ExternalLink,
  Menu,
  X,
  Mail,
} from 'lucide-react';
import { AdminTab, ProjectItem, ProfileData, DashboardStats } from './types';
import { api } from './api';
import { DashboardTab } from './DashboardTab';
import { ProjectsTab } from './ProjectsTab';
import { PersonalDetailsTab } from './PersonalDetailsTab';
import { MessagesTab } from './MessagesTab';
import { SettingsTab } from './SettingsTab';
import { ToastContainer, ToastMessage } from './Toast';

interface AdminPanelProps {
  adminEmail: string;
  onLogout: () => void;
  onBackToPortfolio: () => void;
  onDataChanged?: () => void;
}

export function AdminPanel({
  adminEmail,
  onLogout,
  onBackToPortfolio,
  onDataChanged,
}: AdminPanelProps) {
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [isRealFirebase, setIsRealFirebase] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch all initial data
  const fetchData = useCallback(async () => {
    try {
      const [projectsRes, profileRes, statsRes, meRes] = await Promise.all([
        api.get('/projects'),
        api.get('/profile'),
        api.get('/stats').catch(() => ({ data: null })),
        api.get('/auth/me').catch(() => ({ data: {} })),
      ]);

      if (projectsRes.data) setProjects(projectsRes.data);
      if (profileRes.data) setProfile(profileRes.data);
      if (statsRes.data) setStats(statsRes.data);
      if (meRes.data?.sessionId) setSessionId(meRes.data.sessionId);
      if (meRes.data?.isRealFirebase !== undefined) {
        setIsRealFirebase(meRes.data.isRealFirebase);
      }
      if (onDataChanged) {
        onDataChanged();
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  }, [onDataChanged]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Listen for Single Active Session Concurrent Kickout
  useEffect(() => {
    const handleKickout = (e: any) => {
      const message = e.detail?.message || 'Session terminated because account was accessed from another device.';
      showToast('error', message);
      setTimeout(() => {
        onLogout();
      }, 1800);
    };

    window.addEventListener('noor_admin_kickout', handleKickout);
    return () => window.removeEventListener('noor_admin_kickout', handleKickout);
  }, [onLogout]);

  const handleLogoutClick = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    onLogout();
  };

  return (
    <div className="min-h-screen bg-[#F4F2EA] flex font-sans text-stone-900 selection:bg-amber-300 selection:text-stone-950">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* LEFT SIDEBAR (Dark Charcoal matching Screenshot) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#111317] text-white flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo */}
          <div className="p-6 sm:p-7 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black tracking-tight text-white">NOOR</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block mb-1" />
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden text-stone-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="px-4 space-y-1.5 mt-2">
            {/* Dashboard Nav Button */}
            <button
              onClick={() => {
                setCurrentTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                currentTab === 'dashboard'
                  ? 'bg-amber-400 text-stone-950 shadow-md'
                  : 'text-stone-300 hover:bg-stone-800/60 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </button>

            {/* Projects Nav Button */}
            <button
              onClick={() => {
                setCurrentTab('projects');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                currentTab === 'projects'
                  ? 'bg-amber-400 text-stone-950 shadow-md'
                  : 'text-stone-300 hover:bg-stone-800/60 hover:text-white'
              }`}
            >
              <Folder className="w-4 h-4 shrink-0" />
              <span>Projects</span>
            </button>

            {/* Personal Details & CV Nav Button */}
            <button
              onClick={() => {
                setCurrentTab('personal-details');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                currentTab === 'personal-details'
                  ? 'bg-amber-400 text-stone-950 shadow-md'
                  : 'text-stone-300 hover:bg-stone-800/60 hover:text-white'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>Personal Details & CV</span>
            </button>

            {/* Messages / Inquiries Nav Button */}
            <button
              onClick={() => {
                setCurrentTab('messages');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                currentTab === 'messages'
                  ? 'bg-amber-400 text-stone-950 shadow-md'
                  : 'text-stone-300 hover:bg-stone-800/60 hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4 shrink-0" />
              <span>Messages & Inquiries</span>
            </button>

            {/* Settings Nav Button */}
            <button
              onClick={() => {
                setCurrentTab('settings');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                currentTab === 'settings'
                  ? 'bg-amber-400 text-stone-950 shadow-md'
                  : 'text-stone-300 hover:bg-stone-800/60 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Logout Row */}
        <div className="p-4 border-t border-stone-800/80">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-stone-400 hover:text-red-400 hover:bg-stone-800/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* TOP BAR */}
        <header className="sticky top-0 z-20 bg-[#F4F2EA]/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-stone-200/60">
          {/* Left: Mobile Toggle & Search */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900 rounded-xl hover:bg-white/60"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search Pill Input */}
            <div className="relative w-full max-w-xs sm:max-w-sm">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search here..."
                className="w-full pl-10 pr-4 py-2 bg-white text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm rounded-full border border-stone-200/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-hidden shadow-2xs transition-all"
              />
            </div>
          </div>

          {/* Right: Notifications & Admin Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Live Portfolio Jump Link */}
            <button
              onClick={onBackToPortfolio}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white/80 hover:bg-white px-3 py-1.5 rounded-full border border-stone-200/80 shadow-2xs transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
              <span>Live Portfolio</span>
            </button>

            {/* Notification Bell */}
            <div className="relative p-2 rounded-full bg-white border border-stone-200/80 text-stone-600 hover:text-stone-900 cursor-pointer shadow-2xs">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1.5 right-1.5 ring-2 ring-white" />
            </div>

            {/* Admin Profile Chip */}
            <div className="flex items-center gap-2.5 pl-2">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-stone-200 bg-amber-100 shadow-2xs shrink-0">
                <img
                  src={profile?.avatarUrl || '/file_00000000704c8230a66055ead8603089.png'}
                  alt="Noor"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-stone-900 leading-tight">
                  {profile?.fullName || 'Noor'}
                </div>
                <div className="text-[10px] text-stone-400 font-medium">Admin</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* TAB CONTENT BODY */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {currentTab === 'dashboard' && (
            <DashboardTab
              stats={stats}
              projects={projects}
              onNavigateToProjects={() => setCurrentTab('projects')}
              onEditProject={() => setCurrentTab('projects')}
            />
          )}

          {currentTab === 'projects' && (
            <ProjectsTab
              projects={projects}
              onRefresh={fetchData}
              showToast={showToast}
            />
          )}

          {currentTab === 'personal-details' && (
            <PersonalDetailsTab
              profile={profile}
              onRefresh={fetchData}
              showToast={showToast}
            />
          )}

          {currentTab === 'messages' && (
            <MessagesTab showToast={showToast} />
          )}

          {currentTab === 'settings' && (
            <SettingsTab
              currentEmail={adminEmail}
              sessionId={sessionId}
              isRealFirebase={isRealFirebase}
              showToast={showToast}
            />
          )}
        </main>
      </div>
    </div>
  );
}
