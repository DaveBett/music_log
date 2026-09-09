import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getAlbumReviews, getAlbumCoverUrl } from "../api/endpoints";
import ReviewsBrowser from "../components/reviews/ReviewsBrowser";

export default function AlbumPage() {
  const { musicbrainzId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [stats, setStats] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getAlbumReviews(musicbrainzId);
        setAlbum(data.album);
        setStats(data.stats);
        setReviews(data.reviews);
      } catch (err) {
        console.error(err);
        setError("Unable to load reviews for this album.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [musicbrainzId]);

  const coverUrl = getAlbumCoverUrl(musicbrainzId);


  function handleGoBack() {
    navigate(location.state?.from || "/");
  }

  return (
    <div className="album-page">
      <button className="go-back-button" onClick={handleGoBack}>
        &lt; Go back
      </button>
      <div className="review-album-header">
        {coverUrl && (
          <img className="review-cover-large" src={coverUrl} alt={album?.title} />
        )}
        <div>
          <h1>{album?.title}</h1>
          <h3>
            {album?.artist}
            {album?.year ? ` · ${album.year}` : ""}
          </h3>
        </div>
      </div>

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

      <ReviewsBrowser
        reviews={reviews}
        loading={loading}
        error={error}
        showAuthor
        pageSize={12}
        backTo={`/album/${musicbrainzId}`}
        emptyMessage="No reviews yet for this album."
      />
    </div>
  );
}