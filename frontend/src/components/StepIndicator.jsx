const STEPS = [
  { id: 1, label: 'Describe Request' },
  { id: 2, label: 'Processing' },
  { id: 3, label: 'Review Draft' },
  { id: 4, label: 'Submit' },
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
      {STEPS.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;

        return (
          <div key={step.id} className="flex min-w-[120px] items-center gap-3">
            <div className="flex flex-col items-center text-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                  isActive || isCompleted
                    ? 'bg-[#0F6C73] text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {step.id}
              </div>
              <span
                className={`mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                  isActive ? 'text-[#0F6C73]' : 'text-slate-500'
                }`}
              >
                {step.label}
              </span>
            </div>

            {index < STEPS.length - 1 && <div className="h-px flex-1 bg-slate-200" />}
          </div>
        );
      })}
    </div>
  );
}
