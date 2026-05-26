import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Timeline from '../components/Timeline';
import DraftViewer from '../components/DraftViewer';
import { useLanguage } from '../context/LanguageContext';
import { translate as t } from '../i18n/portalText';

const STATUS_BADGE_STYLES = {
  Submitted: 'bg-amber-100 text-amber-800',
  Processing: 'bg-[#f5e7a1] text-[#7b6400]',
  Completed: 'bg-emerald-100 text-emerald-800',
};

function formatShortDate(value, lang) {
  if (!value) return '--';

  return new Date(value).toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function downloadDraftPdf(applicationId, draftText) {
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) return;

  const escapedDraft = String(draftText || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  printWindow.document.write(`
    <html>
      <head>
        <title>${applicationId} - RTI Draft</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 32px; color: #1e293b; }
          h1 { font-size: 22px; margin-bottom: 8px; }
          p { color: #475569; margin-bottom: 24px; }
          pre {
            white-space: pre-wrap;
            word-break: break-word;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            background: #f8fafc;
            font-family: Arial, sans-serif;
            line-height: 1.7;
          }
        </style>
      </head>
      <body>
        <h1>RTI Submitted Draft</h1>
        <p>Application ID: ${applicationId}</p>
        <pre>${escapedDraft}</pre>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

export default function TrackApplication() {
  const location = useLocation();
  const { lang } = useLanguage();
  const [applicationId, setApplicationId] = useState('');
  const [rtiData, setRtiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const trackRequest = async (idToTrack) => {
    const trimmedId = idToTrack.trim();
    if (!trimmedId) {
      setError(t(lang, 'enterApplicationIdError'));
      return;
    }

    setLoading(true);
    setError('');
    setRtiData(null);

    try {
      const response = await API.get(`/rti/${encodeURIComponent(trimmedId)}`);
      setRtiData(response.data);
    } catch (_error) {
      setError(t(lang, 'trackNotFound'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');

    if (id) {
      setApplicationId(id);
      trackRequest(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f7fa]">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div>
            <p className="text-sm font-semibold text-slate-800">{t(lang, 'trackApplicationTitle')}</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{t(lang, 'trackApplicationSubtitle')}</p>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                trackRequest(applicationId);
              }}
              className="flex flex-col gap-3 md:flex-row"
            >
              <input
                type="text"
                value={applicationId}
                onChange={(event) => setApplicationId(event.target.value.toUpperCase())}
                placeholder={t(lang, 'enterApplicationId')}
                className="gov-input flex-1 font-mono"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-[#0F6C73] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0c5960] disabled:opacity-60"
              >
                {loading ? t(lang, 'tracking') : t(lang, 'trackStatus')}
              </button>
            </form>

            {error ? <div className="alert-error mt-4">{error}</div> : null}
          </div>

          {loading ? (
            <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#0F6C73]" />
              <p className="mt-4 text-sm font-medium text-slate-600">{t(lang, 'fetchingApplication')}</p>
            </div>
          ) : null}

          {rtiData ? (
            <div className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr]">
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4 border-t-4 border-t-[#0F6C73] pt-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">{t(lang, 'currentStatus')}</h2>
                      <p className="mt-3 text-sm font-mono text-slate-500">{rtiData.applicationId}</p>
                    </div>
                    <span
                      className={`rounded-md px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${
                        STATUS_BADGE_STYLES[rtiData.status] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {rtiData.status}
                    </span>
                  </div>

                  <p className="mt-5 text-sm leading-6 text-slate-600">{rtiData.statusMessage}</p>

                  <div className="mt-6 flex flex-wrap gap-4 border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
                    <span>{t(lang, 'expected')}: {formatShortDate(rtiData.expectedDate, lang)}</span>
                    <span>{t(lang, 'deptShort')}: {rtiData.department || '--'}</span>
                  </div>
                </div>

                <Timeline items={rtiData.timeline || []} />
              </div>

              <DraftViewer
                generatedDraft={rtiData.generatedDraft}
                title={t(lang, 'storedDraft')}
                actionLabel={t(lang, 'downloadPdf')}
                onAction={() => downloadDraftPdf(rtiData.applicationId, rtiData.generatedDraft)}
                previewClassName="max-h-[720px] overflow-auto rounded-xl border border-slate-100 bg-[#fafcfc] p-5"
                contentClassName="whitespace-pre-wrap text-sm leading-7 text-slate-700 font-sans"
              />
            </div>
          ) : null}
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-[#eceef0]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 py-6 text-center text-xs text-slate-500">
          <div className="flex flex-wrap justify-center gap-5">
            <span>{t(lang, 'footerPrivacy')}</span>
            <span>{t(lang, 'footerTerms')}</span>
            <span>{t(lang, 'footerAccessibility')}</span>
            <span>{t(lang, 'footerContactSupport')}</span>
          </div>
          <p className="font-semibold text-slate-700">{t(lang, 'footerPortal')}</p>
        </div>
      </footer>
    </div>
  );
}
