import ActivityCard from "./ActivityCard";

export default function ActivityFeed({
  activities,
  loading,
  error,
}) {
  if (loading) {
    return (
      <section className="activity-feed">
        <p>Loading activity...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="activity-feed">
        <p>{error}</p>
      </section>
    );
  }

  if (activities.length === 0) {
    return (
      <section className="activity-feed">
        <p>No activity to show yet.</p>
      </section>
    );
  }

  return (
    <section className="activity-feed">
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
        />
      ))}
    </section>
  );
}