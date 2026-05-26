import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">Citizen Enrollment</p>
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

export default function Register() {
  const navigate = useNavigate();
  const { lang, toggleLang } = useLanguage();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    aadhaar_no: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/register/', formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(formatApiError(err.response?.data, 'Registration failed. Please try again.'));
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
                <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100">Citizen Registration</p>
                <h1 className="mt-2 text-2xl font-bold leading-tight">Create Your RTI Citizen Account</h1>
                <p className="mt-2 text-sm leading-6 text-blue-100">
                  Register once to file RTI requests, track application progress, and manage appeals from your citizen dashboard.
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  <div className="gov-guidance-row">
                    <span className="gov-guidance-index">1</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Create Account</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">Register once with your basic personal and contact information.</p>
                    </div>
                  </div>
                  <div className="gov-guidance-row">
                    <span className="gov-guidance-index">2</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">File RTI Online</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">Submit RTI applications and maintain a single case history in one place.</p>
                    </div>
                  </div>
                  <div className="gov-guidance-row">
                    <span className="gov-guidance-index">3</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Track and Appeal</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">Monitor progress and file first appeals when required.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-amber-800">Registration Note</p>
                  <p className="mt-2 text-sm leading-6 text-amber-900">
                    This registration is only for citizens. Department and PIO accounts are created and controlled internally.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="fade-in">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Citizen Registration</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-800">{t(lang, 'citizenRegistration')}</h2>
                <p className="mt-2 text-sm text-slate-600 leading-6">{t(lang, 'registerSubtitle')}</p>
              </div>

              <div className="p-8">
                {success ? (
                  <div className="alert-success text-center py-6 fade-in">
                    <svg className="w-12 h-12 text-green-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="font-semibold text-lg text-green-800 mb-1">{t(lang, 'registrationSuccess')}</p>
                    <p className="text-sm text-green-700">{t(lang, 'redirectingToLogin')}</p>
                  </div>
                ) : (
                  <>
                    {error && (
                      <div className="alert-error flex items-center gap-2 mb-5">
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'firstName')} <span className="text-red-500">*</span></label>
                          <input name="first_name" placeholder={t(lang, 'firstNamePlaceholder')} onChange={handleChange} className="gov-input" required />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'lastName')} <span className="text-red-500">*</span></label>
                          <input name="last_name" placeholder={t(lang, 'lastNamePlaceholder')} onChange={handleChange} className="gov-input" required />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'emailAddress')} <span className="text-red-500">*</span></label>
                        <input name="email" type="email" placeholder={t(lang, 'emailPlaceholderReg')} onChange={handleChange} className="gov-input" required />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'passwordCreate')} <span className="text-red-500">*</span></label>
                          <input name="password" type="password" placeholder={t(lang, 'passwordCreatePlaceholder')} onChange={handleChange} className="gov-input" required />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'mobileNumber')} <span className="text-red-500">*</span></label>
                          <input name="phone" placeholder={t(lang, 'mobilePlaceholder')} onChange={handleChange} className="gov-input" required />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'residentialAddress')} <span className="text-red-500">*</span></label>
                        <input name="address" placeholder={t(lang, 'addressPlaceholder')} onChange={handleChange} className="gov-input" required />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'aadhaarNumber')} <span className="text-red-500">*</span></label>
                        <input name="aadhaar_no" placeholder={t(lang, 'aadhaarPlaceholder')} maxLength={12} onChange={handleChange} className="gov-input" required />
                        <p className="text-xs text-slate-400 mt-1">{t(lang, 'aadhaarHelper')}</p>
                      </div>

                      <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                        {loading ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            {t(lang, 'registering')}
                          </>
                        ) : t(lang, 'register')}
                      </button>
                    </form>

                    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Account Type</p>
                      <p className="mt-3 text-sm text-slate-600 leading-6">
                        This registration is only for citizens. Main-admin, department, and PIO accounts are managed by the office.
                      </p>
                    </div>

                    <div className="mt-6 pt-5 border-t border-slate-100 text-center text-sm text-slate-500">
                      {t(lang, 'alreadyRegistered')}{' '}
                      <Link to="/login" className="text-[#1a3a6b] font-semibold hover:underline">{t(lang, 'loginHere')}</Link>
                    </div>
                  </>
                )}
              </div>
            </div>

            <p className="text-center text-xs text-slate-400 mt-6">{t(lang, 'copyright')}</p>
          </section>
        </div>
      </main>
    </div>
  );
}
