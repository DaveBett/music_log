import { getAlbumCoverUrl } from "../../api/endpoints";

export default function TrendingAlbum({
  title,
  artist,
  musicbrainzId,
  logs
}) {

  const coverUrl = getAlbumCoverUrl(musicbrainzId);

  return (
    <div className="trending-card">
      <div className="album-cover">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={`${title} by ${artist}`}
          />
        ) : (
          <span>♪</span>
        )}
      </div>
      <h4>{title}</h4>
      <p>{artist}</p>

      <small>
        {logs} {logs === 1 ? "log" : "logs"}
      </small>
    </div>
  );
}