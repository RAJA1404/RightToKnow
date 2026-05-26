import { useLanguage } from '../context/LanguageContext';
import { translate as t } from '../i18n/portalText';

export default function DepartmentTable({ departments, onViewDetails }) {
  const { lang } = useLanguage();

  return (
    <div className="overflow-hidden rounded border border-[#dce6f5] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-[#0f7cf4] text-left text-sm font-semibold text-white">
              <th className="px-4 py-3 w-24">{t(lang, 'slNo')}</th>
              <th className="px-4 py-3">{t(lang, 'departmentName')}</th>
              <th className="px-4 py-3 w-40">{t(lang, 'publicAuthoritiesCount')}</th>
              <th className="px-4 py-3 w-36">{t(lang, 'action')}</th>
            </tr>
          </thead>
          <tbody>
            {departments.length > 0 ? (
              departments.map((department, index) => (
                <tr key={department._id || department.name} className="border-t border-slate-200 text-sm text-slate-700">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{department.departmentName || department.name}</td>
                  <td className="px-4 py-3">{department.publicAuthorities?.length || 0}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onViewDetails(department)}
                      className="rounded bg-[#0F6C73] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#0c5960]"
                    >
                      {t(lang, 'viewDetails')}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-sm text-slate-500">
                  {t(lang, 'noDepartmentsFound')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
