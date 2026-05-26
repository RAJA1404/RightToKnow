import { useLanguage } from '../context/LanguageContext';
import { translate as t } from '../i18n/portalText';

export default function DepartmentCard({
  department,
  matchedKeywords = [],
  confidence,
  departments = [],
  onSelectDepartment,
  onChangeDepartment,
}) {
  const { lang } = useLanguage();
  const reasoningText = matchedKeywords.length
    ? lang === 'ta'
      ? `காரணம்: ${matchedKeywords.join(', ')} குறித்து உங்கள் கோரிக்கையை அடிப்படையாகக் கொண்டு, இந்த விண்ணப்பம் பொருத்தமான பொது அதிகாரியுடன் இணைக்கப்பட்டது.`
      : `Reasoning: Based on your query regarding ${matchedKeywords.join(', ')}, the system mapped this request to the relevant public authority.`
    : lang === 'ta'
      ? 'கோரிக்கையின் சூழலை அடிப்படையாகக் கொண்டு, உதவியாளர் அருகிலுள்ள பொருத்தமான பொது அதிகாரியைத் தேர்வு செய்துள்ளது.'
      : 'The assistant selected the nearest relevant public authority based on the request context.';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-bold text-slate-800">{t(lang, 'suggestedDepartments')}</h3>
      <p className="mt-4 text-lg font-bold text-slate-900">{department || t(lang, 'noDepartmentSuggestions')}</p>
      {typeof confidence === 'number' ? (
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#0F6C73]">
          {confidence}% {t(lang, 'confidence')}
        </p>
      ) : null}
      <p className="mt-3 text-xs leading-5 text-slate-500">{reasoningText}</p>

      {departments.length > 0 ? (
        <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            {t(lang, 'suggestedDepartments')}
          </p>
          <div className="space-y-2">
            {departments.map((item, index) => {
              const isSelected = item.name === department;

              return (
                <button
                  key={`${item.name}-${index}`}
                  type="button"
                  onClick={() => onSelectDepartment?.(item)}
                  className={`w-full rounded-xl border p-3 text-left transition-colors ${
                    isSelected
                      ? 'border-[#0F6C73] bg-[#0F6C73]/5'
                      : 'border-slate-200 bg-slate-50 hover:border-[#0F6C73]/40 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                    <span className="text-xs font-semibold text-[#0F6C73]">{item.confidence}%</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {item.matchedKeywords?.length ? item.matchedKeywords.join(', ') : t(lang, 'noMatchedKeywords')}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onChangeDepartment}
        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0F6C73] transition-colors hover:text-[#0c5960]"
      >
        {lang === 'ta' ? 'துறையை மாற்று' : 'Change Department'}
        <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}
