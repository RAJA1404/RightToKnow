import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import ProgressSidebar from '../components/ProgressSidebar';
import DepartmentCard from '../components/DepartmentCard';
import QueryCard from '../components/QueryCard';
import DraftViewer from '../components/DraftViewer';
import ScoreCard from '../components/ScoreCard';
import SuggestionBox from '../components/SuggestionBox';
import { useLanguage } from '../context/LanguageContext';
import { translate as t } from '../i18n/portalText';

function buildIntentPoints(inputText) {
  return inputText
    .split(/[.?\n]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function buildInitialDepartmentMeta(payload) {
  const rankedDepartments = payload?.departments || [];
  const initialDepartmentName = payload?.department || rankedDepartments[0]?.name || '';
  const existingDepartment = rankedDepartments.find((item) => item.name === initialDepartmentName);

  if (existingDepartment) {
    return existingDepartment;
  }

  return {
    name: initialDepartmentName,
    matchedKeywords: payload?.matchedKeywords || [],
    confidence: null,
  };
}

export default function ReviewDraft() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const storedPayload = JSON.parse(localStorage.getItem('smart_rti_review_payload') || 'null');
  const payload = location.state || storedPayload;

  const [inputText] = useState(payload?.inputText || '');
  const [departments] = useState(payload?.departments || []);
  const [selectedDepartment, setSelectedDepartment] = useState(payload?.department || payload?.departments?.[0]?.name || '');
  const [selectedDepartmentMeta, setSelectedDepartmentMeta] = useState(() => buildInitialDepartmentMeta(payload));
  const [generatedDraft, setGeneratedDraft] = useState(payload?.generatedDraft || '');
  const [score] = useState(payload?.score || 0);
  const [suggestions, setSuggestions] = useState(payload?.suggestions || []);
  const [detectedLocation] = useState(payload?.detectedLocation || '');
  const [locationSuggestion] = useState(payload?.locationSuggestion || '');
  const [formData] = useState(payload?.formData || null);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successId, setSuccessId] = useState('');
  const [submissionSummary, setSubmissionSummary] = useState(null);

  const intentPoints = useMemo(() => buildIntentPoints(inputText), [inputText]);
  const displayScore = useMemo(() => {
    const numericScore = Number(score) || 0;
    return numericScore <= 10 ? numericScore * 10 : numericScore;
  }, [score]);

  useEffect(() => {
    if (!successId) {
      return undefined;
    }

    const redirectTimer = window.setTimeout(() => {
      navigate('/submitted-request', {
        state: {
          submissionSummary,
        },
      });
    }, 2000);

    return () => {
      window.clearTimeout(redirectTimer);
    };
  }, [navigate, submissionSummary, successId]);

  if (!payload) {
    return (
      <div className="min-h-screen bg-[#f6f7f8]">
        <Navbar />
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-slate-900">{t(lang, 'reviewTitle')}</h1>
            <p className="mt-4 text-sm text-slate-500">{t(lang, 'reviewNoData')}</p>
            <button
              type="button"
              onClick={() => navigate('/smart-assistant')}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0F6C73] px-6 py-3 text-sm font-semibold text-white"
            >
              {t(lang, 'goToNewRequest')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const persistReviewPayload = () => {
    localStorage.setItem(
      'smart_rti_review_payload',
      JSON.stringify({
        inputText,
        department: selectedDepartment,
        departments,
        matchedKeywords: selectedDepartmentMeta?.matchedKeywords || [],
        generatedDraft,
        score,
        suggestions,
        detectedLocation,
        locationSuggestion,
        formData,
      })
    );
    localStorage.setItem(
      'smart_rti_form_draft',
      JSON.stringify({
        formData: formData || { inputText },
        attachmentMeta: formData?.supportingDocument || null,
      })
    );
    localStorage.setItem('smart_rti_draft', formData?.inputText || inputText);
  };

  const handleSaveDraftExit = () => {
    persistReviewPayload();
    navigate('/smart-assistant');
  };

  const handleChangeDepartment = () => {
    persistReviewPayload();
    navigate('/smart-assistant');
  };

  const handleSelectDepartment = (departmentOption) => {
    setSelectedDepartment(departmentOption.name);
    setSelectedDepartmentMeta(departmentOption);
  };

  const handleAutofill = () => {
    if (suggestions.length === 0) return;

    const autofillNote =
      lang === 'ta'
        ? '\n\nகூடுதல் தெளிவுபடுத்தல்கள்:\n- சரியான இடம் / அடையாளம்\n- தொடர்புடைய தேதி அல்லது காலவரம்பு\n- தேவையான குறிப்பிட்ட பதிவுகள்'
        : '\n\nAdditional details to clarify:\n- Exact location / landmark\n- Relevant period or date range\n- Specific records requested';

    if (!generatedDraft.includes(lang === 'ta' ? 'கூடுதல் தெளிவுபடுத்தல்கள்' : 'Additional details to clarify')) {
      setGeneratedDraft((prev) => `${prev}${autofillNote}`);
    }

    setSuggestions((prev) => prev.slice(1));
  };

  const handleFinalizeSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      const response = await API.post('/rti/submit', {
        inputText,
        department: selectedDepartment,
        matchedKeywords: selectedDepartmentMeta?.matchedKeywords || [],
        generatedDraft,
        score,
        suggestions,
        formData,
      });

      setSuccessId(response.data.applicationId);
      setSubmissionSummary({
        applicationId: response.data.applicationId,
        status: response.data.status,
        createdAt: response.data.createdAt,
        department: selectedDepartment,
        applicantName: formData?.applicantName || '',
        detectedLocation,
        inputText,
        generatedDraft,
        matchedKeywords: selectedDepartmentMeta?.matchedKeywords || [],
        suggestions,
        publicAuthority: formData?.publicAuthority || '',
      });
      localStorage.setItem(
        'latest_submitted_request',
        JSON.stringify({
          applicationId: response.data.applicationId,
          status: response.data.status,
          createdAt: response.data.createdAt,
          department: selectedDepartment,
          applicantName: formData?.applicantName || '',
          detectedLocation,
          inputText,
          generatedDraft,
          matchedKeywords: selectedDepartmentMeta?.matchedKeywords || [],
          suggestions,
          publicAuthority: formData?.publicAuthority || '',
        })
      );
      localStorage.removeItem('smart_rti_review_payload');
      localStorage.removeItem('smart_rti_form_draft');
      localStorage.removeItem('smart_rti_draft');
    } catch (_error) {
      setError(t(lang, 'submitFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f7f8]">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[280px_1fr_360px]">
            <div className="space-y-5">
              <ProgressSidebar />
              <DepartmentCard
                department={selectedDepartment}
                matchedKeywords={selectedDepartmentMeta?.matchedKeywords || []}
                confidence={selectedDepartmentMeta?.confidence}
                departments={departments}
                onSelectDepartment={handleSelectDepartment}
                onChangeDepartment={handleChangeDepartment}
              />
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">{t(lang, 'reviewTitle')}</h1>
                <p className="mt-3 text-sm leading-7 text-slate-500">{t(lang, 'reviewSubtitle')}</p>
              </div>

              {error ? <div className="alert-error">{error}</div> : null}

              {successId ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <h2 className="text-lg font-bold text-emerald-900">{t(lang, 'submittedSuccessfully')}</h2>
                  <p className="mt-2 text-sm text-emerald-800">
                    {t(lang, 'applicationId')}: <span className="font-mono font-bold">{successId}</span>
                  </p>
                </div>
              ) : null}

              <div className="space-y-5">
                <QueryCard inputText={inputText} />

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{t(lang, 'aiAnalysis')}</p>
                  <div className="mt-4 space-y-5">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{t(lang, 'detectedLocation')}</p>
                      <p className="mt-2 text-sm text-slate-600">{detectedLocation || t(lang, 'locationMissing')}</p>
                      {!detectedLocation && locationSuggestion ? (
                        <p className="mt-2 text-xs font-medium text-[#d600b8]">{locationSuggestion}</p>
                      ) : null}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">{t(lang, 'suggestedDepartments')}</p>
                      <div className="mt-3 space-y-3">
                        {departments.length > 0 ? (
                          departments.map((departmentOption, index) => {
                            const isSelected = departmentOption.name === selectedDepartment;

                            return (
                              <button
                                key={`${departmentOption.name}-${index}`}
                                type="button"
                                onClick={() => handleSelectDepartment(departmentOption)}
                                className={`flex w-full items-start justify-between gap-4 rounded-xl border p-4 text-left transition-colors ${
                                  isSelected
                                    ? 'border-[#0F6C73] bg-[#0F6C73]/5'
                                    : 'border-slate-200 bg-slate-50 hover:border-[#0F6C73]/40 hover:bg-white'
                                }`}
                              >
                                <div>
                                  <p className="text-sm font-semibold text-slate-800">{departmentOption.name}</p>
                                  <p className="mt-2 text-xs text-slate-500">
                                    {departmentOption.matchedKeywords?.length
                                      ? departmentOption.matchedKeywords.join(', ')
                                      : departmentOption.message || t(lang, 'noMatchedKeywords')}
                                  </p>
                                </div>
                                <div className="shrink-0 text-right">
                                  <p className="text-sm font-bold text-[#0F6C73]">{departmentOption.confidence}%</p>
                                  <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-slate-400">{t(lang, 'confidence')}</p>
                                </div>
                              </button>
                            );
                          })
                        ) : (
                          <span className="text-sm text-slate-500">{t(lang, 'noDepartmentSuggestions')}</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">{t(lang, 'extractedKeywords')}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedDepartmentMeta?.matchedKeywords?.length ? (
                          selectedDepartmentMeta.matchedKeywords.map((keyword) => (
                            <span
                              key={keyword}
                              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-[#0F6C73]"
                            >
                              {keyword}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-500">{t(lang, 'noExtractedKeywords')}</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">{t(lang, 'identifiedIntentPoints')}</p>
                      <ul className="mt-2 space-y-2">
                        {intentPoints.map((point) => (
                          <li key={point} className="flex gap-2 text-sm text-slate-600">
                            <span className="font-bold text-[#0F6C73]">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <ScoreCard score={displayScore} suggestionsCount={suggestions.length} />
              <DraftViewer
                generatedDraft={generatedDraft}
                isEditing={isEditingDraft}
                onToggleEdit={() => setIsEditingDraft((prev) => !prev)}
                onChange={setGeneratedDraft}
              />
              <SuggestionBox suggestions={suggestions} onAutofill={handleAutofill} />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleSaveDraftExit}
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                {t(lang, 'saveDraftExit')}
              </button>
              <button
                type="button"
                onClick={() => setIsEditingDraft(true)}
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                {t(lang, 'editDraftManually')}
              </button>
              <button
                type="button"
                onClick={handleFinalizeSubmit}
                disabled={submitting || Boolean(successId)}
                className="rounded-lg bg-[#0F6C73] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0c5960] disabled:opacity-60"
              >
                {submitting ? t(lang, 'submitting') : t(lang, 'finalizeSubmit')}
              </button>
            </div>
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
