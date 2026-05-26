import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import { translate as t } from '../i18n/portalText';

export default function Guidelines() {
  const { lang } = useLanguage();
  const steps = [
    { title: t(lang, 'guidelinesStep1Title'), desc: t(lang, 'guidelinesStep1Desc') },
    { title: t(lang, 'guidelinesStep2Title'), desc: t(lang, 'guidelinesStep2Desc') },
    { title: t(lang, 'guidelinesStep3Title'), desc: t(lang, 'guidelinesStep3Desc') },
    { title: t(lang, 'guidelinesStep4Title'), desc: t(lang, 'guidelinesStep4Desc') },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-[#112b50]">{t(lang, 'guidelinesTitle')}</h1>
          <p className="mt-4 text-lg text-slate-600">{t(lang, 'guidelinesSubtitle')}</p>
        </header>

        <section className="grid gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="flex gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                {index + 1}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-slate-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-16 rounded-3xl bg-[#112b50] p-8 text-white shadow-xl">
          <h2 className="text-2xl font-bold">{t(lang, 'importantTips')}</h2>
          <ul className="mt-6 space-y-4 text-blue-100">
            <li className="flex gap-3">
              <span className="font-bold text-green-400">✓</span>
              {t(lang, 'tipCertifiedCopies')}
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-green-400">✓</span>
              {t(lang, 'tipPioJurisdiction')}
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-red-400">✗</span>
              {t(lang, 'tipNoOpinions')}
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
