import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { translate as t } from '../i18n/portalText';

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `whitespace-nowrap text-[12px] font-medium transition-colors ${
          isActive ? 'text-[#14505b] border-b-2 border-[#14505b] pb-1' : 'text-slate-500 hover:text-slate-700'
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { lang, toggleLang } = useLanguage();

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex min-w-[340px] flex-shrink-0 items-center gap-3 text-left"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-200 bg-white shadow-sm overflow-hidden">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/81/TamilNadu_Logo.svg"
              alt="Tamil Nadu emblem"
              className="h-11 w-11 object-contain"
              loading="eager"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <p className="text-lg font-bold text-[#1f6ec7] leading-tight">{t(lang, 'brandName')}</p>
            <p className="text-[11px] font-semibold text-[#1f6ec7] leading-4">
              ({t(lang, 'brandTagline')})
            </p>
          </div>
        </button>

        <nav className="flex min-w-0 flex-1 items-center justify-center gap-6">
          <NavItem to="/">{t(lang, 'navHome')}</NavItem>
          <NavItem to="/smart-assistant">{t(lang, 'navSubmitRequest')}</NavItem>
          <NavItem to="/track-smart-rti">{t(lang, 'navViewStatus')}</NavItem>
          <NavItem to="/public-authority">{t(lang, 'navPublicAuthority')}</NavItem>
          <NavItem to="/guidelines">{t(lang, 'navGuidelines')}</NavItem>
          <NavItem to="/faq">{t(lang, 'navFaqs')}</NavItem>
        </nav>

        <div className="flex min-w-[320px] flex-shrink-0 items-center justify-end gap-3">
          <button
            type="button"
            onClick={toggleLang}
            title={lang === 'en' ? t(lang, 'switchToTamil') : t(lang, 'switchToEnglish')}
            className="flex items-center gap-0.5 rounded-full border border-slate-300 bg-white overflow-hidden text-xs font-semibold shadow-sm transition-all hover:shadow-md"
          >
            <span className={`px-2.5 py-1 transition-colors ${lang === 'en' ? 'bg-[#1a3a6b] text-white' : 'text-slate-500'}`}>
              {t(lang, 'langEnglish')}
            </span>
            <span className={`px-2.5 py-1 transition-colors ${lang === 'ta' ? 'bg-[#1a3a6b] text-white' : 'text-slate-500'}`}>
              {t(lang, 'langTamil')}
            </span>
          </button>

          {user ? (
            <>
              <div className="hidden min-w-[150px] text-xs leading-5 text-slate-500 lg:block">
                <div className="whitespace-nowrap">{t(lang, 'signedInAs')}</div>
                <div className="truncate text-slate-600" title={user.email}>
                  {user.email}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {t(lang, 'logout')}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {t(lang, 'navSignIn')}
              </button>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="rounded-md bg-[#0f5b63] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0b4a51] transition-colors"
              >
                {t(lang, 'navContact')}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
