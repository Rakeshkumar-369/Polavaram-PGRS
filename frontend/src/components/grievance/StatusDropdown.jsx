export default function StatusDropdown({ value, onChange, disabled }) {
  const statuses = ["Registered", "In Progress", "Redressed", "Reopened"];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="border px-3 py-2 rounded ml-2"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}