import ActivityCard from "./ActivityCard";

export default function FeedSection({ activities }) {
  return (
    <section className="home-section">
      <h2>Recent Activity</h2>
      {activities.length === 0 ? (
        <p>No recent activity.</p>
      ) : (
        activities.map(activity => (
          <ActivityCard
            key={activity.id}
            activity={activity}
          />
        ))
      )}
    </section>
  );
}