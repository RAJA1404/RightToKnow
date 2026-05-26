import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../translations';
import { STATUS_BADGE, STATUS_LABEL_KEY } from '../constants';

function DaysLeftBadge({ days, status, lang }) {
  if (['RESPONDED', 'CLOSED'].includes(status)) return <span className="text-xs text-slate-400">-</span>;
  if (days < 0) return <span className="badge" style={{ background: '#dc2626', color: '#fff' }}>{t(lang, 'overdue')}</span>;
  const color = days > 15 ? 'text-green-700 bg-green-50 border-green-200'
    : days > 5 ? 'text-orange-700 bg-orange-50 border-orange-200'
      : 'text-red-700 bg-red-50 border-red-200';
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${color}`}>{days}d</span>;
}

function PrintReceipt({ app, lang }) {
  const handlePrint = () => {
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>RTI Receipt - ${app.application_no}</title>
      <style>body{font-family:Arial,sans-serif;padding:40px;max-width:600px;margin:0 auto}
      h2{color:#1a3a6b;text-align:center;margin-bottom:20px}
      .row{display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:8px 0}
      .label{color:#666;font-size:14px}.value{font-weight:bold;font-size:14px;color:#333}
      .app-no{text-align:center;font-size:24px;font-family:monospace;color:#1a3a6b;font-weight:bold;margin:20px 0;padding:15px;border:2px dashed #1a3a6b;border-radius:8px}
      .footer{text-align:center;margin-top:30px;font-size:11px;color:#999}</style></head><body>
      <h2>${t(lang, 'acknowledgmentReceipt')}</h2>
      <div class="app-no">${app.application_no}</div>
      <div class="row"><span class="label">${t(lang, 'tableSubject')}</span><span class="value">${app.subject}</span></div>
      <div class="row"><span class="label">${t(lang, 'district')}</span><span class="value">${app.district}</span></div>
      <div class="row"><span class="label">${t(lang, 'tableDateFiled')}</span><span class="value">${app.created_at}</span></div>
      <div class="row"><span class="label">${t(lang, 'tableStatus')}</span><span class="value">${app.status}</span></div>
      <div class="row"><span class="label">${t(lang, 'deadlineDate')}</span><span class="value">${app.deadline_date}</span></div>
      <div class="footer">Government of Tamil Nadu | RTI Online Portal | ${new Date().toLocaleDateString('en-IN')}</div>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <button onClick={handlePrint} className="text-slate-500 hover:text-[#1a3a6b] transition-colors" title={t(lang, 'printReceipt')}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
    </button>
  );
}

export default function MyApplications() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1 });

  const fetchApps = (page = 1) => {
    setLoading(true);
    API.get(`/rti/my-applications/?page=${page}`)
      .then((res) => {
        setApplications(res.data.results);
        setPagination({ current_page: res.data.current_page, total_pages: res.data.total_pages });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchApps(); }, []);

  return (
    <div className="min-h-screen bg-[#eef2f7]">
      <Navbar backTo="/dashboard" backLabel={t(lang, 'dashboard')} />

      <div className="page-wrap space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden fade-in">
          <div className="bg-[#1a3a6b] px-6 py-5 text-white">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
              <div className="max-w-2xl">
                <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100">Application Register</p>
                <h2 className="mt-2 text-3xl font-bold">{t(lang, 'myApplications')}</h2>
                <p className="mt-3 text-sm leading-7 text-blue-100">{t(lang, 'myApplicationsSubtitle')}</p>
              </div>
              <button onClick={() => navigate('/file-rti')} className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1a3a6b] shadow-md hover:bg-slate-100">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t(lang, 'fileNewRTIBtn')}
              </button>
            </div>
          </div>

          <div className="px-6 py-5 bg-slate-50 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Register Type</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">Citizen Application Ledger</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Case View</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">Filed RTIs and status history</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Available Actions</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">Track, print receipt, review deadlines</p>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-12 text-center fade-in">
            <svg className="w-8 h-8 animate-spin text-[#1a3a6b] mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-slate-400 mt-3">{t(lang, 'loadingApplications')}</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-12 text-center fade-in">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-slate-700 font-semibold mb-1">{t(lang, 'noApplicationsFound')}</p>
            <p className="text-slate-500 text-sm mb-5">{t(lang, 'noApplicationsYet')}</p>
            <button onClick={() => navigate('/file-rti')} className="btn-primary">{t(lang, 'fileFirstRTI')}</button>
          </div>
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 fade-in">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-bold text-[#1a3a6b]">Filed Applications</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Status, deadline view, and quick tracking actions for your RTIs.</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full">
                <thead>
                  <tr className="gov-thead">
                    <th>{t(lang, 'applicationNo')}</th>
                    <th>{t(lang, 'tableSubject')}</th>
                    <th>{t(lang, 'tableDistrict')}</th>
                    <th>{t(lang, 'tableDateFiled')}</th>
                    <th>{t(lang, 'tableStatus')}</th>
                    <th>{t(lang, 'daysLeft')}</th>
                    <th>{t(lang, 'tableAction')}</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, idx) => (
                    <tr key={app.id} className={`border-b border-slate-100 hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                      <td className="px-4 py-4 font-mono text-sm text-[#1a3a6b] font-semibold">{app.application_no}</td>
                      <td className="px-4 py-4 text-slate-700 text-sm max-w-[220px] truncate">{app.subject}</td>
                      <td className="px-4 py-4 text-slate-600 text-sm">{app.district}</td>
                      <td className="px-4 py-4 text-slate-500 text-sm">{app.created_at}</td>
                      <td className="px-4 py-4">
                        <span className={STATUS_BADGE[app.status] || 'badge badge-closed'}>
                          {t(lang, STATUS_LABEL_KEY[app.status] || 'statusClosed')}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <DaysLeftBadge days={app.days_remaining} status={app.status} lang={lang} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <button onClick={() => navigate(`/track/${app.application_no}`)} className="text-[#1a3a6b] hover:underline text-sm font-semibold">
                            {t(lang, 'track')}
                          </button>
                          <PrintReceipt app={app} lang={lang} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.total_pages > 1 && (
              <div className="flex items-center justify-between mt-5">
                <button
                  disabled={pagination.current_page === 1}
                  onClick={() => fetchApps(pagination.current_page - 1)}
                  className="px-4 py-2 text-sm border rounded-xl bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >&larr; {t(lang, 'back')}</button>
                <span className="text-sm text-slate-500 font-medium">Page {pagination.current_page} of {pagination.total_pages}</span>
                <button
                  disabled={pagination.current_page === pagination.total_pages}
                  onClick={() => fetchApps(pagination.current_page + 1)}
                  className="px-4 py-2 text-sm border rounded-xl bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >Next &rarr;</button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
