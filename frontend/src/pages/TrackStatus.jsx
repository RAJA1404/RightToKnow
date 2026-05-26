import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../translations';
import { ALL_STATUSES, STATUS_STYLE, STATUS_LABEL_KEY } from '../constants';

function Row({ label, value, children }) {
  return (
    <div className="py-3 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 last:border-0">
      <dt className="text-sm text-slate-500 font-medium">{label}</dt>
      <dd className="text-sm text-slate-800 font-semibold sm:col-span-2">{children || value || '-'}</dd>
    </div>
  );
}

function StatusResult({ application, lang, onReset }) {
  const currentIndex = ALL_STATUSES.indexOf(application.status);
  const isOverdue = application.days_remaining !== undefined && application.days_remaining < 0
    && !['RESPONDED', 'CLOSED'].includes(application.status);

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden fade-in mb-6">
        <div className="bg-[#1a3a6b] px-6 py-5 text-white">
          <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100">Status Tracking</p>
          <h2 className="mt-2 text-3xl font-bold">{t(lang, 'applicationStatus')} - {application.application_no}</h2>
          <p className="mt-3 text-sm leading-7 text-blue-100">{t(lang, 'trackSubtitle')}</p>
        </div>

        <div className="px-6 py-5 bg-slate-50 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Application Number</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">{application.application_no}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Current Status</p>
              <p className="mt-2">
                <span className={STATUS_STYLE[application.status]?.badge || 'badge badge-closed'}>
                  {t(lang, STATUS_LABEL_KEY[application.status] || 'statusClosed')}
                </span>
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Deadline</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">{application.deadline_date || '-'}</p>
            </div>
          </div>
        </div>
      </section>

      {isOverdue && (
        <div className="bg-red-50 border border-red-300 rounded-lg px-5 py-4 mb-5 flex items-start gap-3 fade-in">
          <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-red-800">Warning: {t(lang, 'overdue')}</p>
            <p className="text-xs text-red-700">{t(lang, 'overdueWarning')}</p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 mb-5 fade-in">
        <h3 className="text-2xl font-bold text-[#1a3a6b] mb-4">{t(lang, 'applicationDetails')}</h3>
        <dl>
          <Row label={t(lang, 'applicationNumber')} value={application.application_no} />
          <Row label={t(lang, 'fieldDistrict')} value={application.district} />
          <Row label={t(lang, 'fieldSubject')} value={application.subject} />
          <Row label={t(lang, 'filedOn')} value={application.created_at} />
          {application.deadline_date && (
            <Row label={t(lang, 'deadlineDate')}>
              <span className={application.days_remaining < 0 ? 'text-red-600 font-bold' : ''}>
                {application.deadline_date}
                {application.days_remaining !== undefined && !['RESPONDED', 'CLOSED'].includes(application.status) && (
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                    application.days_remaining < 0 ? 'bg-red-100 text-red-700'
                      : application.days_remaining <= 5 ? 'bg-red-50 text-red-600'
                        : application.days_remaining <= 15 ? 'bg-orange-50 text-orange-600'
                          : 'bg-green-50 text-green-600'
                  }`}>
                    {application.days_remaining < 0
                      ? `${Math.abs(application.days_remaining)}d ${t(lang, 'overdue').toLowerCase()}`
                      : `${application.days_remaining}d left`}
                  </span>
                )}
              </span>
            </Row>
          )}
          {application.document && (
            <Row label={t(lang, 'viewDocument')}>
              <a href={application.document} target="_blank" rel="noopener noreferrer"
                className="text-sm text-[#1a3a6b] font-semibold hover:underline flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t(lang, 'viewDocument')}
              </a>
            </Row>
          )}
        </dl>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 mb-5 fade-in">
        <h3 className="text-2xl font-bold text-[#1a3a6b] mb-6">{t(lang, 'processingTimeline')}</h3>
        <div className="relative flex justify-between items-start">
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-200 z-0" />
          <div
            className="absolute top-4 left-4 h-0.5 bg-[#1a3a6b] z-0 transition-all duration-700"
            style={{ width: currentIndex >= 0 ? `${(currentIndex / (ALL_STATUSES.length - 1)) * (100 - (8 / ALL_STATUSES.length * 2))}%` : '0%' }}
          />
          {ALL_STATUSES.map((status, index) => {
            const done = index <= currentIndex;
            const current = index === currentIndex;
            return (
              <div key={status} className="flex flex-col items-center flex-1 relative z-10">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                  current ? 'bg-[#1a3a6b] border-[#1a3a6b] text-white scale-110'
                    : done ? 'bg-[#1a3a6b] border-[#1a3a6b] text-white'
                      : 'bg-white border-slate-300 text-slate-400'
                }`}>
                  {done && !current
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    : index + 1}
                </div>
                <p className={`text-[10px] text-center mt-2 font-medium leading-tight ${done ? 'text-[#1a3a6b]' : 'text-slate-400'}`}>
                  {t(lang, STATUS_LABEL_KEY[status] || 'statusClosed')}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 fade-in">
        <h3 className="text-2xl font-bold text-[#1a3a6b] mb-4">{t(lang, 'updateHistory')}</h3>
        {application.updates.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">{t(lang, 'noUpdatesYet')}</p>
        ) : (
          <div className="space-y-4">
            {application.updates.map((u, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${STATUS_STYLE[u.status]?.dot || 'bg-slate-400'}`} />
                  {i < application.updates.length - 1 && <div className="flex-1 w-px bg-slate-200 mt-1" />}
                </div>
                <div className="pb-3 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className={STATUS_STYLE[u.status]?.badge || 'badge badge-closed'}>
                      {t(lang, STATUS_LABEL_KEY[u.status] || 'statusClosed')}
                    </span>
                    <span className="text-xs text-slate-400">{u.updated_at}</span>
                  </div>
                  {u.remarks && <p className="text-sm text-slate-600 mt-1">{u.remarks}</p>}
                  {u.response_document && (
                    <a href={u.response_document} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-[#1a3a6b] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md px-3 py-1.5 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {t(lang, 'downloadResponse')}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {onReset && (
        <div className="mt-4 fade-in">
          <button onClick={onReset} className="btn-secondary">
            {t(lang, 'trackAnotherApp')}
          </button>
        </div>
      )}
    </>
  );
}

function PublicTrackMode({ lang, initialAppNo = '', initialEmail = '' }) {
  const [appNo, setAppNo] = useState(initialAppNo);
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const performSearch = useCallback(async (applicationNo, emailAddress) => {
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await API.get('/rti/public-track/', {
        params: { application_no: applicationNo.trim(), email: emailAddress.trim() },
        headers: { Authorization: undefined },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || t(lang, 'applicationNotFound'));
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    if (initialAppNo && initialEmail) {
      performSearch(initialAppNo, initialEmail);
    }
  }, [initialAppNo, initialEmail, performSearch]);

  const handleSearch = async (e) => {
    e.preventDefault();
    await performSearch(appNo, email);
  };

  if (result) {
    return (
      <StatusResult
        application={result}
        lang={lang}
        onReset={() => {
          setResult(null);
          setAppNo('');
          setEmail('');
          setError('');
        }}
      />
    );
  }

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden fade-in mb-6">
        <div className="bg-[#1a3a6b] px-6 py-5 text-white">
          <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100">Public Tracking</p>
          <h2 className="mt-2 text-3xl font-bold">{t(lang, 'publicTrackTitle')}</h2>
          <p className="mt-3 text-sm leading-7 text-blue-100">{t(lang, 'publicTrackSubtitle')}</p>
        </div>

        <div className="px-6 py-5 bg-slate-50 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Search Mode</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">Application number + email</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Portal Access</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">No citizen login required</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Security</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">Verification against registered email</p>
            </div>
          </div>
        </div>
      </section>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8 fade-in max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {t(lang, 'enterApplicationNo')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={appNo}
              onChange={(e) => setAppNo(e.target.value)}
              placeholder={t(lang, 'enterApplicationNoPlaceholder')}
              required
              className="gov-input"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {t(lang, 'emailAddress')} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t(lang, 'emailPlaceholder')}
              required
              className="gov-input"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 text-sm text-red-700 fade-in">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t(lang, 'searchingStatus')}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {t(lang, 'trackBtn')}
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-5">
          Secure: {lang === 'en' ? 'Your information is only used to verify your application and is never stored.' : '?????? ????? ?????? ???????????? ?????????? ??????? ????????????????????.'}
        </p>
      </div>
    </>
  );
}

function AuthTrackMode({ application_no, lang, navigate }) {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/rti/track/${application_no}/`)
      .then((res) => {
        setApplication(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError(t(lang, 'applicationNotFound'));
        setLoading(false);
      });
  }, [application_no, lang]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-12 text-center fade-in">
        <svg className="w-8 h-8 animate-spin text-[#1a3a6b] mx-auto" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-slate-400 mt-3">{t(lang, 'loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-12 text-center fade-in">
        <p className="text-red-600 font-medium">{error}</p>
        <button onClick={() => navigate('/my-applications')} className="btn-secondary mt-4">
          &larr; {t(lang, 'back')}
        </button>
      </div>
    );
  }

  return <StatusResult application={application} lang={lang} onReset={null} />;
}

export default function TrackStatus() {
  const { application_no } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [searchParams] = useSearchParams();

  const isAuthMode = !!application_no;
  const guestAppNo = searchParams.get('app') || '';
  const guestEmail = searchParams.get('email') || '';

  return (
    <div className="min-h-screen bg-[#eef2f7]">
      <Navbar
        backTo={isAuthMode ? '/my-applications' : undefined}
        backLabel={isAuthMode ? t(lang, 'myApplicationsNav') : undefined}
      />
      <div className="page-wrap">
        {isAuthMode
          ? <AuthTrackMode application_no={application_no} lang={lang} navigate={navigate} />
          : <PublicTrackMode lang={lang} initialAppNo={guestAppNo} initialEmail={guestEmail} />}
      </div>
    </div>
  );
}
