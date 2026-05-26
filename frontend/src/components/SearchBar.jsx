import { useLanguage } from '../context/LanguageContext';
import { translate as t } from '../i18n/portalText';

export default function SearchBar({ value, onChange, placeholder }) {
  const { lang } = useLanguage();

  return (
    <div className="w-full sm:w-[320px]">
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder || t(lang, 'searchDepartmentOrOffice')}
        className="w-full rounded border border-[#d6dce5] bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[#0F6C73] focus:ring-2 focus:ring-[#0F6C73]/20"
      />
    </div>
  );
}
