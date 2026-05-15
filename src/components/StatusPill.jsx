export default function StatusPill({ status }) {
  const tone = status.toLowerCase();
  return <span className={`status-pill status-pill--${tone}`}>{status}</span>;
}
