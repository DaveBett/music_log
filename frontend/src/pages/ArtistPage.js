import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getArtistReviews, getAlbumCoverUrl } from "../api/endpoints";
import ReviewsBrowser from "../components/reviews/ReviewsBrowser";

export default function ArtistPage() {
  const { artistName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [trendingAlbum, setTrendingAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getArtistReviews(artistName);
        setReviews(data.reviews);
        setStats(data.stats);
        setTrendingAlbum(data.trending_album);
      } catch (err) {
        console.error(err);
        setError("Unable to load reviews for this artist.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [artistName]);

  function handleGoBack() {
    navigate(location.state?.from || "/");
  }

  const trendingCoverUrl = trendingAlbum
    ? getAlbumCoverUrl(trendingAlbum.musicbrainz_id)
    : null;

  return (
    <div className="artist-page">
      <button className="go-back-button" onClick={handleGoBack}>
        &lt; Go back
      </button>
      <h1>{artistName}</h1>

      {stats && (
        <div className="entity-stats">
          <div className="entity-stat">
            <strong>{stats.total_logs}</strong>
            <span>Total Logs</span>
          </div>
          <div className="entity-stat">
            <strong>{stats.recent_logs}</strong>
            <span>Recent Logs</span>
          </div>
        </div>
      )}

      {trendingAlbum && (
        <Link
          to={`/album/${trendingAlbum.musicbrainz_id}`}
          state={{ from: `/artist/${encodeURIComponent(artistName)}` }}
          className="trending-reason"
        >
          {trendingCoverUrl && (
            <img
              src={trendingCoverUrl}
              alt={trendingAlbum.title}
              className="trending-reason-cover"
            />
          )}
          <div className="trending-reason-info">
            <span className="trending-reason-label">Trending album: </span>
            <strong>{trendingAlbum.title}</strong>
          </div>
        </Link>
      )}

      <ReviewsBrowser
        reviews={reviews}
        loading={loading}
        error={error}
        showAuthor
        pageSize={12}
        backTo={`/artist/${encodeURIComponent(artistName)}`}
        emptyMessage="No reviews yet for this artist."
      />
    </div>
  );
}