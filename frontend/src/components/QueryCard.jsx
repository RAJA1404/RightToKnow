import { useLanguage } from '../context/LanguageContext';

export default function QueryCard({ inputText }) {
  const { lang } = useLanguage();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
        <span className="text-slate-400">◧</span>
        {lang === 'ta' ? 'உங்கள் முதல் கோரிக்கை' : 'Your Original Query'}
      </h2>
      <div className="mt-4 rounded-2xl bg-slate-50 p-5 min-h-[320px]">
        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{inputText}</p>
      </div>
    </div>
  );
}
