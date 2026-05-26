import { useLanguage } from '../context/LanguageContext';

export default function SuggestionBox({ suggestions, onAutofill }) {
  const { lang } = useLanguage();
  const primarySuggestion =
    suggestions[0] ||
    (lang === 'ta'
      ? 'பரிந்துரை இல்லை. வரைவு ஏற்கனவே சமர்ப்பிக்கத் தெளிவாக உள்ளது.'
      : 'No suggestion available. The draft is already clear enough for submission.');

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-[10px] font-bold text-amber-800">
          !
        </div>
        <div>
          <p className="text-sm font-semibold text-amber-900">{lang === 'ta' ? 'தெளிவுக்கான பரிந்துரை' : 'Suggestion for clarity'}</p>
          <p className="mt-2 text-xs leading-5 text-amber-800">{primarySuggestion}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onAutofill}
        className="mt-4 text-sm font-semibold text-amber-900 hover:text-amber-950 transition-colors"
      >
        {lang === 'ta' ? 'குறைவான விவரங்களை தானாக நிரப்பவும்' : 'Auto-fill missing details'}
      </button>
    </div>
  );
}
