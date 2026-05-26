import { useEffect, useState } from 'react';
import API from '../api/axios';
import DrillDownTable from './DrillDownTable';

function HodCard({ selectedDepartment, hodState }) {
  if (!selectedDepartment) {
    return null;
  }

  if (hodState.loading) {
    return (
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-[#0F6C73]" />
          <p className="text-sm font-medium text-slate-600">Loading HOD details...</p>
        </div>
      </section>
    );
  }

  if (hodState.error) {
    return (
      <section className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
        <p className="text-sm font-medium text-rose-700">{hodState.error}</p>
      </section>
    );
  }

  if (!hodState.data || hodState.isOnboarded === false) {
    return (
      <section className="mb-6 rounded-2xl border border-slate-200 bg-[#f7fafb] p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">HOD Details</p>
        <h2 className="mt-2 text-xl font-bold text-slate-900">{selectedDepartment.name}</h2>
        <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-5 text-sm text-slate-500">
          HOD data has not been onboarded for this department yet.
        </div>
      </section>
    );
  }

  const hod = hodState.data;

  return (
    <section className="mb-6 rounded-2xl border border-[#bce7df] bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">HOD Details</p>
      <div className="mt-3 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <h2 className="text-2xl font-bold text-[#0077cc]">{hod.hodName}</h2>
          <p className="mt-2 text-sm font-semibold text-slate-700">{hod.designation}</p>
          <div className="mt-4 space-y-1 text-sm leading-7 text-slate-600">
            <p>{hod.addressLine1}</p>
            {hod.addressLine2 ? <p>{hod.addressLine2}</p> : null}
            <p>
              {hod.city}, {hod.district} - {hod.pincode}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-xl border border-slate-200 bg-[#f8fbfc] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Department</p>
            <p className="mt-2 text-sm font-semibold text-slate-800">{hod.departmentName}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-[#f8fbfc] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Onboarding Status</p>
            <p className="mt-2 text-sm font-semibold text-emerald-700">Onboarded</p>
          </div>
          {hod.phone ? (
            <div className="rounded-xl border border-slate-200 bg-[#f8fbfc] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Phone</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">{hod.phone}</p>
            </div>
          ) : null}
          {hod.email ? (
            <div className="rounded-xl border border-slate-200 bg-[#f8fbfc] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Email</p>
              <p className="mt-2 break-all text-sm font-semibold text-slate-800">{hod.email}</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default function PublicAuthority() {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [hodState, setHodState] = useState({
    loading: false,
    error: '',
    data: null,
    isOnboarded: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchHod() {
      if (!selectedDepartment?.id) {
        setHodState({
          loading: false,
          error: '',
          data: null,
          isOnboarded: null,
        });
        return;
      }

      setHodState({
        loading: true,
        error: '',
        data: null,
        isOnboarded: null,
      });

      try {
        const response = await API.get(`/hod/${selectedDepartment.id}`);

        if (!isMounted) return;

        setHodState({
          loading: false,
          error: '',
          data: response.data?.data || null,
          isOnboarded: response.data?.isOnboarded ?? false,
        });
      } catch (error) {
        if (!isMounted) return;

        if (error?.response?.status === 404) {
          setHodState({
            loading: false,
            error: '',
            data: null,
            isOnboarded: false,
          });
          return;
        }

        setHodState({
          loading: false,
          error: 'We could not load HOD details right now.',
          data: null,
          isOnboarded: null,
        });
      }
    }

    fetchHod();
    return () => {
      isMounted = false;
    };
  }, [selectedDepartment]);

  return (
    <DrillDownTable
      onDepartmentSelect={setSelectedDepartment}
      headerContent={<HodCard selectedDepartment={selectedDepartment} hodState={hodState} />}
    />
  );
}
