import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../translations';

function ActionCard({ title, description, onClick, tone, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`gov-card w-full p-5 text-left transition-all hover:-translate-y-1 hover:shadow-lg ${tone}`}
    >
      <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 mb-4">
        {children}
      </div>
      <p className="font-bold text-slate-800">{title}</p>
      <p className="mt-2 text-sm text-slate-600 leading-6">{description}</p>
    </button>
  );
}

function StatCard({ title, value, note, tone }) {
  return (
    <div className={`rounded-2xl border bg-white p-5 shadow-sm ${tone}`}>
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{title}</p>
      <p className="mt-3 text-4xl font-extrabold text-slate-900">{value}</p>
      <p className="mt-2 text-xs leading-5 text-slate-500">{note}</p>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [stats, setStats] = useState({ total: 0, pending: 0, responded: 0 });

  useEffect(() => {
    API.get('/rti/dashboard-stats/').then((res) => setStats(res.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#eef2f7]">
      <Navbar showNotifications={true} />

      <div className="page-wrap space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden fade-in">
          <div className="bg-[#1a3a6b] px-6 py-5 text-white">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
              <div className="max-w-3xl">
                <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100">Citizen Dashboard</p>
                <h2 className="mt-2 text-3xl font-bold leading-tight">
                  {t(lang, 'welcome')}, {user?.first_name} {user?.last_name}
                </h2>
                <p className="mt-3 text-sm leading-7 text-blue-100">
                  {t(lang, 'dashboardTagline')} Review your RTI activity, monitor pending applications,
                  and move quickly between filing, tracking, appeals, and profile updates.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 min-w-[250px]">
                <p className="text-[11px] uppercase tracking-[0.16em] text-blue-100">Official Date</p>
                <p className="mt-2 text-xl font-bold">
                  {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="mt-2 text-xs leading-6 text-blue-100">
                  Citizen-side RTI filing, tracking, and appeal services.
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 bg-slate-50 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Account Type</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">Citizen RTI User</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Registered Email</p>
                <p className="mt-2 text-sm font-semibold text-slate-800 break-all">{user?.email || '-'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Service Area</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">Tamil Nadu RTI Online Portal</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 fade-in">
          <StatCard
            title={t(lang, 'totalApplications')}
            value={stats.total}
            note="All RTI applications filed through your account."
            tone="border-blue-200"
          />
          <StatCard
            title={t(lang, 'pending')}
            value={stats.pending}
            note="Applications awaiting review, routing, or official response."
            tone="border-orange-200"
          />
          <StatCard
            title={t(lang, 'responded')}
            value={stats.responded}
            note="Applications that have received a formal response."
            tone="border-green-200"
          />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 md:p-8 fade-in">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-bold text-[#1a3a6b]">{t(lang, 'quickActions')}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Primary citizen services available through the RTI portal.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <ActionCard
              title={t(lang, 'fileNewRTI')}
              description="Start a fresh RTI request with district, subject, and supporting details."
              onClick={() => navigate('/file-rti')}
              tone="hover:border-blue-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </ActionCard>

            <ActionCard
              title={t(lang, 'viewMyApplications')}
              description="Review all filed RTIs, status history, and response timelines."
              onClick={() => navigate('/my-applications')}
              tone="hover:border-green-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </ActionCard>

            <ActionCard
              title={t(lang, 'firstAppealNav')}
              description="File a first appeal where a response is delayed or unsatisfactory."
              onClick={() => navigate('/first-appeal')}
              tone="hover:border-amber-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </ActionCard>

            <ActionCard
              title={t(lang, 'myProfile')}
              description="Update your contact information and review your account details."
              onClick={() => navigate('/profile')}
              tone="hover:border-slate-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </ActionCard>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-6 fade-in">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
            <h3 className="text-2xl font-bold text-[#1a3a6b]">Citizen Guidance</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Learn the process before filing or appealing.</p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <button
                onClick={() => navigate('/rti-guide')}
                className="gov-card p-5 text-left transition-all hover:-translate-y-1 hover:shadow-lg hover:border-orange-200"
              >
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Guide</p>
                <p className="mt-3 font-bold text-[#1a3a6b]">{t(lang, 'howToFileRTI')}</p>
                <p className="mt-2 text-sm text-slate-600 leading-6">{t(lang, 'howToFileRTIDesc')}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-600">{t(lang, 'readGuide')}</span>
              </button>

              <button
                onClick={() => navigate('/rti-awareness')}
                className="gov-card p-5 text-left transition-all hover:-translate-y-1 hover:shadow-lg hover:border-blue-200"
              >
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Awareness</p>
                <p className="mt-3 font-bold text-[#1a3a6b]">{t(lang, 'rtiAwareness')}</p>
                <p className="mt-2 text-sm text-slate-600 leading-6">{t(lang, 'rtiAwarenessDesc')}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1a3a6b]">{t(lang, 'learnMore')}</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
            <h3 className="text-2xl font-bold text-[#1a3a6b]">Important Notice</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Statutory service information for citizens.</p>

            <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-5">
              <p className="font-bold text-orange-900">{t(lang, 'importantNotice')}</p>
              <p className="mt-3 text-sm text-orange-900 leading-7">{t(lang, 'importantNoticeText')}</p>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Portal Flow</p>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <p>1. Citizen files RTI online.</p>
                <p>2. Department office reviews and routes the case.</p>
                <p>3. Assigned officer processes the application and uploads the response.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
