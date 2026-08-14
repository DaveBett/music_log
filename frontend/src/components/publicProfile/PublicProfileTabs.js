export default function PublicProfileTabs({ activeTab, setActiveTab }) {
  return (
    <div className="profile-tabs">
      <button
        className={activeTab === "log" ? "active" : ""}
        onClick={() => setActiveTab("log")}
      >
        Music Log
      </button>
      <button
        className={activeTab === "reviews" ? "active" : ""}
        onClick={() => setActiveTab("reviews")}
      >
        Reviews
      </button>
      <button
        className={activeTab === "stats" ? "active" : ""}
        onClick={() => setActiveTab("stats")}
      >
        Stats
      </button>
    </div>
  );
}