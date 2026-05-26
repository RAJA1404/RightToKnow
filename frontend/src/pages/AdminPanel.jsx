import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../translations';
import { STATUS_BADGE, STATUS_LABEL_KEY } from '../constants';

const APPEAL_BADGE = {
  FILED: 'badge badge-submitted',
  UNDER_REVIEW: 'badge badge-inprogress',
  DISPOSED: 'badge badge-responded',
};

const APPEAL_LABEL_KEY = {
  FILED: 'appealFiled',
  UNDER_REVIEW: 'appealUnderReview',
  DISPOSED: 'appealDisposed',
};

function AnalyticsCard({ label, value, color }) {
  return (
    <div className={`gov-card p-6 border-t-4 ${color}`}>
      <p className="text-slate-500 text-sm font-medium mb-2">{label}</p>
      <p className="text-4xl font-bold text-slate-800">{value}</p>
    </div>
  );
}

function DistrictBars({ data = [] }) {
  const max = Math.max(...data.map((item) => item.total), 1);
  return (
    <div className="gov-card p-6">
      <h3 className="font-bold text-[#166534] mb-4">District-wise RTIs</h3>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.district}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-700 font-medium">{item.district}</span>
              <span className="text-slate-500">{item.total}</span>
            </div>
            <div className="h-2 rounded bg-slate-100 overflow-hidden">
              <div className="h-full bg-green-700 rounded" style={{ width: `${(item.total / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-IN').format(value || 0);
}

function HistoricalTrendBars({ data = [] }) {
  const max = Math.max(...data.map((item) => item.total), 1);
  return (
    <div className="gov-card p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="font-bold text-[#1a3a6b]">Historical Monthly RTI Volume</h3>
          <p className="text-sm text-slate-500 mt-1">Official RTI online portal totals from archived government records.</p>
        </div>
      </div>
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {data.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-700 font-medium">{item.label}</span>
              <span className="text-slate-500">{formatNumber(item.total)}</span>
            </div>
            <div className="h-2 rounded bg-slate-100 overflow-hidden">
              <div className="h-full bg-[#1a3a6b] rounded" style={{ width: `${(item.total / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { lang, toggleLang } = useLanguage();
  const isMainAdmin = user?.role === 'main_admin';
  const isSuperAdmin = user?.role === 'super_admin';
  const isPio = user?.role === 'pio';
  const isCentralAdmin = isMainAdmin || isSuperAdmin;
  const canViewAnalytics = isCentralAdmin || isPio;

  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [appeals, setAppeals] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedAppeal, setSelectedAppeal] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: '', remarks: '', response_document: null });
  const [assignmentForm, setAssignmentForm] = useState({ department_id: '', transfer_reason: '' });
  const [appealForm, setAppealForm] = useState({ status: '', disposal_remarks: '', disposal_document: null, department_id: '', transfer_reason: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [updating, setUpdating] = useState(false);
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1 });
  const panelLabel = isPio
    ? 'PIO Panel'
    : isMainAdmin
      ? t(lang, 'mainAdminPanelLabel')
      : t(lang, 'adminPanelLabel');

  const flashMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const loadDepartments = () => {
    API.get('/rti/departments/')
      .then((r) => setDepartments(r.data))
      .catch(() => setDepartments([]));
  };

  const loadApplications = (page = 1) => {
    setLoading(true);
    API.get(`/rti/dept-applications/?page=${page}`)
      .then((r) => {
        setApplications(r.data.results);
        setPagination({ current_page: r.data.current_page, total_pages: r.data.total_pages });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const loadAppeals = (page = 1) => {
    setLoading(true);
    API.get(`/rti/dept-appeals/?page=${page}`)
      .then((r) => {
        setAppeals(r.data.results);
        setPagination({ current_page: r.data.current_page, total_pages: r.data.total_pages });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const loadAnalytics = () => {
    setLoading(true);
    API.get('/rti/analytics/')
      .then((r) => {
        setAnalytics(r.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (isCentralAdmin) {
      loadDepartments();
    }
  }, [isCentralAdmin]);

  useEffect(() => {
    if (activeTab === 'applications') {
      loadApplications();
    } else if (activeTab === 'appeals') {
      loadAppeals();
    } else if (canViewAnalytics) {
      loadAnalytics();
    }
  }, [activeTab, canViewAnalytics]);

  const handleAssignApplication = async (id) => {
    setUpdating(true);
    try {
      await API.put(`/rti/assign-application/${id}/`, assignmentForm);
      setSelectedApp(null);
      setAssignmentForm({ department_id: '', transfer_reason: '' });
      flashMessage(t(lang, 'adminAssignmentUpdated'), 'success');
      loadApplications(pagination.current_page);
    } catch {
      flashMessage(t(lang, 'adminAssignmentFailed'), 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateApplication = async (id) => {
    setUpdating(true);
    const formData = new FormData();
    formData.append('status', statusForm.status);
    formData.append('remarks', statusForm.remarks);
    if (statusForm.response_document) {
      formData.append('response_document', statusForm.response_document);
    }

    try {
      await API.put(`/rti/update-status/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSelectedApp(null);
      setStatusForm({ status: '', remarks: '', response_document: null });
      setAssignmentForm({ department_id: '', transfer_reason: '' });
      flashMessage(t(lang, 'adminStatusUpdated'), 'success');
      loadApplications(pagination.current_page);
    } catch {
      flashMessage(t(lang, 'adminStatusFailed'), 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateAppeal = async (id) => {
    setUpdating(true);
    const formData = new FormData();
    formData.append('status', appealForm.status);
    formData.append('disposal_remarks', appealForm.disposal_remarks);
    if (appealForm.department_id) {
      formData.append('department_id', appealForm.department_id);
    }
    if (appealForm.transfer_reason) {
      formData.append('transfer_reason', appealForm.transfer_reason);
    }
    if (appealForm.disposal_document) {
      formData.append('disposal_document', appealForm.disposal_document);
    }

    try {
      await API.put(`/rti/update-appeal/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSelectedAppeal(null);
      setAppealForm({ status: '', disposal_remarks: '', disposal_document: null, department_id: '', transfer_reason: '' });
      flashMessage(t(lang, 'adminAppealUpdated'), 'success');
      loadAppeals(pagination.current_page);
    } catch {
      flashMessage(t(lang, 'adminAppealFailed'), 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="gov-topbar" style={{ background: '#14532d' }}>
        <span>{t(lang, 'adminTopbar')} {user?.department_name ? `- ${user.department_name}` : ''}</span>
        <span className="hidden sm:block">{user?.email}</span>
      </div>

      <nav className="bg-white border-b-4 border-green-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-sm">RTI</div>
            <div>
              <p className="font-bold text-green-800 text-base leading-tight">{t(lang, 'portalName')}</p>
              <p className="text-[10px] text-slate-500 leading-tight">{panelLabel}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLang}
              title={lang === 'en' ? 'Switch to Tamil' : 'Switch to English'}
              className="flex items-center gap-0.5 rounded-full border border-slate-300 bg-white overflow-hidden text-xs font-semibold shadow-sm hover:shadow-md transition-all"
            >
              <span className={`px-2.5 py-1 transition-colors ${lang === 'en' ? 'bg-green-700 text-white' : 'text-slate-500'}`}>EN</span>
              <span className={`px-2.5 py-1 transition-colors ${lang === 'ta' ? 'bg-green-700 text-white' : 'text-slate-500'}`}>தமிழ்</span>
            </button>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors font-medium"
            >
              {t(lang, 'logout')}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="page-title-bar fade-in" style={{ borderLeftColor: '#16a34a' }}>
          <h2 className="text-green-800" style={{ color: '#166534' }}>
            {activeTab === 'applications'
              ? (isPio ? 'Assigned RTIs' : t(lang, 'adminRTIApplications'))
              : activeTab === 'appeals'
                ? (isPio ? 'Assigned Appeals' : t(lang, 'adminAppealsTitle'))
                : (isPio ? 'PIO Analytics' : t(lang, 'adminAnalyticsTitle'))} {user?.department_name ? `- ${user.department_name}` : `- ${t(lang, 'adminAllDepts')}`}
          </h2>
          <p>
            {activeTab === 'applications'
              ? (isPio
                ? 'Review and update the citizen RTI requests currently assigned to your officer account.'
                : (isCentralAdmin ? t(lang, 'adminQueueSubtitle') : t(lang, 'adminSubtitle')))
              : activeTab === 'appeals'
                ? (isPio
                  ? 'Review appeals related to the RTIs assigned to your officer account.'
                  : t(lang, 'adminAppealsSubtitle'))
                : (isPio ? 'Overview of RTIs and appeals currently assigned to you.' : t(lang, 'adminAnalyticsSubtitle'))}
          </p>
        </div>

        <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm border border-slate-200 mb-6 fade-in max-w-xl">
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${activeTab === 'applications' ? 'bg-green-700 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            {t(lang, 'adminApplicationsTab')}
          </button>
          <button
            onClick={() => setActiveTab('appeals')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${activeTab === 'appeals' ? 'bg-green-700 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            {t(lang, 'adminAppealsTab')}
          </button>
          {canViewAnalytics && (
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${activeTab === 'analytics' ? 'bg-green-700 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {t(lang, 'adminAnalyticsTab')}
            </button>
          )}
        </div>

        {message.text && (
          <div className={`mb-5 flex items-center gap-2 text-sm rounded-lg px-4 py-3 fade-in ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={message.type === 'success' ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'} />
            </svg>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="gov-card p-12 text-center fade-in">
            <svg className="w-8 h-8 animate-spin text-green-700 mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-slate-400 mt-3">
              {activeTab === 'applications'
                ? t(lang, 'adminLoadingApps')
                : activeTab === 'appeals'
                  ? t(lang, 'adminLoadingAppeals')
                  : t(lang, 'adminLoadingAnalytics')}
            </p>
          </div>
        ) : activeTab === 'analytics' ? (
          analytics ? (
            <div className="space-y-6 fade-in">
              {isPio && (
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">PIO Analytics</p>
                  <h3 className="mt-2 text-2xl font-bold text-[#1a3a6b]">Assigned Case Overview</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    This dashboard shows only the RTIs and appeals currently assigned to your officer account.
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <AnalyticsCard label="Total RTIs" value={analytics.total} color="border-blue-600" />
                <AnalyticsCard label="Pending Assignment" value={analytics.pending_assignment} color="border-amber-500" />
                <AnalyticsCard label="In Progress" value={analytics.in_progress} color="border-orange-500" />
                <AnalyticsCard label="Responded" value={analytics.responded} color="border-green-600" />
                <AnalyticsCard label="Closed" value={analytics.closed} color="border-slate-500" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <AnalyticsCard label="Total Appeals" value={analytics.total_appeals} color="border-purple-600" />
                <AnalyticsCard label="Pending Appeals" value={analytics.pending_appeals} color="border-amber-500" />
                <AnalyticsCard label="Disposed Appeals" value={analytics.disposed_appeals} color="border-emerald-600" />
              </div>
              <DistrictBars data={analytics.district_wise} />
              {isCentralAdmin && analytics.historical_official_data && (
                <>
                  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Historical Official Data</p>
                    <h3 className="mt-2 text-2xl font-bold text-[#1a3a6b]">{analytics.historical_official_data.source_label}</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      Data period: {analytics.historical_official_data.source_period}. This section is reference data and is kept separate from live portal transactions.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    <AnalyticsCard
                      label="Historical Total"
                      value={formatNumber(analytics.historical_official_data.total_applications)}
                      color="border-[#1a3a6b]"
                    />
                    <AnalyticsCard
                      label="Latest Month"
                      value={formatNumber(analytics.historical_official_data.latest_month.total)}
                      color="border-cyan-600"
                    />
                    <AnalyticsCard
                      label="Peak Month"
                      value={formatNumber(analytics.historical_official_data.peak_month.total)}
                      color="border-violet-600"
                    />
                    <AnalyticsCard
                      label="Lowest Month"
                      value={formatNumber(analytics.historical_official_data.lowest_month.total)}
                      color="border-rose-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] gap-6">
                    <div className="gov-card p-6">
                      <h3 className="font-bold text-[#1a3a6b] mb-4">Historical Highlights</h3>
                      <div className="space-y-4 text-sm text-slate-700">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Latest Available Month</p>
                          <p className="mt-2 font-semibold">
                            {analytics.historical_official_data.latest_month.label}: {formatNumber(analytics.historical_official_data.latest_month.total)}
                          </p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Peak Volume</p>
                          <p className="mt-2 font-semibold">
                            {analytics.historical_official_data.peak_month.label}: {formatNumber(analytics.historical_official_data.peak_month.total)}
                          </p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Lowest Volume</p>
                          <p className="mt-2 font-semibold">
                            {analytics.historical_official_data.lowest_month.label}: {formatNumber(analytics.historical_official_data.lowest_month.total)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="gov-card p-6">
                      <h3 className="font-bold text-[#1a3a6b] mb-4">Year-wise Historical Totals</h3>
                      <div className="space-y-3">
                        {analytics.historical_official_data.yearly_totals.map((item) => (
                          <div key={item.year} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                            <span className="font-semibold text-slate-700">{item.year}</span>
                            <span className="text-[#1a3a6b] font-bold">{formatNumber(item.total)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <HistoricalTrendBars data={analytics.historical_official_data.monthly_records} />
                </>
              )}
            </div>
          ) : (
            <div className="gov-card p-12 text-center fade-in">
              <p className="text-slate-500 font-medium">{t(lang, 'adminNoAnalytics')}</p>
            </div>
          )
        ) : activeTab === 'applications' ? (
          applications.length === 0 ? (
            <div className="gov-card p-12 text-center fade-in">
              <p className="text-slate-500 font-medium">{t(lang, 'adminNoApps')}</p>
            </div>
          ) : (
            <div className="gov-card overflow-hidden fade-in">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: '#166534' }} className="gov-thead">
                      <th>{t(lang, 'applicationNo')}</th>
                      <th>{t(lang, 'tableSubject')}</th>
                      <th>{t(lang, 'tableDistrict')}</th>
                      <th>{isCentralAdmin ? t(lang, 'adminRequestedDepartment') : t(lang, 'adminDepartmentLabel')}</th>
                      <th>{t(lang, 'adminCitizen')}</th>
                      <th>{t(lang, 'tableDateFiled')}</th>
                      <th>{t(lang, 'tableStatus')}</th>
                      <th>{t(lang, 'tableAction')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app, idx) => (
                      <tr key={app.id} className={`border-b border-slate-100 hover:bg-green-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                        <td className="px-4 py-3 font-mono text-sm text-green-800 font-bold">{app.application_no}</td>
                        <td className="px-4 py-3 text-slate-700 text-sm max-w-[160px] truncate">{app.subject}</td>
                        <td className="px-4 py-3 text-slate-600 text-sm">{app.district}</td>
                        <td className="px-4 py-3 text-slate-600 text-sm">
                          {isCentralAdmin ? (app.requested_department || '-') : (app.department || '-')}
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-sm">{app.citizen}</td>
                        <td className="px-4 py-3 text-slate-500 text-sm">{app.created_at}</td>
                        <td className="px-4 py-3">
                          <span className={STATUS_BADGE[app.status] || 'badge badge-closed'}>
                            {t(lang, STATUS_LABEL_KEY[app.status] || 'statusClosed')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setStatusForm({ status: app.status === 'PENDING_ASSIGNMENT' ? 'RECEIVED' : '', remarks: '', response_document: null });
                              setAssignmentForm({ department_id: app.department_id || '', transfer_reason: app.transfer_reason || '' });
                            }}
                            className="text-sm font-semibold text-green-700 hover:underline"
                          >
                            {isCentralAdmin && app.status === 'PENDING_ASSIGNMENT'
                              ? `${t(lang, 'adminAssignAction')} →`
                              : `${t(lang, 'adminUpdateAction')} →`}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {pagination.total_pages > 1 && (
                <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50">
                  <button
                    disabled={pagination.current_page === 1}
                    onClick={() => loadApplications(pagination.current_page - 1)}
                    className="px-3 py-1 text-sm border rounded bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >&larr; {t(lang, 'back')}</button>
                  <span className="text-sm text-slate-500 font-medium">Page {pagination.current_page} of {pagination.total_pages}</span>
                  <button
                    disabled={pagination.current_page === pagination.total_pages}
                    onClick={() => loadApplications(pagination.current_page + 1)}
                    className="px-3 py-1 text-sm border rounded bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >Next &rarr;</button>
                </div>
              )}
            </div>
          )
        ) : appeals.length === 0 ? (
          <div className="gov-card p-12 text-center fade-in">
            <p className="text-slate-500 font-medium">{t(lang, 'adminNoAppeals')}</p>
          </div>
        ) : (
          <div className="gov-card overflow-hidden fade-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: '#166534' }} className="gov-thead">
                    <th>{t(lang, 'applicationNo')}</th>
                    <th>{t(lang, 'tableSubject')}</th>
                    <th>{t(lang, 'adminDepartmentLabel')}</th>
                    <th>{t(lang, 'appealReason')}</th>
                    <th>{t(lang, 'adminCitizen')}</th>
                    <th>{t(lang, 'tableDateFiled')}</th>
                    <th>{t(lang, 'tableStatus')}</th>
                    <th>{t(lang, 'uploadDisposalDocument')}</th>
                    <th>{t(lang, 'tableAction')}</th>
                  </tr>
                </thead>
                <tbody>
                  {appeals.map((appeal, idx) => (
                    <tr key={appeal.id} className={`border-b border-slate-100 hover:bg-green-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                      <td className="px-4 py-3 font-mono text-sm text-green-800 font-bold">{appeal.application_no}</td>
                      <td className="px-4 py-3 text-slate-700 text-sm max-w-[160px] truncate">{appeal.subject}</td>
                      <td className="px-4 py-3 text-slate-600 text-sm">{appeal.department || '-'}</td>
                      <td className="px-4 py-3 text-slate-600 text-sm max-w-[220px] truncate">{appeal.reason}</td>
                      <td className="px-4 py-3 text-slate-600 text-sm">{appeal.citizen}</td>
                      <td className="px-4 py-3 text-slate-500 text-sm">{appeal.filed_at}</td>
                      <td className="px-4 py-3">
                        <span className={APPEAL_BADGE[appeal.status] || 'badge badge-closed'}>
                          {t(lang, APPEAL_LABEL_KEY[appeal.status] || 'appealFiled')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {appeal.disposal_document ? (
                          <a href={appeal.disposal_document} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline font-semibold">
                            {t(lang, 'downloadDocument')}
                          </a>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setSelectedAppeal(appeal);
                            setAppealForm({
                              status: appeal.status === 'FILED' ? 'UNDER_REVIEW' : '',
                              disposal_remarks: appeal.disposal_remarks || '',
                              disposal_document: null,
                              department_id: appeal.department_id || '',
                              transfer_reason: '',
                            });
                          }}
                          className="text-sm font-semibold text-green-700 hover:underline"
                        >
                          {isCentralAdmin && appeal.status === 'FILED'
                            ? `${t(lang, 'adminAssignAction')} →`
                            : `${t(lang, 'adminUpdateAction')} →`}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pagination.total_pages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50">
                <button
                  disabled={pagination.current_page === 1}
                  onClick={() => loadAppeals(pagination.current_page - 1)}
                  className="px-3 py-1 text-sm border rounded bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >&larr; {t(lang, 'back')}</button>
                <span className="text-sm text-slate-500 font-medium">Page {pagination.current_page} of {pagination.total_pages}</span>
                <button
                  disabled={pagination.current_page === pagination.total_pages}
                  onClick={() => loadAppeals(pagination.current_page + 1)}
                  className="px-3 py-1 text-sm border rounded bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >Next &rarr;</button>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedApp && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={(e) => { if (e.target === e.currentTarget) setSelectedApp(null); }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-slate-200 fade-in max-h-[90vh] flex flex-col my-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-green-800 rounded-t-lg">
              <div>
                <h3 className="font-bold text-white text-base">{t(lang, 'adminModalTitle')}</h3>
                <p className="text-green-200 text-xs font-mono mt-0.5">{selectedApp.application_no}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-green-200 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              {isCentralAdmin && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div>
                      <p className="font-semibold text-slate-700">{t(lang, 'adminRequestedDepartment')}</p>
                      <p>{selectedApp.requested_department || '-'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">{t(lang, 'adminCurrentDepartment')}</p>
                      <p>{selectedApp.department || '-'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">{t(lang, 'adminAssignedBy')}</p>
                      <p>{selectedApp.assigned_by || '-'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">{t(lang, 'adminAssignedAt')}</p>
                      <p>{selectedApp.assigned_at || '-'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">{t(lang, 'adminTransferReason')}</p>
                      <p>{selectedApp.transfer_reason || '-'}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'adminDepartmentLabel')} <span className="text-red-500">*</span></label>
                    <select
                      value={assignmentForm.department_id}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, department_id: e.target.value })}
                      className="gov-input"
                    >
                      <option value="">{t(lang, 'adminChooseDepartment')}</option>
                      {departments.map((department) => (
                        <option key={department.id} value={department.id}>{department.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'adminTransferReason')}</label>
                    <textarea
                      rows="3"
                      placeholder={t(lang, 'adminTransferReasonPlaceholder')}
                      value={assignmentForm.transfer_reason}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, transfer_reason: e.target.value })}
                      className="gov-input resize-none"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'adminNewStatus')} <span className="text-red-500">*</span></label>
                <select value={statusForm.status} onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })} className="gov-input">
                  <option value="">{t(lang, 'adminSelectStatus')}</option>
                  {isCentralAdmin && <option value="PENDING_ASSIGNMENT">{t(lang, 'statusPendingAssignment')}</option>}
                  <option value="RECEIVED">{t(lang, 'statusReceived')}</option>
                  <option value="IN_PROGRESS">{t(lang, 'statusInProgress')}</option>
                  <option value="RESPONDED">{t(lang, 'statusResponded')}</option>
                  <option value="CLOSED">{t(lang, 'statusClosed')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'adminRemarks')}</label>
                <textarea
                  rows="4"
                  placeholder={t(lang, 'adminRemarksPlaceholder')}
                  value={statusForm.remarks}
                  onChange={(e) => setStatusForm({ ...statusForm, remarks: e.target.value })}
                  className="gov-input resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'uploadResponseDocument')}</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png,.doc,.docx"
                  onChange={(e) => setStatusForm({ ...statusForm, response_document: e.target.files[0] || null })}
                  className="gov-input"
                />
              </div>
              <div className="flex gap-3 pt-1">
                {isCentralAdmin && (
                  <button
                    onClick={() => handleAssignApplication(selectedApp.id)}
                    disabled={updating || !assignmentForm.department_id}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md font-semibold text-sm text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: '#14532d' }}
                  >
                    {updating ? t(lang, 'adminUpdating') : t(lang, 'adminAssignAction')}
                  </button>
                )}
                <button
                  onClick={() => handleUpdateApplication(selectedApp.id)}
                  disabled={updating || !statusForm.status}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md font-semibold text-sm text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: '#166534' }}
                >
                  {updating ? t(lang, 'adminUpdating') : t(lang, 'adminUpdateBtn')}
                </button>
                <button onClick={() => setSelectedApp(null)} className="btn-secondary">{t(lang, 'cancel')}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedAppeal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={(e) => { if (e.target === e.currentTarget) setSelectedAppeal(null); }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-slate-200 fade-in max-h-[90vh] flex flex-col my-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-green-800 rounded-t-lg">
              <div>
                <h3 className="font-bold text-white text-base">{t(lang, 'adminAppealModalTitle')}</h3>
                <p className="text-green-200 text-xs font-mono mt-0.5">{selectedAppeal.application_no}</p>
              </div>
              <button onClick={() => setSelectedAppeal(null)} className="text-green-200 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              {isCentralAdmin && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'adminDepartmentLabel')}</label>
                    <select
                      value={appealForm.department_id}
                      onChange={(e) => setAppealForm({ ...appealForm, department_id: e.target.value })}
                      className="gov-input"
                    >
                      <option value="">{t(lang, 'adminChooseDepartment')}</option>
                      {departments.map((department) => (
                        <option key={department.id} value={department.id}>{department.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'adminTransferReason')}</label>
                    <textarea
                      rows="3"
                      placeholder={t(lang, 'adminTransferReasonPlaceholder')}
                      value={appealForm.transfer_reason}
                      onChange={(e) => setAppealForm({ ...appealForm, transfer_reason: e.target.value })}
                      className="gov-input resize-none"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'adminNewStatus')} <span className="text-red-500">*</span></label>
                <select value={appealForm.status} onChange={(e) => setAppealForm({ ...appealForm, status: e.target.value })} className="gov-input">
                  <option value="">{t(lang, 'adminSelectStatus')}</option>
                  <option value="UNDER_REVIEW">{t(lang, 'appealUnderReview')}</option>
                  <option value="DISPOSED">{t(lang, 'appealDisposed')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'disposalRemarks')}</label>
                <textarea
                  rows="4"
                  value={appealForm.disposal_remarks}
                  placeholder={t(lang, 'adminAppealRemarksPlaceholder')}
                  onChange={(e) => setAppealForm({ ...appealForm, disposal_remarks: e.target.value })}
                  className="gov-input resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t(lang, 'uploadDisposalDocument')}</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png,.doc,.docx"
                  onChange={(e) => setAppealForm({ ...appealForm, disposal_document: e.target.files[0] || null })}
                  className="gov-input"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => handleUpdateAppeal(selectedAppeal.id)}
                  disabled={updating || !appealForm.status}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md font-semibold text-sm text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: '#166534' }}
                >
                  {updating ? t(lang, 'adminUpdating') : t(lang, 'adminAppealUpdateBtn')}
                </button>
                <button onClick={() => setSelectedAppeal(null)} className="btn-secondary">{t(lang, 'cancel')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
