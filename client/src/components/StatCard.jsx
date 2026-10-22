export default function StatCard({ label, value, subtext }) {
  return (
    <article className="stat-card">
      <p>{label}</p>
      <h3>{value}</h3>
      <span>{subtext}</span>
    </article>
  );
}

