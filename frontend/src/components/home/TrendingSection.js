import TrendingAlbum from "./TrendingAlbum";

export default function TrendingSection({ albums }) {
  return (
    <section className="trending-section">
      <h2>Trending Albums</h2>

      <div className="trending-grid">
        {albums.length === 0 ? (
          <p>No trending albums yet.</p>
        ) : (
          albums.map((album) => (
            <TrendingAlbum
              key={`${album.artist}-${album.title}`}
              title={album.title}
              artist={album.artist}
              musicbrainzId={album.musicbrainz_id}
              logs={album.logs}
            />
          ))
        )}
      </div>
    </section>
  );
}