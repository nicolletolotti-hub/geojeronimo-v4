export default function TopbarWidget({
  title,
  value,
  color = '#ffffff',
  meta,
}) {
  return (
    <div className="geo-topbar__widget">
      <div className="geo-topbar__widget-title">{title}</div>
      <div
        className="geo-topbar__widget-value"
        style={{ color }}
      >
        {value}
      </div>
      {meta && (
        <div className="geo-topbar__widget-meta">{meta}</div>
      )}
    </div>
  )
}
