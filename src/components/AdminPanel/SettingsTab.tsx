import React, { useState } from 'react';
import {
  KeyRound,
  Lock,
  Mail,
  Loader2,
} from 'lucide-react';
import { api } from './api';

interface SettingsTabProps {
  currentEmail: string;
  sessionId?: string;
  isRealFirebase?: boolean;
  showToast: (type: 'success' | 'error', message: string) => void;
}

export function SettingsTab({
  currentEmail,
  showToast,
}: SettingsTabProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      showToast('error', 'Current password is required to update credentials');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      showToast('error', 'New passwords do not match');
      return;
    }

    if (newPassword && newPassword.length < 8) {
      showToast('error', 'New password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/credentials', {
        currentPassword,
        newEmail: newEmail.trim() || undefined,
        newPassword: newPassword || undefined,
      });

      showToast('success', 'Admin credentials updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error('Update credentials error:', err);
      showToast('error', err.response?.data?.error || 'Failed to update credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-3xl">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Settings & Security
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          Manage your administrator email and account password.
        </p>
      </div>

      {/* Main Credentials Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Admin Credentials
            </h2>
            <p className="text-xs text-stone-400">
              Update your login email address and account password
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateCredentials} className="space-y-4">
          {/* Current Email (Read-only reference) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Current Admin Email
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-stone-400 pointer-events-none">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                disabled
                value={currentEmail}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-100/70 text-stone-500 text-sm rounded-xl border border-stone-200 cursor-not-allowed outline-hidden"
              />
            </div>
          </div>

          {/* Change Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              New Email Address (Optional)
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-stone-400 pointer-events-none">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Leave blank to keep current email"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50/70 hover:bg-stone-50 focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Current Password (Required) */}
          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Current Password * (Required for verification)
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-stone-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50/70 hover:bg-stone-50 focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-hidden transition-all"
              />
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              New Password (Optional)
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-stone-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50/70 hover:bg-stone-50 focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Confirm New Password */}
          {newPassword && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Confirm New Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-stone-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50/70 hover:bg-stone-50 focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-hidden transition-all"
                />
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm tracking-wide shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Security Credentials...</span>
                </>
              ) : (
                <span>Update Credentials</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
