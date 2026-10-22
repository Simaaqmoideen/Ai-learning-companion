export default function ProgressBar({ value }) {
  return (
    <div className="progress-bar">
      <div className="progress-bar-fill" style={{ width: `${value}%` }} />
      <span>{value}% complete</span>
    </div>
  );
}

