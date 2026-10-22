export default function InsightCard({ label, value, detail }) {
  return (
    <article className="insight-card">
      <span>{label}</span>
      <h3>{value}</h3>
      <p>{detail}</p>
    </article>
  );
}
