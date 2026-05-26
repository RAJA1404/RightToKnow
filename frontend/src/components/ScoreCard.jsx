import { useLanguage } from '../context/LanguageContext';

export default function ScoreCard({ score, suggestionsCount }) {
  const { lang } = useLanguage();
  const title = lang === 'ta' ? 'வரைவு தர மதிப்பெண்' : 'Draft Quality Score';
  const suggestionText =
    suggestionsCount === 0
      ? lang === 'ta'
        ? 'பரிந்துரைகள் இல்லை'
        : 'No suggestions available'
      : lang === 'ta'
        ? `${suggestionsCount} ${suggestionsCount === 1 ? 'சிறிய பரிந்துரை உள்ளது' : 'சிறிய பரிந்துரைகள் உள்ளன'}`
        : `${suggestionsCount} ${suggestionsCount === 1 ? 'minor suggestion available' : 'minor suggestions available'}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-amber-300">
          <span className="text-xl font-bold text-slate-900">{score}</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">{title}</h3>
          <p className="mt-1 text-xs text-amber-700">{suggestionText}</p>
        </div>
      </div>
    </div>
  );
}
