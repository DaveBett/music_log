import "./Card.css";

export default function Card({
  title,
  subtitle,
  children,
  footer,
  className = ""
}) {
  return (
    <section className={`card ${className}`}>
      {(title || subtitle) && (
        <header className="card-header">
          {title && <h2>{title}</h2>}
          {subtitle && <p>{subtitle}</p>}
        </header>
      )}

      <div className="card-body">
        {children}
      </div>

      {footer && (
        <footer className="card-footer">
          {footer}
        </footer>
      )}
    </section>
  );
}