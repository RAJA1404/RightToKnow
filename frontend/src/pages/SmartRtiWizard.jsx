import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

function SuggestionList({ suggestions }) {
  if (!suggestions.length) {
    return <p className="text-sm text-green-700 font-medium">The request is already specific enough to move forward.</p>;
  }

  return (
    <ul className="space-y-2 text-sm text-slate-700">
      {suggestions.map((suggestion) => (
        <li key={suggestion} className="flex gap-2">
          <span className="text-amber-500 font-bold">•</span>
          <span>{suggestion}</span>
        </li>
      ))}
    </ul>
  );
}

export default function SmartRtiWizard() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inputText, setInputText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [departmentResponse, categoryResponse] = await Promise.all([
          API.get('/departments'),
          API.get('/categories'),
        ]);
        setDepartments(departmentResponse.data?.data || departmentResponse.data || []);
        setCategories(categoryResponse.data);
      } catch (_error) {
        setDepartments([]);
        setCategories([]);
      }
    };

    loadMetadata();
  }, []);

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setError('Enter the RTI request details before generating the draft.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(null);

    try {
      const response = await API.post('/rti/generate', { inputText });
      setAnalysis(response.data);
    } catch (_error) {
      setError('Failed to analyze the RTI request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!analysis) {
      setError('Generate the smart output before submitting.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await API.post('/rti/submit', {
        inputText,
        department: analysis.department,
        matchedKeywords: analysis.matchedKeywords,
        generatedDraft: analysis.generatedDraft,
        score: analysis.score,
        suggestions: analysis.suggestions,
      });

      setSuccess(response.data);
    } catch (_error) {
      setError('Failed to submit the Smart RTI request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        <section className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          <div className="bg-[#1a3a6b] px-8 py-8 text-white">
            <p className="text-xs uppercase tracking-[0.18em] text-blue-100">Smart RTI Service</p>
            <h1 className="mt-3 text-3xl font-bold">Generate an RTI draft from plain language</h1>
            <p className="mt-3 text-sm leading-7 text-blue-100">
              The assistant matches your request to department keywords, scores the clarity of the input, and returns a structured RTI draft.
            </p>
          </div>

          <div className="p-8 grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8">
            <section>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Describe the information you want</label>
              <textarea
                value={inputText}
                onChange={(event) => setInputText(event.target.value)}
                rows="12"
                className="gov-input resize-none"
                placeholder="Example: Provide the certified copy of the road repair estimate, work order, and completion report for the repair work carried out on Market Street during 2024."
              />

              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" onClick={handleGenerate} disabled={loading} className="btn-primary">
                  {loading ? 'Analyzing...' : 'Generate Smart Output'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputText('');
                    setAnalysis(null);
                    setSuccess(null);
                    setError('');
                  }}
                  className="btn-secondary"
                >
                  Reset
                </button>
              </div>

              {error && <div className="alert-error mt-5">{error}</div>}
              {success && (
                <div className="alert-success mt-5">
                  Request submitted successfully. Your application ID is <span className="font-mono font-bold">{success.applicationId}</span>.
                  <button
                    type="button"
                    onClick={() => navigate(`/track-smart-rti?id=${encodeURIComponent(success.applicationId)}`)}
                    className="ml-3 underline font-semibold"
                  >
                    Track now
                  </button>
                </div>
              )}
            </section>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Departments Loaded</p>
                <p className="mt-2 text-3xl font-bold text-slate-800">{departments.length}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Categories Loaded</p>
                <p className="mt-2 text-3xl font-bold text-slate-800">{categories.length}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-800">What the service returns</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>Suggested department</li>
                  <li>Matched keywords</li>
                  <li>Generated RTI draft</li>
                  <li>Quality score and suggestions</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>

        {analysis && (
          <section className="grid grid-cols-1 xl:grid-cols-[0.88fr_1.12fr] gap-6">
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Suggested Department</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-800">{analysis.department}</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {analysis.matchedKeywords.length ? (
                    analysis.matchedKeywords.map((keyword) => (
                      <span key={keyword} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#1a3a6b]">
                        {keyword}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">No direct keyword hit found. Default routing suggestion applied.</span>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Validation Engine</p>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-4xl font-bold text-slate-800">{analysis.score}/10</p>
                    <p className="text-sm text-slate-500 mt-1">Input quality score</p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-semibold text-slate-800 mb-3">Suggestions</p>
                  <SuggestionList suggestions={analysis.suggestions} />
                </div>

                <button type="button" onClick={handleSubmit} disabled={submitting} className="btn-primary mt-6">
                  {submitting ? 'Submitting...' : 'Submit Smart RTI Request'}
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-6 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Input</p>
                  <pre className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700 font-sans">{inputText}</pre>
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Generated Draft</p>
                  <pre className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-800">{analysis.generatedDraft}</pre>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
