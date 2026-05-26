function AssistantCard({ title, description }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0F6C73] text-[10px] font-bold text-white">
          •
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function SmartAssistantPanel() {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F6C73] text-sm font-bold text-white">
          ✦
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Smart Assistant</h2>
      </div>

      <div className="mt-5 space-y-4">
        <AssistantCard
          title="Tip: Be Specific"
          description="Include relevant dates, locations, and specific document types if known to expedite the processing."
        />
        <AssistantCard
          title="Legal Scope"
          description="Ensure your request pertains to public records. Personal information of third parties may be redacted."
        />
      </div>
    </aside>
  );
}
