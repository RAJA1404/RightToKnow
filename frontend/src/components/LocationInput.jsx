export default function LocationInput({ value, onChange, suggestions = [] }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-800">
        <span className="text-red-600">*</span> Location (District / Area)
      </label>
      <input
        list="location-suggestions"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Enter district or area (e.g., Chennai, Madurai)"
        className="w-full rounded border border-[#d6dce5] bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[#f4b000] focus:ring-2 focus:ring-[#f4b000]/20"
      />
      <datalist id="location-suggestions">
        {suggestions.map((suggestion) => (
          <option key={suggestion} value={suggestion} />
        ))}
      </datalist>
    </div>
  );
}
