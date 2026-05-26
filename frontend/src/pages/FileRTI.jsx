import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../translations';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function FileRTI() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { isAuthenticated } = useAuth();

  const [districts, setDistricts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    district: '',
    department: '',
    subject: '',
    description: '',
    guest_email: '',
    guest_mobile: '',
    payment_mode: '',
    payment_ref: '',
    is_bpl: false,
  });
  const [document, setDocument] = useState(null);
  const [bplCertificate, setBplCertificate] = useState(null);
  const [fileName, setFileName] = useState('');
  const [bplFileName, setBplFileName] = useState('');
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    API.get('/rti/districts/').then((res) => setDistricts(res.data)).catch(() => setError('Could not load districts.'));
    API.get('/rti/departments/').then((res) => setDepartments(res.data)).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData((prev) => {
      const next = { ...prev, [e.target.name]: value };
      if (e.target.name === 'is_bpl' && value) {
        next.payment_mode = '';
        next.payment_ref = '';
        setPaymentInfo(null);
      }
      if (e.target.name === 'payment_mode' && value !== 'Online Payment') {
        next.payment_ref = '';
        setPaymentInfo(null);
      }
      if (e.target.name === 'payment_mode' && value === 'Online Payment') {
        next.payment_ref = '';
      }
      return next;
    });
  };

  const handleFile = (e, type) => {
    const f = e.target.files[0];
    if (f && f.size > MAX_FILE_SIZE) {
      setError('File size must be less than 5MB.');
      e.target.value = '';
      return;
    }
    if (type === 'document') {
      setDocument(f);
      setFileName(f ? f.name : '');
    } else {
      setBplCertificate(f);
      setBplFileName(f ? f.name : '');
    }
  };

  const handleInitiatePayment = async () => {
    setPaymentLoading(true);
    setError('');
    try {
      const res = await API.post('/rti/initiate-payment/', { payment_mode: formData.payment_mode });
      setPaymentInfo(res.data);
      setFormData((prev) => ({ ...prev, payment_ref: res.data.payment_ref }));
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to initiate payment right now.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('district', formData.district);
      data.append('department', formData.department);
      data.append('subject', formData.subject);
      data.append('description', formData.description);

      if (!isAuthenticated) {
        data.append('guest_email', formData.guest_email);
        data.append('guest_mobile', formData.guest_mobile);
      }

      data.append('is_bpl', formData.is_bpl ? 'true' : 'false');
      if (formData.is_bpl && bplCertificate) data.append('bpl_certificate', bplCertificate);
      if (!formData.is_bpl) {
        data.append('payment_mode', formData.payment_mode);
        data.append('payment_ref', formData.payment_ref);
      }
      if (document) data.append('document', document);

      const res = await API.post('/rti/apply/', data);
      setSuccessData({
        application_no: res.data.application_no,
        subject: formData.subject,
        district: districts.find((d) => d.id === parseInt(formData.district, 10))?.name || formData.district,
        department: departments.find((d) => d.id === parseInt(formData.department, 10))?.name || formData.department,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        is_bpl: formData.is_bpl,
        payment_mode: formData.payment_mode,
        payment_ref: formData.payment_ref,
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  if (successData) {
    return (
      <div className="min-h-screen bg-[#eef2f7]">
        <Navbar backTo={isAuthenticated ? '/dashboard' : '/login'} backLabel={isAuthenticated ? t(lang, 'dashboard') : t(lang, 'back')} />
        <div className="page-wrap">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8 max-w-2xl mx-auto fade-in" id="print-receipt">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-green-800 mb-1">{t(lang, 'rtiSuccessTitle')}</h2>
            </div>

            <div className="border border-slate-200 rounded-lg p-5 mb-5">
              <h3 className="font-bold text-[#1a3a6b] text-sm uppercase tracking-wider mb-3 text-center">{t(lang, 'acknowledgmentReceipt')}</h3>
              <div className="border-t border-b border-dashed border-slate-300 py-4 my-3 text-center">
                <p className="text-xs text-slate-500 mb-1">{t(lang, 'applicationNo')}</p>
                <p className="text-2xl font-bold font-mono text-[#1a3a6b]">{successData.application_no}</p>
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-slate-500">{t(lang, 'tableSubject')}</dt><dd className="font-semibold text-slate-800">{successData.subject}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">{t(lang, 'district')}</dt><dd className="font-semibold text-slate-800">{successData.district}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">{t(lang, 'department')}</dt><dd className="font-semibold text-slate-800">{successData.department || '-'}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">{t(lang, 'tableDateFiled')}</dt><dd className="font-semibold text-slate-800">{successData.date}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">{t(lang, 'feeNoticeTitle')}</dt><dd className="font-semibold text-slate-800">{successData.is_bpl ? 'Exempt (BPL)' : `Rs. 10 (${successData.payment_mode})`}</dd></div>
                {!successData.is_bpl && <div className="flex justify-between"><dt className="text-slate-500">{t(lang, 'paymentRefNo')}</dt><dd className="font-semibold text-slate-800">{successData.payment_ref}</dd></div>}
              </dl>
            </div>

            <div className="flex gap-3 no-print">
              <button onClick={handlePrint} className="btn-primary flex-1">{t(lang, 'printReceipt')}</button>
              <button
                onClick={() => isAuthenticated
                  ? navigate('/my-applications')
                  : navigate(`/track-status?app=${encodeURIComponent(successData.application_no)}&email=${encodeURIComponent(formData.guest_email)}`)}
                className="btn-secondary flex-1"
              >
                {isAuthenticated ? t(lang, 'viewMyApplications') : t(lang, 'trackBtn')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef2f7]">
      <Navbar backTo={isAuthenticated ? '/dashboard' : '/login'} backLabel={isAuthenticated ? t(lang, 'dashboard') : t(lang, 'back')} />
      <div className="page-wrap space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden fade-in">
          <div className="bg-[#1a3a6b] px-6 py-5 text-white">
            <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100">RTI Filing Service</p>
            <h2 className="mt-2 text-3xl font-bold">{t(lang, 'fileRTI')}</h2>
            <p className="mt-3 text-sm leading-7 text-blue-100">{t(lang, 'fileRTISubtitle')}</p>
          </div>
          <div className="px-6 py-5 bg-slate-50 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-4"><p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Submission Type</p><p className="mt-2 text-sm font-semibold text-slate-800">{isAuthenticated ? 'Citizen account filing' : 'Guest filing with email verification'}</p></div>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-4"><p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Processing Fee</p><p className="mt-2 text-sm font-semibold text-slate-800">Rs. 10 standard fee / BPL exempt</p></div>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-4"><p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Routing Model</p><p className="mt-2 text-sm font-semibold text-slate-800">Filed request → department routing → officer action</p></div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6 fade-in">
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8">
            {error && <div className="alert-error mb-5">{typeof error === 'string' ? error : JSON.stringify(error)}</div>}
            {!isAuthenticated && <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 text-sm text-blue-800 font-medium">{t(lang, 'guestFilingNotice')}</div>}
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6"><p className="font-semibold text-amber-800 mb-1">{t(lang, 'feeNoticeTitle')}: Rs. 10</p><p className="text-xs text-amber-800">{t(lang, 'feeNoticeText')}</p></div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isAuthenticated && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-5 border-b border-slate-100">
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'guestEmail')} <span className="text-red-500">*</span></label><input name="guest_email" type="email" placeholder="example@email.com" onChange={handleChange} className="gov-input" required /></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'guestMobile')} <span className="text-red-500">*</span></label><input name="guest_mobile" type="tel" placeholder="+91 9876543210" onChange={handleChange} className="gov-input" required /></div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'district')} <span className="text-red-500">*</span></label><select name="district" onChange={handleChange} className="gov-input" required><option value="">{t(lang, 'selectDistrict')}</option>{districts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'department')} <span className="text-slate-400 font-normal">{t(lang, 'optional')}</span></label><select name="department" onChange={handleChange} className="gov-input"><option value="">{t(lang, 'selectDepartment')}</option>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
              </div>

              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'subject')} <span className="text-red-500">*</span></label><input name="subject" placeholder={t(lang, 'subjectPlaceholder')} onChange={handleChange} className="gov-input" required /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'description')} <span className="text-red-500">*</span></label><textarea name="description" rows="6" placeholder={t(lang, 'descriptionPlaceholder')} onChange={handleChange} className="gov-input resize-none" required /><p className="text-xs text-slate-400 mt-1">{t(lang, 'descriptionHelper')}</p></div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'supportingDocument')} <span className="text-slate-400 font-normal">{t(lang, 'optional')}</span></label>
                <label className="flex items-center gap-3 w-full cursor-pointer border-2 border-dashed border-slate-200 rounded-md px-4 py-3 hover:border-[#1a3a6b] hover:bg-blue-50 transition-colors group">
                  <div className="flex-1">{fileName ? <span className="text-sm text-[#1a3a6b] font-medium">{fileName}</span> : <span className="text-sm text-slate-500">{t(lang, 'clickToUpload')}</span>}</div>
                  <input type="file" accept=".pdf,.jpg,.png" onChange={(e) => handleFile(e, 'document')} className="hidden" />
                </label>
              </div>

              <div className="border-t border-slate-100 pt-5 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="is_bpl" checked={formData.is_bpl} onChange={handleChange} className="w-4 h-4 rounded border-slate-300 text-[#1a3a6b] focus:ring-[#1a3a6b]" />
                  <span className="text-sm font-semibold text-slate-700">{t(lang, 'bplExemption')}</span>
                </label>
                {formData.is_bpl ? (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'bplCertificate')} <span className="text-red-500">*</span></label>
                    <label className="flex items-center gap-3 w-full cursor-pointer border-2 border-dashed border-green-200 rounded-md px-4 py-3 hover:border-green-500 hover:bg-green-50 transition-colors bg-green-50/50">
                      <div className="flex-1">{bplFileName ? <span className="text-sm text-green-700 font-medium">{bplFileName}</span> : <span className="text-sm text-green-600">{t(lang, 'clickToUpload')} (BPL Certificate)</span>}</div>
                      <input type="file" accept=".pdf,.jpg,.png" onChange={(e) => handleFile(e, 'bpl')} className="hidden" required />
                    </label>
                    <p className="text-xs text-green-600 mt-1 font-medium">{t(lang, 'bplFeeExempted')}</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'paymentMode')} <span className="text-red-500">*</span></label><select name="payment_mode" value={formData.payment_mode} onChange={handleChange} className="gov-input" required><option value="">{t(lang, 'selectPaymentMode')}</option><option value="Postal Order">{t(lang, 'postalOrder')}</option><option value="Demand Draft">{t(lang, 'demandDraft')}</option><option value="Treasury Challan">{t(lang, 'treasuryChallan')}</option><option value="Online Payment">{t(lang, 'onlinePayment')}</option></select></div>
                      <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'paymentRefNo')} <span className="text-red-500">*</span></label><input name="payment_ref" value={formData.payment_ref} placeholder={t(lang, 'paymentRefPlaceholder')} onChange={handleChange} className="gov-input" required readOnly={formData.payment_mode === 'Online Payment'} /></div>
                    </div>
                    {formData.payment_mode === 'Online Payment' && (
                      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div><p className="text-sm font-semibold text-blue-900">{t(lang, 'onlinePaymentTitle')}</p><p className="text-xs text-blue-800">{t(lang, 'onlinePaymentHelp')}</p></div>
                          <button type="button" onClick={handleInitiatePayment} disabled={paymentLoading} className="btn-primary">{paymentLoading ? t(lang, 'processingPayment') : t(lang, 'payNow')}</button>
                        </div>
                        {paymentInfo && <div className="mt-4 rounded-md border border-green-200 bg-white px-4 py-3 text-sm"><p className="font-semibold text-green-800 mb-1">{t(lang, 'paymentCompleted')}</p><p className="text-slate-700">{t(lang, 'paymentRefNo')}: <span className="font-mono font-semibold">{paymentInfo.payment_ref}</span></p><p className="text-slate-700">{t(lang, 'feeNoticeTitle')}: Rs. {paymentInfo.amount}</p></div>}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading || (!formData.is_bpl && !formData.payment_ref)} className="btn-primary">{loading ? t(lang, 'submitting') : t(lang, 'submitRTI')}</button>
                <button type="button" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')} className="btn-secondary">{t(lang, 'cancel')}</button>
              </div>
            </form>
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Filing Guidance</p>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <p>1. Select district and optional requested department.</p>
                <p>2. Describe the information requested clearly and specifically.</p>
                <p>3. Attach supporting records if needed.</p>
                <p>4. Complete fee payment or upload BPL certificate for exemption.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Processing Note</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">Newly filed RTIs are routed through the departmental workflow before reaching the responsible officer for response.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
