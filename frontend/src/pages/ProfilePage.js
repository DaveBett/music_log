import { useState, useEffect } from "react";
import { getProfile, deleteReview } from "../api/endpoints";
import { useNavigate } from "react-router-dom";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileTabs from "../components/profile/ProfileTabs";
import UserLogSection from "../components/profile/UserLogSection";
import UserReviewSection from "../components/profile/UserReviewSection";
import UserStatSection from "../components/profile/UserStatSection";

import "./ProfilePage.css";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("log");
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const data = await getProfile();
    setProfile(data);
  }
  const handleEditReview = (review) => {
    navigate(`/reviews/${review.id}/edit`);
  };
  
  const handleDeleteReview = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );
  
    if (!confirmed) {
      return;
    }
  
    try {
      await deleteReview(id);
  
      await loadProfile();
    } catch (err) {
      console.error("Unable to delete review:", err);
    }
  };

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-page">

      <ProfileHeader
        user={profile.user}
        stats={profile.stats}
        isOwnProfile
      />

      <ProfileTabs
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "log" && (
        <UserLogSection
          entries={profile.entries}
        />
      )}

      {activeTab === "reviews" && (
        <UserReviewSection
          isOwnProfile={true}
          editable={true}
          onEdit={handleEditReview}
          onDelete={handleDeleteReview}
        />
      )}

      {activeTab === "stats" && (
        <UserStatSection
          stats={profile.stats}
        />
      )}

    </div>
  );
}