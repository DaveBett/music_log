export default function Sidebar({ artists }) {
  return (
    <aside className="home-sidebar">
      <section>
        <h3>Trending Artists</h3>

        {artists.length === 0 ? (
          <p>No trending artists yet.</p>
        ) : (
          <ol>
            {artists.map((artist) => (
              <li key={artist.artist}>
                <span>{artist.artist}</span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </aside>
  );
}