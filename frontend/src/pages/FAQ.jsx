import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import { translate as t } from '../i18n/portalText';

export default function FAQ() {
  const { lang } = useLanguage();
  const faqs = [
    { q: t(lang, 'faqWhatIsRtiQ'), a: t(lang, 'faqWhatIsRtiA') },
    { q: t(lang, 'faqWhoCanFileQ'), a: t(lang, 'faqWhoCanFileA') },
    { q: t(lang, 'faqFeeQ'), a: t(lang, 'faqFeeA') },
    { q: t(lang, 'faqTimeLimitQ'), a: t(lang, 'faqTimeLimitA') },
    { q: t(lang, 'faqNoResponseQ'), a: t(lang, 'faqNoResponseA') },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-extrabold text-[#112b50]">{t(lang, 'faqTitle')}</h1>
          <p className="mt-4 text-slate-600">{t(lang, 'faqSubtitle')}</p>
        </header>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <details key={faq.q} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between p-6 font-bold text-slate-800 transition hover:bg-slate-50">
                <span>{faq.q}</span>
                <span className="text-blue-600 transition group-open:rotate-180">↓</span>
              </summary>
              <div className="border-t border-slate-100 px-6 pb-6 pt-4 leading-relaxed text-slate-600">
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-500">{t(lang, 'faqStillQuestions')}</p>
          <button className="mt-4 rounded-xl bg-blue-600 px-8 py-3 font-bold text-white shadow-lg transition hover:bg-blue-700">
            {t(lang, 'faqContactSupport')}
          </button>
        </div>
      </main>
    </div>
  );
}
