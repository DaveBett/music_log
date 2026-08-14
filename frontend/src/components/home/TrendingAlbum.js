export default function TrendingAlbum({
  title,
  artist,
}) {
  return (
    <div className="trending-card">
      <div className="album-cover">
        ♪
      </div>
      <h4>{title}</h4>
      <p>{artist}</p>
    </div>
  );
}