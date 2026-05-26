import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { translate as t } from '../i18n/portalText';
import formatApiError from '../utils/formatApiError';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { lang, toggleLang } = useLanguage();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await API.post('/auth/login', formData);
      login(response.data.user, response.data.tokens);
      navigate('/smart-assistant');
    } catch (err) {
      setError(formatApiError(err.response?.data, t(lang, 'loginFailed')));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef2f7] px-6 py-12">
      <div className="w-full max-w-5xl">
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={toggleLang}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            <span className={lang === 'en' ? 'text-[#0F6C73]' : 'text-slate-400'}>EN</span>
            <span className={lang === 'ta' ? 'text-[#0F6C73]' : 'text-slate-400'}>தமிழ்</span>
          </button>
        </div>

        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-[#1a3a6b] px-8 py-8 text-white">
              <p className="text-xs uppercase tracking-[0.18em] text-blue-100">{t(lang, 'loginOfficialAccess')}</p>
              <h1 className="mt-3 text-3xl font-bold">{t(lang, 'loginTitle')}</h1>
              <p className="mt-3 text-sm leading-7 text-blue-100">{t(lang, 'loginDescription')}</p>
            </div>

            <div className="space-y-4 p-8">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5">
                <p className="text-sm font-semibold text-slate-800">{t(lang, 'loginWhatYouCanDo')}</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>{t(lang, 'loginCanDo1')}</li>
                  <li>{t(lang, 'loginCanDo2')}</li>
                  <li>{t(lang, 'loginCanDo3')}</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-800">{t(lang, 'loginProjectScope')}</p>
                <p className="mt-2 text-sm leading-6 text-amber-900">{t(lang, 'loginScopeText')}</p>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
            <div className="border-b border-slate-200 bg-slate-50 px-8 py-6">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{t(lang, 'secureAuthentication')}</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-800">{t(lang, 'accountSignIn')}</h2>
            </div>

            <div className="p-8">
              {error && <div className="alert-error mb-5">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">{t(lang, 'emailAddress')}</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="gov-input"
                    placeholder={t(lang, 'loginEmailPlaceholder')}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">{t(lang, 'password')}</label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="gov-input"
                    placeholder={t(lang, 'passwordPlaceholder')}
                    required
                  />
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                  {loading ? t(lang, 'signingIn') : t(lang, 'signIn')}
                </button>
              </form>

              <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
                {t(lang, 'noAccountQuestion')}{' '}
                <Link to="/register" className="font-semibold text-[#1a3a6b] hover:underline">
                  {t(lang, 'registerHere')}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
