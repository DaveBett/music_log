import TrendingAlbum from "./TrendingAlbum";

export default function TrendingSection() {

  const albums = [
    {
      title: "IGOR",
      artist: "Tyler, The Creator"
    },
    {
      title: "Saturation",
      artist: "Brockhampton"
    },
    {
      title: "brat",
      artist: "Charli xcx"
    }
  ];

  return (
    <section className="trending-section">
      <h2>Trending Albums</h2>
      <div className="trending-grid">
        {albums.map((album, index) => (
          <TrendingAlbum
            key={index}
            {...album}
          />
        ))}
      </div>
    </section>
  );
}