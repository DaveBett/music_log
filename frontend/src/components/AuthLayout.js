import "./Auth.css";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <section className="auth-left">
        <div className="brand">
          <h1>Music Log</h1>
          <p className="subtitle">
            Your personal music journal.
          </p>
        </div>

        <div className="hero-text">
          <h2>Track every album that shapes your taste.</h2>
          <p>
            Build your listening history, keep your collection organized,
            and discover people with similar musical tastes.
          </p>
        </div>

        <div className="feature-list">
          <div className="feature-card">Track albums</div>
          <div className="feature-card">Build your music diary</div>
          <div className="feature-card">Edit your collection</div>
          <div className="feature-card">Discover other users</div>
        </div>
      </section>

      <section className="auth-right">
        {children}
      </section>
    </div>
  );
}