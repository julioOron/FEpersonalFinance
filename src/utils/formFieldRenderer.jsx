export function renderFormField({ key, config, value, onChange, options }) {
  const handleChange = (e) => onChange(key, e.target.value);

  if (config?.type === "select") {
    return (
      <div key={key} className="flex flex-col">
        <label className="text-sm font-medium mb-1">{config.label}</label>
        <select value={value} onChange={handleChange} className="p-2 border rounded">
          <option value="">Select...</option>
          {options?.[config.optionsSource]?.map((opt) => (
            <option key={opt.bat_ID} value={opt.bat_ID}>
              {opt.bat_Bank} - {opt.bat_Number}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (config?.type === "date") {
    return (
      <div key={key} className="flex flex-col">
        <label className="text-sm font-medium mb-1">{config.label}</label>
        <input
          type="date"
          value={value}
          onChange={handleChange}
          className="p-2 border rounded"
        />
      </div>
    );
  }

  return (
    <div key={key} className="flex flex-col">
      <label className="text-sm font-medium mb-1">{config.label}</label>
      <input
        value={value}
        onChange={handleChange}
        className="p-2 border rounded"
      />
    </div>
  );
}
