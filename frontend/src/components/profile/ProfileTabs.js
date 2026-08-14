export default function ProfileTabs({ activeTab, onChange }) {
  return (
    <div className="profile-tabs">
      <button className={activeTab === "log" ? "active" : ""} onClick={() => onChange("log")}>
        Music Log
      </button>

      <button className={activeTab === "reviews" ? "active" : ""} onClick={() => onChange("reviews")}>
        Reviews
      </button>

      <button className={activeTab === "stats" ? "active" : ""} onClick={() => onChange("stats")}>
        Stats
      </button>
    </div>
  );
}