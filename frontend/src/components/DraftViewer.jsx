import { useLanguage } from '../context/LanguageContext';
import { translate as t } from '../i18n/portalText';

export default function DraftViewer({
  generatedDraft,
  isEditing = false,
  onToggleEdit,
  onChange,
  title = 'Generated RTI Draft',
  actionLabel,
  onAction,
  previewClassName = 'rounded-xl bg-[#fafcfc] p-5 border border-slate-100',
  contentClassName = 'whitespace-pre-wrap text-sm leading-7 text-slate-700 font-sans',
}) {
  const { lang } = useLanguage();
  const resolvedTitle = title || t(lang, 'generatedDraftTitle');
  const resolvedActionLabel =
    actionLabel || (isEditing ? t(lang, 'doneEditing') : t(lang, 'draftPreview'));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-t-4 border-t-[#0F6C73] px-5 py-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">{resolvedTitle}</h3>
        </div>

        {onAction || onToggleEdit ? (
          <button
            type="button"
            onClick={onAction || onToggleEdit}
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600 transition-colors hover:bg-slate-100"
          >
            {resolvedActionLabel}
          </button>
        ) : null}
      </div>

      <div className="px-5 pb-5">
        {isEditing ? (
          <textarea
            value={generatedDraft}
            onChange={(event) => onChange?.(event.target.value)}
            rows="18"
            className="gov-input resize-none"
          />
        ) : (
          <div className={previewClassName}>
            <pre className={contentClassName}>{generatedDraft}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
