import { useState, useEffect } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../translations';

function RecordCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-800 break-words">{value}</p>
    </div>
  );
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { lang } = useLanguage();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await API.put('/auth/profile/', formData);
      updateUser(res.data.user || formData);
      setMessage({ text: t(lang, 'profileSaved'), type: 'success' });
      setEditing(false);
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Failed to update profile.', type: 'error' });
    }
    setLoading(false);
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const maskAadhaar = (aadhaar) => {
    if (!aadhaar || aadhaar.length < 4) return aadhaar || '-';
    return `XXXX-XXXX-${aadhaar.slice(-4)}`;
  };

  const roleLabel = user?.role === 'citizen'
    ? 'Citizen'
    : user?.role === 'dept_admin'
      ? 'Department Head'
      : user?.role === 'pio'
        ? 'PIO'
        : user?.role === 'main_admin'
          ? 'Main Admin'
          : 'Super Admin';

  return (
    <div className="min-h-screen bg-[#eef2f7]">
      <Navbar backTo="/dashboard" backLabel={t(lang, 'dashboard')} />

      <div className="page-wrap space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden fade-in">
          <div className="bg-[#1a3a6b] px-6 py-5 text-white">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
              <div className="max-w-2xl">
                <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100">Account Record</p>
                <h2 className="mt-2 text-3xl font-bold">{t(lang, 'myProfile')}</h2>
                <p className="mt-3 text-sm leading-7 text-blue-100">{t(lang, 'profileSubtitle')}</p>
              </div>
              {!editing && (
                <button onClick={() => setEditing(true)} className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1a3a6b] shadow-md hover:bg-slate-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {t(lang, 'editProfile')}
                </button>
              )}
            </div>
          </div>

          <div className="px-6 py-5 bg-slate-50 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <RecordCard label="Registered Email" value={user?.email || '-'} />
              <RecordCard label="Account Role" value={roleLabel} />
              <RecordCard label="Aadhaar Record" value={maskAadhaar(user?.aadhaar_no)} />
            </div>
          </div>
        </section>

        {message.text && (
          <div className={`flex items-center gap-2 text-sm rounded-lg px-4 py-3 fade-in ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={message.type === 'success' ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'} />
            </svg>
            {message.text}
          </div>
        )}

        <section className="grid grid-cols-1 xl:grid-cols-[0.86fr_1.14fr] gap-6 fade-in">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
            <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-[#1a3a6b] flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-md">
                {(user?.first_name?.[0] || 'U').toUpperCase()}{(user?.last_name?.[0] || '').toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1a3a6b]">{user?.first_name} {user?.last_name}</h3>
                <p className="text-sm text-slate-500">{user?.email}</p>
              </div>
            </div>

            <div className="mt-5 space-y-4 text-sm">
              <RecordCard label="Registered Mobile" value={user?.phone || '-'} />
              <RecordCard label="Residential Address" value={user?.address || '-'} />
              <RecordCard label="Citizen Account Status" value="Active" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
            <h3 className="text-2xl font-bold text-[#1a3a6b]">{editing ? t(lang, 'editProfile') : 'Account Details'}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Maintain your registered citizen contact details for communication and application tracking.</p>

            {editing ? (
              <form onSubmit={handleSave} className="space-y-4 mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'firstName')}</label>
                    <input name="first_name" value={formData.first_name} onChange={handleChange} className="gov-input" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'lastName')}</label>
                    <input name="last_name" value={formData.last_name} onChange={handleChange} className="gov-input" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'mobileNumber')}</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} className="gov-input" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'residentialAddress')}</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} rows="4" className="gov-input resize-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? 'Saving...' : t(lang, 'saveProfile')}
                  </button>
                  <button type="button" onClick={() => setEditing(false)} className="btn-secondary">{t(lang, 'cancel')}</button>
                </div>
              </form>
            ) : (
              <dl className="mt-6 divide-y divide-slate-100">
                <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <dt className="text-sm text-slate-500 font-medium">{t(lang, 'emailAddress')}</dt>
                  <dd className="text-sm text-slate-800 font-semibold sm:col-span-2">{user?.email}</dd>
                </div>
                <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <dt className="text-sm text-slate-500 font-medium">{t(lang, 'firstName')}</dt>
                  <dd className="text-sm text-slate-800 font-semibold sm:col-span-2">{user?.first_name || '-'}</dd>
                </div>
                <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <dt className="text-sm text-slate-500 font-medium">{t(lang, 'lastName')}</dt>
                  <dd className="text-sm text-slate-800 font-semibold sm:col-span-2">{user?.last_name || '-'}</dd>
                </div>
                <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <dt className="text-sm text-slate-500 font-medium">{t(lang, 'mobileNumber')}</dt>
                  <dd className="text-sm text-slate-800 font-semibold sm:col-span-2">{user?.phone || '-'}</dd>
                </div>
                <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <dt className="text-sm text-slate-500 font-medium">{t(lang, 'residentialAddress')}</dt>
                  <dd className="text-sm text-slate-800 font-semibold sm:col-span-2">{user?.address || '-'}</dd>
                </div>
                <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <dt className="text-sm text-slate-500 font-medium">{t(lang, 'aadhaarNumber')}</dt>
                  <dd className="text-sm text-slate-800 font-semibold sm:col-span-2">{maskAadhaar(user?.aadhaar_no)}</dd>
                </div>
              </dl>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
