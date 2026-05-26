import { useLanguage } from '../context/LanguageContext';
import { translate as t } from '../i18n/portalText';

const STEPS = [
  { id: 1, key: 'processStep1Title', status: 'completed' },
  { id: 2, key: 'processStep2Title', status: 'completed' },
  { id: 3, key: 'reviewTitle', status: 'active' },
];

export default function ProgressSidebar() {
  const { lang } = useLanguage();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-bold text-slate-800">{lang === 'ta' ? 'கோரிக்கை முன்னேற்றம்' : 'Request Progress'}</h3>
      <div className="mt-5 space-y-4">
        {STEPS.map((step) => (
          <div key={step.id} className="flex gap-3">
            <div
              className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                step.status === 'active' || step.status === 'completed'
                  ? 'bg-[#0F6C73] text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {step.status === 'completed' ? '✓' : step.id}
            </div>
            <p
              className={`text-xs leading-5 ${
                step.status === 'active' ? 'font-semibold text-slate-800' : 'text-slate-500'
              }`}
            >
              {step.id === 3
                ? `${lang === 'ta' ? 'படி 3 & 4' : 'Step 3 & 4'}: ${t(lang, step.key)}`
                : `${lang === 'ta' ? 'படி' : 'Step'} ${step.id}: ${t(lang, step.key)}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
