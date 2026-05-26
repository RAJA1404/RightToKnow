import { useEffect, useMemo, useState } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import HierarchyTable from '../components/HierarchyTable';
import { useLanguage } from '../context/LanguageContext';
import { translate as t } from '../i18n/portalText';

const PAGE_SIZE = 10;

const defaultViewState = () => ({
  searchTerm: '',
  sortKey: 'name',
  sortDirection: 'asc',
  page: 1,
  scrollY: 0,
});

function NameCell({ name, address, onClick, clickable = true }) {
  const addressLines = String(address || '')
    .split(/\n|,/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <div className="max-w-2xl">
      {clickable ? (
        <button type="button" onClick={onClick} className="text-left text-[15px] font-semibold text-[#0077cc] hover:underline">
          {name}
        </button>
      ) : (
        <span className="text-[15px] font-semibold text-[#0077cc]">{name}</span>
      )}
      {addressLines.length ? (
        <div className="mt-2 space-y-0.5 text-[13px] leading-6 text-slate-700">
          {addressLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ActionLink({ children, onClick, disabled = false }) {
  if (disabled) {
    return <span className="text-sm text-slate-400">{children}</span>;
  }

  return (
    <button type="button" onClick={onClick} className="text-sm font-medium text-[#0F6C73] hover:underline">
      {children}
    </button>
  );
}

function normalizeResponse(response) {
  const rawData = response.data?.data || response.data || [];

  if (Array.isArray(rawData) && rawData.length > 0 && rawData[0].departmentName) {
    return {
      data: rawData.map((item) => ({
        id: item._id || item.id,
        name: item.departmentName,
        address: '',
        hasSubOffices: Array.isArray(item.publicAuthorities) && item.publicAuthorities.length > 0,
      })),
      total: rawData.length,
    };
  }

  if (Array.isArray(rawData) && rawData.length > 0 && rawData[0].category !== undefined) {
    return {
      data: rawData.map((item) => ({
        id: item._id || item.id,
        name: item.name,
        address: item.category ? `Category, ${item.category}` : '',
        hasSubOffices: Boolean(item.hasSubOffices),
      })),
      total: response.data?.total ?? rawData.length,
    };
  }

  return {
    data: rawData,
    total: response.data?.total ?? rawData.length,
  };
}

export default function DrillDownTable({ onDepartmentSelect = () => {}, headerContent = null }) {
  const { lang } = useLanguage();
  const [level, setLevel] = useState(1);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedHod, setSelectedHod] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewState, setViewState] = useState({
    1: defaultViewState(),
    2: defaultViewState(),
    3: defaultViewState(),
  });

  const currentView = viewState[level];
  const selectedDeptId = selectedDept?.id;
  const selectedHodId = selectedHod?.id;

  const updateLevelView = (targetLevel, updates) => {
    setViewState((prev) => ({
      ...prev,
      [targetLevel]: {
        ...prev[targetLevel],
        ...updates,
      },
    }));
  };

  const captureScroll = (targetLevel = level) => {
    updateLevelView(targetLevel, { scrollY: window.scrollY });
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setLoading(true);
      setError('');

      try {
        let response;

        if (level === 1) {
          response = await API.get('/departments');
        } else if (level === 2 && selectedDeptId) {
          response = await API.get(`/departments/${selectedDeptId}/hods`);
        } else if (level === 3 && selectedHodId) {
          response = await API.get(`/hods/${selectedHodId}/suboffices`);
        } else {
          response = { data: { data: [], total: 0 } };
        }

        if (!isMounted) return;
        const normalized = normalizeResponse(response);
        setData(normalized.data);
      } catch (_error) {
        if (!isMounted) return;
        setError(lang === 'ta' ? 'தரவை இப்போது ஏற்ற முடியவில்லை.' : 'We could not load the drill-down data right now.');
        setData([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [level, selectedDeptId, selectedHodId, lang]);

  useEffect(() => {
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: viewState[level].scrollY || 0, behavior: 'smooth' });
    });
  }, [level, viewState]);

  const filteredData = useMemo(() => {
    const search = currentView.searchTerm.trim().toLowerCase();
    if (!search) return data;

    return data.filter((item) => {
      const nameMatch = item.name?.toLowerCase().includes(search);
      const addressMatch = item.address?.toLowerCase().includes(search);
      return nameMatch || addressMatch;
    });
  }, [currentView.searchTerm, data]);

  const sortedData = useMemo(() => {
    const list = [...filteredData];
    const { sortKey, sortDirection } = currentView;

    list.sort((a, b) => {
      const left = String(a[sortKey] || '').toLowerCase();
      const right = String(b[sortKey] || '').toLowerCase();
      const compare = left.localeCompare(right);
      return sortDirection === 'asc' ? compare : -compare;
    });

    return list;
  }, [currentView, filteredData]);

  const paginatedRows = useMemo(() => {
    const startIndex = (currentView.page - 1) * PAGE_SIZE;
    return sortedData.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentView.page, sortedData]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(sortedData.length / PAGE_SIZE));
    if (currentView.page > totalPages) {
      updateLevelView(level, { page: totalPages });
    }
  }, [currentView.page, level, sortedData.length]);

  const handleSort = (key) => {
    updateLevelView(level, {
      sortKey: key,
      sortDirection: currentView.sortKey === key && currentView.sortDirection === 'asc' ? 'desc' : 'asc',
      page: 1,
    });
  };

  const navigateToLevel = (nextLevel, options = {}) => {
    captureScroll(level);
    setLevel(nextLevel);
    if (options.dept !== undefined) setSelectedDept(options.dept);
    if (options.hod !== undefined) setSelectedHod(options.hod);
  };

  const breadcrumb = useMemo(() => {
    const items = [lang === 'ta' ? 'செயலகத் துறைகள்' : 'Secretariat Departments'];
    if (selectedDept?.name) items.push(selectedDept.name);
    if (selectedHod?.name) items.push(selectedHod.name);
    return items.join(' / ');
  }, [lang, selectedDept, selectedHod]);

  const title =
    level === 1
      ? lang === 'ta'
        ? 'Onboarded Secretariat Departments'
        : 'Onboarded Secretariat Departments'
      : level === 2
        ? lang === 'ta'
          ? `Onboarded HODs for ${selectedDept?.name || ''}`
          : `Onboarded HODs for ${selectedDept?.name || ''}`
        : lang === 'ta'
          ? `Onboarded Sub Offices for ${selectedHod?.name || ''}`
          : `Onboarded Sub Offices for ${selectedHod?.name || ''}`;

  const columns =
    level === 1
      ? [
          {
            key: 'serial',
            label: 'Sl.No',
            className: 'w-24 px-4 py-3',
            render: (_row, index) => (currentView.page - 1) * PAGE_SIZE + index + 1,
          },
          {
            key: 'name',
            label: 'Department Name',
            sortable: true,
            render: (row) => <NameCell name={row.name} address={row.address} clickable={false} />,
          },
          {
            key: 'action',
            label: 'Action',
            className: 'w-64 px-4 py-3',
            render: (row) => (
              <ActionLink
                onClick={() => {
                  const dept = { id: row.id, name: row.name };
                  onDepartmentSelect(dept);
                  navigateToLevel(2, { dept, hod: null });
                }}
              >
                Click Here to view Onboarded HOD&apos;s
              </ActionLink>
            ),
          },
        ]
      : level === 2
        ? [
            {
              key: 'serial',
              label: 'Sl.No',
              className: 'w-24 px-4 py-3',
              render: (_row, index) => (currentView.page - 1) * PAGE_SIZE + index + 1,
            },
            {
              key: 'name',
              label: 'Department Name',
              sortable: true,
              render: (row) => <NameCell name={row.name} address={row.address} clickable={false} />,
            },
            {
              key: 'action',
              label: 'Action',
              className: 'w-64 px-4 py-3',
              render: (row) => (
                <ActionLink onClick={() => navigateToLevel(3, { hod: { id: row.id, name: row.name } })} disabled={!row.hasSubOffices}>
                  {row.hasSubOffices ? 'Click Here to view Onboarded Sub Offices' : 'No Suboffices Currently Onboarded'}
                </ActionLink>
              ),
            },
          ]
        : [
            {
              key: 'serial',
              label: 'Sl.No',
              className: 'w-24 px-4 py-3',
              render: (_row, index) => (currentView.page - 1) * PAGE_SIZE + index + 1,
            },
            {
              key: 'name',
              label: 'Department Name',
              sortable: true,
              render: (row) => <NameCell name={row.name} address={row.address} clickable={false} />,
            },
            {
              key: 'action',
              label: 'Action',
              className: 'w-64 px-4 py-3',
              render: (row) => (
                <ActionLink onClick={() => {}} disabled={!row.hasSubOffices}>
                  {row.hasSubOffices ? 'Click Here to view Onboarded Sub Offices' : 'No Suboffices Currently Onboarded'}
                </ActionLink>
              ),
            },
          ];

  const backButton =
    level === 1 ? null : (
      <button
        type="button"
        onClick={() => {
          if (level === 2) {
            onDepartmentSelect(null);
            navigateToLevel(1, { dept: null, hod: null });
          } else {
            navigateToLevel(2, { hod: null });
          }
        }}
        className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        {lang === 'ta' ? 'பின்செல்' : 'Back'}
      </button>
    );

  const emptyMessage =
    level === 2
      ? lang === 'ta'
        ? 'இந்த துறைக்கான HOD தரவு இன்னும் onboard செய்யப்படவில்லை.'
        : 'HOD data has not been onboarded for this department yet.'
      : level === 3
        ? lang === 'ta'
          ? 'இந்த HOD-க்கு துணை அலுவலகத் தரவு இன்னும் onboard செய்யப்படவில்லை.'
          : 'Sub office data has not been onboarded for this HOD yet.'
        : lang === 'ta'
          ? 'பதிவுகள் கிடைக்கவில்லை.'
          : 'No records found.';

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f7f8]">
      <Navbar />

      <main className="flex-1 bg-[linear-gradient(180deg,_#f7fbfc_0%,_#eef7f7_100%)] py-8">
        <div className="mx-auto max-w-7xl px-5">
          {error ? <div className="alert-error mb-4">{error}</div> : null}
          {headerContent}

          <HierarchyTable
            title={title}
            columns={columns}
            rows={paginatedRows}
            searchTerm={currentView.searchTerm}
            onSearchChange={(value) => updateLevelView(level, { searchTerm: value, page: 1 })}
            sortKey={currentView.sortKey}
            sortDirection={currentView.sortDirection}
            onSort={handleSort}
            page={currentView.page}
            onPageChange={(nextPage) => updateLevelView(level, { page: nextPage })}
            totalRows={sortedData.length}
            pageSize={PAGE_SIZE}
            backButton={backButton}
            breadcrumb={breadcrumb}
            loading={loading}
            emptyMessage={emptyMessage}
          />
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
