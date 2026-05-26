import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../translations';

const APPEAL_BADGE = {
  FILED: 'badge badge-submitted',
  UNDER_REVIEW: 'badge badge-inprogress',
  DISPOSED: 'badge badge-responded',
};

const APPEAL_LABEL_KEY = {
  FILED: 'appealFiled',
  UNDER_REVIEW: 'appealUnderReview',
  DISPOSED: 'appealDisposed',
};

function AppealRecord({ appeal, lang }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-5">
        <div className="space-y-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
              {t(lang, 'applicationNo')}
            </p>
            <p className="mt-2 font-mono text-sm font-semibold text-[#1a3a6b]">{appeal.application_no}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
              {t(lang, 'tableSubject')}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{appeal.subject}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
              {t(lang, 'appealReasonCol')}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{appeal.reason}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
              {t(lang, 'tableStatus')}
            </p>
            <div className="mt-2">
              <span className={APPEAL_BADGE[appeal.status] || 'badge badge-closed'}>
                {t(lang, APPEAL_LABEL_KEY[appeal.status] || 'appealFiled')}
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
              {t(lang, 'tableDateFiled')}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-700">{appeal.filed_at}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
              {t(lang, 'disposalRemarks')}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{appeal.disposal_remarks || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FirstAppeal() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [tab, setTab] = useState('file');
  const [eligibleApps, setEligibleApps] = useState([]);
  const [appeals, setAppeals] = useState([]);
  const [formData, setFormData] = useState({ application_id: '', reason: '' });
  const [appealDoc, setAppealDoc] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    API.get('/rti/my-applications/?all=true')
      .then((res) => {
        const eligible = res.data.results.filter((a) => ['RESPONDED', 'CLOSED'].includes(a.status));
        setEligibleApps(eligible);
      })
      .catch(() => {});

    API.get('/rti/my-appeals/?all=true')
      .then((res) => setAppeals(res.data.results))
      .catch(() => {});
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const file = e.target.files[0];
    setAppealDoc(file);
    setFileName(file ? file.name : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = new FormData();
      data.append('application_id', formData.application_id);
      data.append('reason', formData.reason);
      if (appealDoc) data.append('appeal_document', appealDoc);

      const res = await API.post('/rti/appeal/', data);
      setSuccess(`${t(lang, 'appealSuccess')} (${res.data.application_no})`);
      setFormData({ application_id: '', reason: '' });
      setAppealDoc(null);
      setFileName('');
      API.get('/rti/my-appeals/?all=true').then((r) => setAppeals(r.data.results)).catch(() => {});
      setTab('list');
    } catch (err) {
      setError(err.response?.data?.error || t(lang, 'appealError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef2f7]">
      <Navbar backTo="/dashboard" backLabel={t(lang, 'dashboard')} />

      <div className="page-wrap space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden fade-in">
          <div className="bg-[#1a3a6b] px-6 py-5 text-white">
            <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100">Appeal Filing Service</p>
            <h2 className="mt-2 text-3xl font-bold">{t(lang, 'firstAppeal')}</h2>
            <p className="mt-3 text-sm leading-7 text-blue-100">{t(lang, 'firstAppealSubtitle')}</p>
          </div>
          <div className="px-6 py-5 bg-slate-50 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Eligible Cases</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">{eligibleApps.length} applications available for appeal</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Filed Appeals</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">{appeals.length} appeals currently recorded</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Review Flow</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">Appeal filing -> review queue -> disposal order</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => setTab('file')}
              className={`rounded-xl border px-5 py-4 text-left transition-colors ${
                tab === 'file'
                  ? 'border-[#1a3a6b] bg-[#1a3a6b] text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
              }`}
            >
              <p className="font-semibold">{t(lang, 'fileAppealTab')}</p>
              <p className={`mt-1 text-sm ${tab === 'file' ? 'text-blue-100' : 'text-slate-500'}`}>
                Start a formal first appeal for delay, denial, or incomplete response.
              </p>
            </button>
            <button
              onClick={() => setTab('list')}
              className={`rounded-xl border px-5 py-4 text-left transition-colors ${
                tab === 'list'
                  ? 'border-[#1a3a6b] bg-[#1a3a6b] text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
              }`}
            >
              <p className="font-semibold">{t(lang, 'myAppealsTab')}</p>
              <p className={`mt-1 text-sm ${tab === 'list' ? 'text-blue-100' : 'text-slate-500'}`}>
                Review filed dates, current status, and final disposal remarks.
              </p>
            </button>
          </div>
        </section>

        {error && <div className="alert-error fade-in">{error}</div>}
        {success && <div className="alert-success fade-in">{success}</div>}

        {tab === 'file' ? (
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6 fade-in">
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8">
              <div className="mb-6">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Appeal Request Form</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{t(lang, 'fileAppealTab')}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Choose an eligible RTI record, explain the reason for appeal, and attach any supporting document if available.
                </p>
              </div>

              {eligibleApps.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-10 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white border border-slate-200">
                    <svg className="h-7 w-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-base font-semibold text-slate-700">{t(lang, 'noEligibleApps')}</p>
                  <p className="mt-2 text-sm text-slate-500">{t(lang, 'noEligibleAppsInfo')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      {t(lang, 'selectApplication')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="application_id"
                      onChange={handleChange}
                      value={formData.application_id}
                      className="gov-input"
                      required
                    >
                      <option value="">{t(lang, 'selectAppPlaceholder')}</option>
                      {eligibleApps.map((app) => (
                        <option key={app.id} value={app.id}>
                          {app.application_no} - {app.subject} ({app.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      {t(lang, 'appealReason')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="reason"
                      rows="6"
                      placeholder={t(lang, 'appealReasonPlaceholder')}
                      onChange={handleChange}
                      value={formData.reason}
                      className="gov-input resize-none"
                      required
                    />
                    <p className="mt-1 text-xs text-slate-400">{t(lang, 'appealReasonHelper')}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      {t(lang, 'appealDocument')} <span className="font-normal text-slate-400">{t(lang, 'optional')}</span>
                    </label>
                    <label className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 px-4 py-4 transition-colors hover:border-[#1a3a6b] hover:bg-blue-50">
                      <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <div className="flex-1">
                        {fileName ? (
                          <span className="text-sm font-medium text-[#1a3a6b]">{fileName}</span>
                        ) : (
                          <>
                            <span className="text-sm text-slate-500">{t(lang, 'clickToUpload')}</span>
                            <span className="ml-2 text-xs text-slate-400">(PDF, JPG, PNG)</span>
                          </>
                        )}
                      </div>
                      <input type="file" accept=".pdf,.jpg,.png" onChange={handleFile} className="hidden" />
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button type="submit" disabled={loading} className="btn-primary">
                      {loading ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          {t(lang, 'submitting')}
                        </>
                      ) : (
                        t(lang, 'submitAppeal')
                      )}
                    </button>
                    <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary">
                      {t(lang, 'cancel')}
                    </button>
                  </div>
                </form>
              )}
            </section>

            <aside className="space-y-4">
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Appeal Guidance</p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">{t(lang, 'appealInfoTitle')}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{t(lang, 'appealInfoText')}</p>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Processing Notes</p>
                <div className="mt-4 space-y-4 text-sm text-slate-700">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                    Select an RTI case that already has a response or has been formally closed.
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                    Explain clearly whether the issue is delay, incomplete disclosure, or unsatisfactory information.
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                    After filing, monitor the appeal record from the appeal register in your account.
                  </div>
                </div>
              </section>
            </aside>
          </div>
        ) : (
          <section className="space-y-4 fade-in">
            {appeals.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-12 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 border border-slate-200">
                  <svg className="h-7 w-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-base font-semibold text-slate-700">{t(lang, 'noAppeals')}</p>
                <p className="mt-2 text-sm text-slate-500">{t(lang, 'noAppealsYet')}</p>
                <button onClick={() => setTab('file')} className="btn-primary mt-5">
                  {t(lang, 'fileFirstAppeal')}
                </button>
              </div>
            ) : (
              appeals.map((appeal) => <AppealRecord key={appeal.id} appeal={appeal} lang={lang} />)
            )}
          </section>
        )}
      </div>
    </div>
  );
}
