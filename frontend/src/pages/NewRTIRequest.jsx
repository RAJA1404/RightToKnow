import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import { translate as t } from '../i18n/portalText';

const SECTION_BAR = 'bg-[#0f7cf4] px-3 py-2 text-sm font-semibold text-white';
const FIELD_INPUT =
  'w-full rounded border border-[#d6dce5] bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[#f4b000] focus:ring-2 focus:ring-[#f4b000]/20';
const TEXT_AREA = `${FIELD_INPUT} min-h-[126px] resize-y`;
const OTP_BUTTON =
  'rounded border border-[#0F6C73] px-3 py-2 text-xs font-semibold text-[#0F6C73] transition hover:bg-[#0F6C73] hover:text-white disabled:cursor-not-allowed disabled:opacity-60';

const INITIAL_FORM = {
  publicAuthority: '',
  applicantName: '',
  gender: 'Male',
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  pincode: '',
  country: 'India',
  state: 'Tamil Nadu',
  district: '',
  taluk: '',
  village: '',
  phoneNumber: '',
  mobileNumber: '',
  email: '',
  educationalStatus: 'Literate',
  isBpl: 'No',
  inputText: '',
  captchaInput: '',
};

function SectionHeader({ children }) {
  return <div className={SECTION_BAR}>{children}</div>;
}

function FieldLabel({ required, children, accent }) {
  return (
    <label className={`mb-2 block text-sm font-medium ${accent ? 'text-[#d600b8]' : 'text-slate-800'}`}>
      {required ? <span className="text-red-600">*</span> : null}
      {children}
    </label>
  );
}

function loadDraft() {
  try {
    const saved = JSON.parse(localStorage.getItem('smart_rti_form_draft') || 'null');
    if (saved?.formData) {
      return {
        formData: { ...INITIAL_FORM, ...saved.formData },
        attachmentMeta: saved.attachmentMeta || null,
      };
    }
  } catch (_error) {
    // Ignore invalid draft cache.
  }

  return {
    formData: {
      ...INITIAL_FORM,
      inputText: localStorage.getItem('smart_rti_draft') || '',
    },
    attachmentMeta: null,
  };
}

function buildCaptcha() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

const OTP_TEXT = {
  send: 'Send OTP',
  sending: 'Sending...',
  enter: 'Enter OTP',
  verify: 'Verify OTP',
  verifying: 'Verifying...',
  sent: 'OTP sent successfully.',
  verified: 'Verified successfully.',
  sendFailed: 'Failed to send OTP.',
  verifyFailed: 'Failed to verify OTP.',
  demo: 'Demo OTP',
  mobileRequired: 'Please verify the mobile number using OTP.',
  emailRequired: 'Please verify the email address using OTP.',
};

function createVerificationState() {
  return {
    email: {
      otp: '',
      sent: false,
      verified: false,
      loading: false,
      verifying: false,
      message: '',
      error: '',
      demoOtp: '',
    },
    mobile: {
      otp: '',
      sent: false,
      verified: false,
      loading: false,
      verifying: false,
      message: '',
      error: '',
      demoOtp: '',
    },
  };
}

export default function NewRTIRequest() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const initialDraft = useMemo(() => loadDraft(), []);
  const [formData, setFormData] = useState(initialDraft.formData);
  const [attachmentMeta, setAttachmentMeta] = useState(initialDraft.attachmentMeta);
  const [departments, setDepartments] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [talukOptions, setTalukOptions] = useState([]);
  const [villageOptions, setVillageOptions] = useState([]);
  const [departmentsError, setDepartmentsError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [captchaCode, setCaptchaCode] = useState(buildCaptcha);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verification, setVerification] = useState(createVerificationState);

  useEffect(() => {
    let isMounted = true;

    async function fetchInitialData() {
      try {
        const [departmentResponse, districtResponse] = await Promise.all([API.get('/public-authorities'), API.get('/districts')]);

        if (!isMounted) return;
        const authorityRows = Array.isArray(departmentResponse.data)
          ? departmentResponse.data.map((item) => ({
              id: item._id || item.id,
              name: item.departmentName || item.name,
            }))
          : (departmentResponse.data?.data || []).map((item) => ({
              id: item.id || item._id,
              name: item.name || item.departmentName,
            }));

        setDepartments(authorityRows.filter((item) => item.name));
        setDistrictOptions(districtResponse.data || []);
      } catch (_error) {
        if (!isMounted) return;
        setDepartmentsError(t(lang, 'masterDataUnavailable'));
      }
    }

    fetchInitialData();
    return () => {
      isMounted = false;
    };
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(
      'smart_rti_form_draft',
      JSON.stringify({
        formData,
        attachmentMeta,
      })
    );
    localStorage.setItem('smart_rti_draft', formData.inputText);
  }, [attachmentMeta, formData]);

  useEffect(() => {
    let isMounted = true;

    async function fetchTaluks() {
      if (!formData.district) {
        setTalukOptions([]);
        setVillageOptions([]);
        return;
      }

      try {
        const response = await API.get(`/taluks?district=${encodeURIComponent(formData.district)}`);
        if (!isMounted) return;
        setTalukOptions(response.data || []);
      } catch (_error) {
        if (!isMounted) return;
        setLocationError(t(lang, 'talukLoadError'));
      }
    }

    fetchTaluks();
    return () => {
      isMounted = false;
    };
  }, [formData.district, lang]);

  useEffect(() => {
    let isMounted = true;

    async function fetchVillages() {
      if (!formData.district || !formData.taluk) {
        setVillageOptions([]);
        return;
      }

      try {
        const response = await API.get(
          `/villages?district=${encodeURIComponent(formData.district)}&taluk=${encodeURIComponent(formData.taluk)}`
        );
        if (!isMounted) return;
        setVillageOptions(response.data || []);
      } catch (_error) {
        if (!isMounted) return;
        setLocationError(t(lang, 'villageLoadError'));
      }
    }

    fetchVillages();
    return () => {
      isMounted = false;
    };
  }, [formData.district, formData.taluk, lang]);

  const handleFieldChange = (field, value) => {
    setError('');
    setLocationError('');

    if (field === 'email' || field === 'mobileNumber') {
      const channel = field === 'email' ? 'email' : 'mobile';
      setVerification((prev) => ({
        ...prev,
        [channel]: {
          ...prev[channel],
          sent: false,
          verified: false,
          otp: '',
          message: '',
          error: '',
          demoOtp: '',
        },
      }));
    }

    if (field === 'district') {
      setFormData((prev) => ({ ...prev, district: value, taluk: '', village: '' }));
      return;
    }

    if (field === 'taluk') {
      setFormData((prev) => ({ ...prev, taluk: value, village: '' }));
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateVerification = (channel, updates) => {
    setVerification((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        ...updates,
      },
    }));
  };

  const requestOtp = async (channel) => {
    const recipient = channel === 'email' ? formData.email : formData.mobileNumber;

    updateVerification(channel, {
      loading: true,
      error: '',
      message: '',
      verified: false,
      demoOtp: '',
    });

    try {
      const response = await API.post('/auth/request-otp', {
        channel,
        recipient,
      });

      updateVerification(channel, {
        loading: false,
        sent: true,
        message: response.data.message || OTP_TEXT.sent,
        error: '',
        demoOtp: response.data.demoOtp || '',
      });
    } catch (requestError) {
      updateVerification(channel, {
        loading: false,
        sent: false,
        error: requestError.response?.data?.error || OTP_TEXT.sendFailed,
      });
    }
  };

  const verifyOtp = async (channel) => {
    const recipient = channel === 'email' ? formData.email : formData.mobileNumber;
    const otp = verification[channel].otp;

    updateVerification(channel, {
      verifying: true,
      error: '',
      message: '',
    });

    try {
      const response = await API.post('/auth/verify-otp', {
        channel,
        recipient,
        otp,
      });

      updateVerification(channel, {
        verifying: false,
        verified: true,
        sent: true,
        message: response.data.message || OTP_TEXT.verified,
        error: '',
      });
    } catch (requestError) {
      updateVerification(channel, {
        verifying: false,
        verified: false,
        error: requestError.response?.data?.error || OTP_TEXT.verifyFailed,
      });
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setAttachmentMeta(null);
      return;
    }

    if (file.type !== 'application/pdf') {
      setError(t(lang, 'pdfOnlyError'));
      event.target.value = '';
      return;
    }

    if (file.size > 1024 * 1024) {
      setError(t(lang, 'pdfSizeError'));
      event.target.value = '';
      return;
    }

    setError('');
    setAttachmentMeta({
      name: file.name,
      size: file.size,
      type: file.type,
    });
  };

  const validateForm = () => {
    if (!formData.publicAuthority) return t(lang, 'publicAuthorityRequired');
    if (!formData.applicantName.trim()) return t(lang, 'applicantNameRequired');
    if (!formData.addressLine1.trim()) return t(lang, 'addressRequired');
    if (!formData.state) return t(lang, 'stateRequired');
    if (!formData.district) return t(lang, 'districtRequired');
    if (!formData.taluk) return t(lang, 'talukRequired');
    if (!formData.village) return t(lang, 'villageRequired');
    if (!formData.mobileNumber.trim()) return t(lang, 'mobileRequired');
    if (!formData.email.trim()) return t(lang, 'emailRequired');
    if (!verification.mobile.verified) return OTP_TEXT.mobileRequired;
    if (!verification.email.verified) return OTP_TEXT.emailRequired;
    if (!formData.isBpl) return t(lang, 'bplRequired');
    if (!formData.inputText.trim()) return t(lang, 'requestTextRequired');
    if (!formData.captchaInput.trim()) return t(lang, 'captchaRequired');
    if (formData.captchaInput.trim().toUpperCase() !== captchaCode) return t(lang, 'captchaMismatch');
    return '';
  };

  const handleReset = () => {
    setFormData({ ...INITIAL_FORM, state: 'Tamil Nadu' });
    setAttachmentMeta(null);
    setError('');
    setLocationError('');
    setTalukOptions([]);
    setVillageOptions([]);
    setCaptchaCode(buildCaptcha());
    setVerification(createVerificationState());
    localStorage.removeItem('smart_rti_form_draft');
    localStorage.removeItem('smart_rti_draft');
  };

  const handleSubmit = async () => {
    const validationMessage = validateForm();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const location = [formData.district, formData.taluk, formData.village].filter(Boolean).join(', ');

      const response = await API.post('/rti/generate', {
        inputText: formData.inputText,
        location,
      });

      const rankedDepartments = Array.isArray(response.data.departments) ? response.data.departments : [];
      const primaryDepartment = rankedDepartments[0]?.name || response.data.department || formData.publicAuthority;
      const primaryKeywords = rankedDepartments[0]?.matchedKeywords || response.data.matchedKeywords || [];

      const reviewPayload = {
        inputText: formData.inputText,
        department: primaryDepartment,
        departments: rankedDepartments,
        matchedKeywords: primaryKeywords,
        generatedDraft: response.data.generatedDraft || '',
        score: response.data.score || 0,
        suggestions: response.data.suggestions || [],
        detectedLocation: response.data.detectedLocation || location,
        locationSuggestion: response.data.locationSuggestion || '',
        verification: {
          emailVerified: verification.email.verified,
          mobileVerified: verification.mobile.verified,
        },
        formData: {
          ...formData,
          location,
          supportingDocument: attachmentMeta,
        },
      };

      localStorage.setItem('smart_rti_review_payload', JSON.stringify(reviewPayload));
      navigate('/review-draft', { state: reviewPayload });
    } catch (_error) {
      setError(t(lang, 'analyzeFailed'));
      setCaptchaCode(buildCaptcha());
      setFormData((prev) => ({ ...prev, captchaInput: '' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f7f8]">
      <Navbar />

      <main className="flex-1 bg-[linear-gradient(90deg,_#fff9d6_0%,_#d6f4f3_100%)] py-8">
        <div className="mx-auto max-w-[1320px] px-5">
          <div className="bg-white px-6 py-3 text-center shadow-sm">
            <h1 className="text-[22px] font-medium text-slate-800">{t(lang, 'requestFormTitle')}</h1>
          </div>

          <div className="mt-3 space-y-1 text-center text-sm">
            <p className="font-semibold text-[#d600b8]">
              {t(lang, 'requestMandatoryNote').replace('*', '')} <span className="text-red-600">*</span>
            </p>
            <p className="text-[#0046cc]">{t(lang, 'requestCitizensOnly')}</p>
          </div>

          {error ? <div className="alert-error mt-4">{error}</div> : null}
          {departmentsError ? <div className="alert-error mt-4">{departmentsError}</div> : null}
          {locationError ? <div className="alert-error mt-4">{locationError}</div> : null}

          <div className="mt-6 space-y-5">
            <section className="overflow-hidden border border-[#dce6f5] bg-white shadow-sm">
              <SectionHeader>{t(lang, 'publicAuthorityDetails')}</SectionHeader>
              <div className="grid gap-6 px-6 py-6 md:grid-cols-[1fr_1.2fr] md:items-center">
                <div className="text-center text-[15px] leading-7 text-slate-800">
                  <p>
                    <span className="text-red-600">*</span> {t(lang, 'selectAnyOneOption')}
                  </p>
                  <p>{t(lang, 'chooseRelevantAuthority')}</p>
                </div>
                <div>
                  <select
                    value={formData.publicAuthority}
                    onChange={(event) => handleFieldChange('publicAuthority', event.target.value)}
                    className={FIELD_INPUT}
                  >
                    <option value="">{t(lang, 'selectOption')}</option>
                    {departments.map((item) => (
                      <option key={item.id || item.name} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <section className="overflow-hidden border border-[#dce6f5] bg-white shadow-sm">
              <SectionHeader>{t(lang, 'personalDetails')}</SectionHeader>

              <div className="space-y-8 px-6 py-6">
                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.7fr_1.1fr_0.9fr]">
                  <div>
                    <FieldLabel required>{t(lang, 'labelName')}</FieldLabel>
                    <input value={formData.applicantName} onChange={(event) => handleFieldChange('applicantName', event.target.value)} className={FIELD_INPUT} />
                  </div>

                  <div>
                    <FieldLabel>{t(lang, 'labelGender')}</FieldLabel>
                    <div className="space-y-2 pt-1 text-sm text-slate-700">
                      {[
                        { value: 'Male', label: t(lang, 'genderMale') },
                        { value: 'Female', label: t(lang, 'genderFemale') },
                        { value: 'Trans Gender', label: t(lang, 'genderTrans') },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="gender"
                            value={option.value}
                            checked={formData.gender === option.value}
                            onChange={(event) => handleFieldChange('gender', event.target.value)}
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <FieldLabel required>{t(lang, 'labelAddress')}</FieldLabel>
                    <div className="space-y-2">
                      <input value={formData.addressLine1} onChange={(event) => handleFieldChange('addressLine1', event.target.value)} className={FIELD_INPUT} />
                      <input value={formData.addressLine2} onChange={(event) => handleFieldChange('addressLine2', event.target.value)} className={FIELD_INPUT} />
                      <input value={formData.addressLine3} onChange={(event) => handleFieldChange('addressLine3', event.target.value)} className={FIELD_INPUT} />
                    </div>
                  </div>

                  <div>
                    <FieldLabel>{t(lang, 'labelPincode')}</FieldLabel>
                    <input
                      value={formData.pincode}
                      onChange={(event) => handleFieldChange('pincode', event.target.value.replace(/\D/g, '').slice(0, 6))}
                      className={FIELD_INPUT}
                    />
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[0.8fr_1fr_1fr_1fr_1fr]">
                  <div>
                    <FieldLabel>{t(lang, 'labelCountry')}</FieldLabel>
                    <div className="space-y-2 pt-1 text-sm text-slate-700">
                      {[
                        { value: 'India', label: t(lang, 'countryIndia') },
                        { value: 'Other', label: t(lang, 'countryOther') },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="country"
                            value={option.value}
                            checked={formData.country === option.value}
                            onChange={(event) => handleFieldChange('country', event.target.value)}
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <FieldLabel required>{t(lang, 'labelState')}</FieldLabel>
                    <select value={formData.state} onChange={(event) => handleFieldChange('state', event.target.value)} className={FIELD_INPUT}>
                      <option value="">{t(lang, 'selectOption')}</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                    </select>
                  </div>

                  <div>
                    <FieldLabel required>{t(lang, 'labelDistrict')}</FieldLabel>
                    <select value={formData.district} onChange={(event) => handleFieldChange('district', event.target.value)} className={FIELD_INPUT}>
                      <option value="">{t(lang, 'selectOption')}</option>
                      {districtOptions.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <FieldLabel required>{t(lang, 'labelTaluk')}</FieldLabel>
                    <select
                      value={formData.taluk}
                      onChange={(event) => handleFieldChange('taluk', event.target.value)}
                      className={`${FIELD_INPUT} ${!formData.district ? 'bg-slate-100 text-slate-400' : ''}`}
                      disabled={!formData.district}
                    >
                      <option value="">{t(lang, 'selectOption')}</option>
                      {talukOptions.map((taluk) => (
                        <option key={taluk} value={taluk}>
                          {taluk}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <FieldLabel required>{t(lang, 'labelVillage')}</FieldLabel>
                    <select
                      value={formData.village}
                      onChange={(event) => handleFieldChange('village', event.target.value)}
                      className={`${FIELD_INPUT} ${!formData.taluk ? 'bg-slate-100 text-slate-400' : ''}`}
                      disabled={!formData.taluk}
                    >
                      <option value="">{t(lang, 'selectOption')}</option>
                      {villageOptions.map((village) => (
                        <option key={village} value={village}>
                          {village}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1fr_1fr_1fr_0.9fr]">
                  <div>
                    <FieldLabel>{t(lang, 'labelPhoneNumber')}</FieldLabel>
                    <div className="grid grid-cols-[64px_1fr] gap-2">
                      <input value="+91" readOnly className={`${FIELD_INPUT} bg-slate-100`} />
                      <input
                        value={formData.phoneNumber}
                        onChange={(event) => handleFieldChange('phoneNumber', event.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder={t(lang, 'enterPhoneNumber')}
                        className={FIELD_INPUT}
                      />
                    </div>
                  </div>

                  <div>
                    <FieldLabel accent>{t(lang, 'labelMobileNumber')}</FieldLabel>
                    <div className="grid grid-cols-[64px_1fr_auto] gap-2">
                      <input value="+91" readOnly className={`${FIELD_INPUT} bg-slate-100`} />
                      <input
                        value={formData.mobileNumber}
                        onChange={(event) => handleFieldChange('mobileNumber', event.target.value.replace(/\D/g, '').slice(0, 10))}
                        className={FIELD_INPUT}
                      />
                      <button
                        type="button"
                        onClick={() => requestOtp('mobile')}
                        disabled={verification.mobile.loading || formData.mobileNumber.trim().length !== 10}
                        className={OTP_BUTTON}
                      >
                        {verification.mobile.loading ? OTP_TEXT.sending : OTP_TEXT.send}
                      </button>
                    </div>
                    <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
                      <input
                        value={verification.mobile.otp}
                        onChange={(event) => updateVerification('mobile', { otp: event.target.value.replace(/\D/g, '').slice(0, 6), error: '' })}
                        placeholder={OTP_TEXT.enter}
                        className={FIELD_INPUT}
                      />
                      <button
                        type="button"
                        onClick={() => verifyOtp('mobile')}
                        disabled={verification.mobile.verifying || verification.mobile.otp.length !== 6 || !verification.mobile.sent}
                        className={OTP_BUTTON}
                      >
                        {verification.mobile.verifying ? OTP_TEXT.verifying : OTP_TEXT.verify}
                      </button>
                    </div>
                    {verification.mobile.demoOtp ? (
                      <p className="mt-1 text-xs text-[#0F6C73]">
                        {OTP_TEXT.demo}: {verification.mobile.demoOtp}
                      </p>
                    ) : null}
                    {verification.mobile.error ? <p className="mt-1 text-xs text-red-600">{verification.mobile.error}</p> : null}
                    {verification.mobile.message ? (
                      <p className={`mt-1 text-xs ${verification.mobile.verified ? 'text-green-700' : 'text-[#0F6C73]'}`}>
                        {verification.mobile.message}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <FieldLabel required>{t(lang, 'labelEmailId')}</FieldLabel>
                    <div className="grid grid-cols-[1fr_auto] gap-2">
                      <input type="email" value={formData.email} onChange={(event) => handleFieldChange('email', event.target.value)} className={FIELD_INPUT} />
                      <button
                        type="button"
                        onClick={() => requestOtp('email')}
                        disabled={verification.email.loading || !formData.email.trim()}
                        className={OTP_BUTTON}
                      >
                        {verification.email.loading ? OTP_TEXT.sending : OTP_TEXT.send}
                      </button>
                    </div>
                    <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
                      <input
                        value={verification.email.otp}
                        onChange={(event) => updateVerification('email', { otp: event.target.value.replace(/\D/g, '').slice(0, 6), error: '' })}
                        placeholder={OTP_TEXT.enter}
                        className={FIELD_INPUT}
                      />
                      <button
                        type="button"
                        onClick={() => verifyOtp('email')}
                        disabled={verification.email.verifying || verification.email.otp.length !== 6 || !verification.email.sent}
                        className={OTP_BUTTON}
                      >
                        {verification.email.verifying ? OTP_TEXT.verifying : OTP_TEXT.verify}
                      </button>
                    </div>
                    {verification.email.demoOtp ? (
                      <p className="mt-1 text-xs text-[#0F6C73]">
                        {OTP_TEXT.demo}: {verification.email.demoOtp}
                      </p>
                    ) : null}
                    {verification.email.error ? <p className="mt-1 text-xs text-red-600">{verification.email.error}</p> : null}
                    {verification.email.message ? (
                      <p className={`mt-1 text-xs ${verification.email.verified ? 'text-green-700' : 'text-[#0F6C73]'}`}>
                        {verification.email.message}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <FieldLabel>{t(lang, 'labelEducationalStatus')}</FieldLabel>
                    <div className="space-y-2 pt-1 text-sm text-slate-700">
                      {[
                        { value: 'Literate', label: t(lang, 'literate') },
                        { value: 'Illiterate', label: t(lang, 'illiterate') },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="educationalStatus"
                            value={option.value}
                            checked={formData.educationalStatus === option.value}
                            onChange={(event) => handleFieldChange('educationalStatus', event.target.value)}
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="overflow-hidden border border-[#dce6f5] bg-white shadow-sm">
              <SectionHeader>{t(lang, 'requestDetails')}</SectionHeader>

              <div className="space-y-8 px-6 py-6">
                <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
                  <div className="text-[15px] leading-7 text-slate-800">
                    <FieldLabel required>{t(lang, 'labelBpl')}</FieldLabel>
                    <p>{t(lang, 'bplNote')}</p>
                  </div>
                  <div>
                    <select value={formData.isBpl} onChange={(event) => handleFieldChange('isBpl', event.target.value)} className={FIELD_INPUT}>
                      <option value="">{t(lang, 'selectOption')}</option>
                      <option value="No">{t(lang, 'no')}</option>
                      <option value="Yes">{t(lang, 'yes')}</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
                  <div className="space-y-3 text-[15px] leading-7 text-slate-800">
                    <FieldLabel required>{t(lang, 'requestTextLabel')}</FieldLabel>
                    <p>{t(lang, 'requestTextHelp')}</p>
                    <p className="text-[#d600b8]">{t(lang, 'requestTextLimit')}</p>
                  </div>
                  <div>
                    <textarea
                      value={formData.inputText}
                      onChange={(event) => handleFieldChange('inputText', event.target.value.slice(0, 3000))}
                      className={TEXT_AREA}
                    />
                    <p className="mt-2 text-right text-xs text-[#007a00]">
                      {formData.inputText.length}/3000 {t(lang, 'charactersEntered')}
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
                  <div className="space-y-2 text-[15px] leading-7 text-slate-800">
                    <FieldLabel>{t(lang, 'supportingDocument')}</FieldLabel>
                    <p>{t(lang, 'supportingDocumentRule')}</p>
                    <p className="text-[#d600b8]">{t(lang, 'supportingDocumentChars')}</p>
                    {attachmentMeta ? (
                      <p className="text-xs font-semibold text-[#0F6C73]">
                        {t(lang, 'supportingDocumentSelected')}: {attachmentMeta.name} ({Math.round(attachmentMeta.size / 1024)} KB)
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className={`${FIELD_INPUT} file:mr-3 file:rounded file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium`}
                    />
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
                  <div className="space-y-2 text-[15px] leading-7 text-slate-800">
                    <FieldLabel required>{t(lang, 'captchaLabel')}</FieldLabel>
                    <p>{t(lang, 'captchaHelp')}</p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-[160px_auto_1fr] md:items-center">
                    <div className="text-center text-xl font-semibold tracking-[0.2em] text-slate-700">{captchaCode}</div>
                    <button
                      type="button"
                      onClick={() => {
                        setCaptchaCode(buildCaptcha());
                        handleFieldChange('captchaInput', '');
                      }}
                      className="text-sm font-medium text-slate-600 hover:text-slate-800"
                    >
                      ↻ {t(lang, 'captchaRefresh')}
                    </button>
                    <input
                      value={formData.captchaInput}
                      onChange={(event) => handleFieldChange('captchaInput', event.target.value)}
                      placeholder={t(lang, 'captchaPlaceholder')}
                      className={FIELD_INPUT}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="rounded bg-[#f7b500] px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-[#e5a800] disabled:opacity-60"
                  >
                    {loading ? t(lang, 'processing') : t(lang, 'submit')}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded bg-slate-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-600"
                  >
                    {t(lang, 'reset')}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-[#eceef0]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 py-6 text-center text-xs text-slate-500">
          <div className="flex flex-wrap justify-center gap-5">
            <span>{t(lang, 'footerPrivacy')}</span>
            <span>{t(lang, 'footerTerms')}</span>
            <span>{t(lang, 'footerAccessibility')}</span>
            <span>{t(lang, 'footerContactSupport')}</span>
          </div>
          <p className="font-semibold text-slate-700">{t(lang, 'footerPortal')}</p>
        </div>
      </footer>
    </div>
  );
}
