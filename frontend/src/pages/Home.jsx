import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import { translate as t } from '../i18n/portalText';

function ProcessStep({ step, title, description }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-lg font-bold text-[#14505b] shadow-sm">
        {step}
      </div>
      <h3 className="mt-4 text-sm font-bold text-slate-800">{title}</h3>
      <p className="mt-2 max-w-[180px] text-xs leading-6 text-slate-500">{description}</p>
    </div>
  );
}

function FeatureCard({ title, description, wide = false, children }) {
  return (
    <div className={`rounded-3xl border border-slate-200 bg-[#f8fafc] p-6 shadow-sm ${wide ? 'lg:col-span-2' : ''}`}>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-500">{description}</p>
      {children}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f7f8]">
      <Navbar />

      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-6 pb-14 pt-16">
          <div className="grid grid-cols-1 items-center gap-12 xl:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#14505b]">{t(lang, 'homeEyebrow')}</p>
              <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                {t(lang, 'homeTitle')}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">{t(lang, 'homeDescription')}</p>

              <div className="mt-9 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/smart-assistant')}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#0f5b63] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0b4a51]"
                >
                  {t(lang, 'homeStartRequest')}
                  <span aria-hidden="true">+</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/track-smart-rti')}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  {t(lang, 'homeTrackApplication')}
                  <span aria-hidden="true">↗</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/submitted-request')}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#0f5b63] bg-white px-6 py-3 text-sm font-semibold text-[#0f5b63] transition-colors hover:bg-[#eef8f8]"
                >
                  View Submitted Request
                </button>
              </div>
            </div>

            <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:ml-auto">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {t(lang, 'homeAssistantPrompt')}
                </p>
                <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700">
                  {t(lang, 'homeAiPowered')}
                </span>
              </div>

              <div className="mt-5 rounded-2xl border border-[#f1e5c9] bg-[#fbf8f1] p-5">
                <p className="text-sm italic leading-7 text-slate-700">{t(lang, 'homeQuote')}</p>
              </div>

              <div className="mt-6 space-y-4">
                {[t(lang, 'homeFeatureOne'), t(lang, 'homeFeatureTwo')].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                      ✓
                    </div>
                    <p className="text-sm text-slate-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700">{t(lang, 'homeProcessTitle')}</p>
              <p className="mt-2 text-sm text-slate-500">{t(lang, 'homeProcessSubtitle')}</p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-4">
              <ProcessStep step="1" title={t(lang, 'processStep1Title')} description={t(lang, 'processStep1Desc')} />
              <ProcessStep step="2" title={t(lang, 'processStep2Title')} description={t(lang, 'processStep2Desc')} />
              <ProcessStep step="3" title={t(lang, 'processStep3Title')} description={t(lang, 'processStep3Desc')} />
              <ProcessStep step="4" title={t(lang, 'processStep4Title')} description={t(lang, 'processStep4Desc')} />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm font-semibold text-slate-700">{t(lang, 'homeFeaturesTitle')}</p>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <FeatureCard title={t(lang, 'smartDraftGeneration')} description={t(lang, 'smartDraftGenerationDesc')} wide>
              <div className="mt-6 h-3 overflow-hidden rounded-full border border-slate-200 bg-white">
                <div className="h-full w-3/4 rounded-full bg-slate-200" />
              </div>
            </FeatureCard>

            <FeatureCard title={t(lang, 'departmentSuggestion')} description={t(lang, 'departmentSuggestionDesc')} />
            <FeatureCard title={t(lang, 'clarityFeedback')} description={t(lang, 'clarityFeedbackDesc')} />

            <FeatureCard title={t(lang, 'multilingualSupport')} description={t(lang, 'multilingualSupportDesc')} wide>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">English</span>
                <span className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">தமிழ்</span>
                <span className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">+ more</span>
              </div>
            </FeatureCard>
          </div>
        </section>
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
