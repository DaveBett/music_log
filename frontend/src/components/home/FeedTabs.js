export default function FeedTabs({ activeTab, onChange }) {
  return (
    <div className="feed-tabs">
      <button
        className={activeTab === "following" ? "active" : ""}
        onClick={() => onChange("following")}
      >
        Following
      </button>

      <button
        className={activeTab === "popular" ? "active" : ""}
        onClick={() => onChange("popular")}
      >
        Popular
      </button>

      <button
        className={activeTab === "recent" ? "active" : ""}
        onClick={() => onChange("recent")}
      >
        Recent
      </button>

      <button
        className={activeTab === "global" ? "active" : ""}
        onClick={() => onChange("global")}
      >
        Global
      </button>

    </div>
  );
}