import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../translations';
import formatApiError from '../utils/formatApiError';

function PortalHeader({ lang, toggleLang }) {
  return (
    <>
      <div className="gov-topbar">
        <span>{t(lang, 'govTopbar')}</span>
        <span className="hidden sm:block">Tamil Nadu e-Governance Services</span>
      </div>

      <header className="bg-white shadow-sm">
        <div className="border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.16em] text-slate-500">
            <span>Government of Tamil Nadu</span>
            <span>Right to Information Online Portal</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="gov-emblem-block">
              <div className="gov-seal">RTI</div>
            </div>
            <div>
              <p className="font-bold text-[#1a3a6b] text-xl leading-tight">{t(lang, 'portalName')}</p>
              <p className="text-sm text-slate-500">{t(lang, 'portalTagline')}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">Password Recovery</p>
            </div>
          </div>

          <button
            onClick={toggleLang}
            title={lang === 'en' ? 'Switch to Tamil' : 'Switch to English'}
            className="flex items-center gap-0.5 rounded-full border border-slate-300 bg-white overflow-hidden text-xs font-semibold shadow-sm hover:shadow-md transition-all"
          >
            <span className={`px-2.5 py-1 transition-colors ${lang === 'en' ? 'bg-[#1a3a6b] text-white' : 'text-slate-500'}`}>EN</span>
            <span className={`px-2.5 py-1 transition-colors ${lang === 'ta' ? 'bg-[#1a3a6b] text-white' : 'text-slate-500'}`}>தமிழ்</span>
          </button>
        </div>
        <div className="h-1 bg-gradient-to-r from-[#f97316] via-white to-[#15803d]" />
      </header>
    </>
  );
}

export default function ForgotPassword() {
  const { lang, toggleLang } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    setResetUrl('');
    try {
      const res = await API.post('/auth/forgot-password/', { email });
      setMessage(res.data.message || 'If an account exists for that email, a reset link has been generated.');
      if (res.data.reset_url) {
        setResetUrl(res.data.reset_url);
      }
    } catch (err) {
      setError(formatApiError(err.response?.data, 'Failed to start password reset.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef2f7]">
      <PortalHeader lang={lang} toggleLang={toggleLang} />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
          <section className="fade-in">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="bg-[#1a3a6b] px-6 py-5 text-white">
                <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100">Account Recovery</p>
                <h1 className="mt-2 text-2xl font-bold leading-tight">Password Recovery Services</h1>
                <p className="mt-2 text-sm leading-6 text-blue-100">
                  Generate a secure reset link using the email address registered with your RTI portal account.
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  <div className="gov-guidance-row">
                    <span className="gov-guidance-index">1</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Enter Registered Email</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">Use the email linked to your citizen or office account.</p>
                    </div>
                  </div>
                  <div className="gov-guidance-row">
                    <span className="gov-guidance-index">2</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Generate Reset Link</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">The portal creates a secure one-time recovery link.</p>
                    </div>
                  </div>
                  <div className="gov-guidance-row">
                    <span className="gov-guidance-index">3</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Set New Password</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">Use the link to define a fresh password and return to sign-in.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-amber-800">Security Note</p>
                  <p className="mt-2 text-sm leading-6 text-amber-900">
                    If no account matches the email, the portal still returns a generic response to protect account privacy.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="fade-in">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Password Recovery</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-800">{t(lang, 'forgotPasswordTitle')}</h2>
                <p className="mt-2 text-sm text-slate-600 leading-6">{t(lang, 'forgotPasswordSubtitle')}</p>
              </div>

              <div className="p-8">
                {error && <div className="alert-error mb-5">{error}</div>}
                {message && <div className="alert-success mb-5">{message}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'emailAddress')}</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t(lang, 'emailPlaceholder')}
                      className="gov-input"
                      required
                    />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                    {loading ? t(lang, 'submitting') : t(lang, 'sendResetLink')}
                  </button>
                </form>

                {resetUrl && (
                  <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4 text-sm text-blue-800">
                    <p className="font-semibold mb-2">{t(lang, 'devResetLink')}</p>
                    <a href={resetUrl} className="underline break-all">{resetUrl}</a>
                  </div>
                )}

                <div className="mt-6 pt-5 border-t border-slate-100 text-center text-sm text-slate-500">
                  <Link to="/login" className="text-[#1a3a6b] font-semibold hover:underline">{t(lang, 'backToLogin')}</Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
