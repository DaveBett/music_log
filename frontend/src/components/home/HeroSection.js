import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function HeroSection() {
  const { user } = useAuth();
  return (
    <section className="hero-section">
      <div>
        <h1>
          Welcome back,
          <span> {user?.username}</span>
        </h1>
        <p>
          Discover what the Musicloggr community is listening to today.
        </p>
      </div>
      <Link
        className="hero-button"
        to="/profile"
      >
        My Profile
      </Link>

    </section>
  );
}