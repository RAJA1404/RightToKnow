import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import { translate as t } from '../i18n/portalText';

export default function SubmittedRequest() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const storedSubmissionSummary = JSON.parse(localStorage.getItem('latest_submitted_request') || 'null');
  const submissionSummary = location.state?.submissionSummary || storedSubmissionSummary || null;

  const submittedAt = useMemo(() => {
    if (!submissionSummary?.createdAt) {
      return 'Just now';
    }

    return new Date(submissionSummary.createdAt).toLocaleString();
  }, [submissionSummary?.createdAt]);

  const referenceNumber = useMemo(() => {
    if (!submissionSummary?.applicationId) {
      return 'RTI-ACK';
    }

    return `ACK-${submissionSummary.applicationId}`;
  }, [submissionSummary?.applicationId]);

  if (!submissionSummary) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f5f7f8]">
        <Navbar />
        <main className="mx-auto flex w-full max-w-4xl flex-1 items-center px-6 py-16">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-slate-900">No submitted request details found</h1>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Submit a new RTI request to view the confirmation page and application details.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/smart-assistant')}
                className="rounded-lg bg-[#0F6C73] px-5 py-3 text-sm font-semibold text-white"
              >
                Start New Request
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Go Home
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f7f8]">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Submission Response</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-emerald-950">RTI submitted successfully</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-emerald-900">
            Your RTI request has been submitted and recorded in the portal. Keep the application ID safe for tracking and future follow-up.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Acknowledgement Slip</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">Submission Reference</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                This acknowledgement confirms that your request has been accepted by the portal and recorded for processing.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Reference No.</p>
                <p className="mt-2 font-mono text-base font-bold text-slate-900">{referenceNumber}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Application ID</p>
                <p className="mt-2 font-mono text-base font-bold text-slate-900">{submissionSummary.applicationId}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Submitted Request Details</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Application ID</p>
                <p className="mt-2 font-mono text-base font-bold text-slate-900">{submissionSummary.applicationId}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Status</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{submissionSummary.status || 'Submitted'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Department</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{submissionSummary.department || 'Not assigned yet'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Submitted On</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{submittedAt}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Applicant Name</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{submissionSummary.applicantName || 'Citizen Applicant'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Location</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{submissionSummary.detectedLocation || 'Not specified'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Public Authority</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{submissionSummary.publicAuthority || submissionSummary.department || 'To be determined by the portal'}</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Further Details</h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
              <p>
                Your request has been accepted by the portal and assigned the application ID shown on this page.
              </p>
              <p>
                Use this application ID on the View Status page to track progress, view the current status, and check updates later.
              </p>
              <p>
                If you need another copy of the request response details, return to this page after a successful submission or track the request directly.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Print Acknowledgement
              </button>
              <button
                type="button"
                onClick={() => navigate('/track-smart-rti')}
                className="rounded-lg bg-[#0F6C73] px-5 py-3 text-sm font-semibold text-white"
              >
                {t(lang, 'navViewStatus')}
              </button>
              <button
                type="button"
                onClick={() => navigate('/smart-assistant')}
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Start Another Request
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Go Home
              </button>
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Original Request</h2>
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {submissionSummary.inputText || 'No original request text available.'}
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Matched Keywords</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {submissionSummary.matchedKeywords?.length ? (
                  submissionSummary.matchedKeywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-[#0F6C73]"
                    >
                      {keyword}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">No matched keywords available.</span>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-slate-900">Submitted RTI Draft</h2>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Final Copy
              </span>
            </div>
            <div className="mt-5 max-h-[34rem] overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-700">
                {submissionSummary.generatedDraft || 'No generated draft available.'}
              </pre>
            </div>

            {submissionSummary.suggestions?.length ? (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">Follow-up Suggestions</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-900">
                  {submissionSummary.suggestions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-slate-700">{t(lang, 'brandName')}</p>
            <p className="mt-1">{t(lang, 'footerPortal')}</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button type="button" onClick={() => navigate('/faq')} className="transition-colors hover:text-slate-700">
              {t(lang, 'homeFaq')}
            </button>
            <button type="button" onClick={() => navigate('/guidelines')} className="transition-colors hover:text-slate-700">
              {t(lang, 'homeGuidelines')}
            </button>
            <button type="button" onClick={() => navigate('/login')} className="transition-colors hover:text-slate-700">
              {t(lang, 'homeContactUs')}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
