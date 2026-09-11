import { useEffect, useState } from "react";
import ActivityCard from "./ActivityCard";

const INITIAL_COUNT = 10;
const STEP = 10;
const MAX_COUNT = 30;

export default function ActivityFeed({
  activities,
  loading,
  error,
}) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [activities]);

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

  const maxAvailable = Math.min(activities.length, MAX_COUNT);
  const visibleActivities = activities.slice(0, visibleCount);

  const canShowMore = visibleCount < maxAvailable;
  const canShowLess = visibleCount > INITIAL_COUNT;

  function handleShowMore() {
    setVisibleCount((current) => Math.min(current + STEP, maxAvailable));
  }

  function handleShowLess() {
    setVisibleCount((current) => Math.max(current - STEP, INITIAL_COUNT));
  }

  return (
    <section className="activity-feed">
      {visibleActivities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
        />
      ))}

      {(canShowMore || canShowLess) && (
        <div className="activity-feed-controls">
          {canShowMore && (
            <button className="activity-feed-button" onClick={handleShowMore}>
              Show more
            </button>
          )}

          {canShowLess && (
            <button className="activity-feed-button activity-feed-button-secondary" onClick={handleShowLess}>
              Show less
            </button>
          )}
        </div>
      )}
    </section>
  );
}