import React, { useState, useEffect, useCallback } from 'react';
import { Mail, Trash2, Clock, RefreshCw, Inbox, CheckCircle2 } from 'lucide-react';
import { api } from './api';
import { ContactMessage } from './types';

interface MessagesTabProps {
  showToast: (type: 'success' | 'error', message: string) => void;
}

export function MessagesTab({ showToast }: MessagesTabProps) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/contact');
      setMessages(res.data || []);
    } catch (err: any) {
      console.error('Failed to load messages:', err);
      showToast('error', 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await api.delete(`/contact/${id}`);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      showToast('success', 'Message deleted');
    } catch {
      showToast('error', 'Failed to delete message');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Visitor Inquiries & Messages
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Real-time messages sent through your public portfolio contact form.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Message Count Banner */}
      <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-4 flex items-center justify-between text-xs text-amber-900 font-medium">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-amber-600" />
          <span>
            Total Messages Received:{' '}
            <strong className="font-bold text-amber-950">{messages.length}</strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Connected to Live Database</span>
        </div>
      </div>

      {/* Messages List */}
      {loading && messages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center text-stone-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
          <p className="text-sm font-medium text-stone-600">Loading messages from database...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-800">No Messages Yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
            When potential clients submit the contact form on your public website, their messages will immediately appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs hover:border-amber-300/80 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-stone-900">{msg.name}</span>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-xs text-amber-600 hover:text-amber-700 underline font-medium"
                  >
                    {msg.email}
                  </a>
                  {msg.subject && (
                    <span className="text-[11px] font-semibold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                      {msg.subject}
                    </span>
                  )}
                </div>

                <p className="text-sm text-stone-700 leading-relaxed bg-stone-50/70 p-3.5 rounded-xl border border-stone-100 whitespace-pre-wrap">
                  {msg.message}
                </p>

                <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                  <Clock className="w-3 h-3" />
                  <span>
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleString('en-US', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })
                      : 'Recently'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-start">
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Portfolio Inquiry')}`}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  Reply
                </a>
                <button
                  onClick={() => handleDelete(msg.id)}
                  disabled={deletingId === msg.id}
                  className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
