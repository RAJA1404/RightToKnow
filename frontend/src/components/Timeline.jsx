import { useLanguage } from '../context/LanguageContext';
import { translate as t } from '../i18n/portalText';

function formatTimelineDate(value, lang) {
  if (!value) return '';

  return new Date(value).toLocaleString(lang === 'ta' ? 'ta-IN' : 'en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Timeline({ items = [] }) {
  const { lang } = useLanguage();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-bold text-slate-800">{t(lang, 'processingTimeline')}</h3>

      <div className="mt-6 space-y-6">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <div key={`${item.step}-${item.date}-${index}`} className="relative flex gap-4">
              <div className="relative flex flex-col items-center">
                <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0F6C73] bg-white text-[#0F6C73]">
                  <span className="text-sm leading-none">•</span>
                </div>
                {!isLast ? <div className="mt-1 h-full min-h-[42px] w-px bg-slate-200" /> : null}
              </div>

              <div className="flex-1 pb-2">
                <p className="text-sm font-semibold text-slate-800">{item.step}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">{formatTimelineDate(item.date, lang)}</p>
                {item.note ? (
                  <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                    {item.note}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
