import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getPublicProfile, followUser, unfollowUser } from "../api/endpoints";

import PublicProfileHeader from "../components/publicProfile/PublicProfileHeader";
import PublicProfileTabs from "../components/publicProfile/PublicProfileTabs";
import PublicLogSection from "../components/publicProfile/PublicLogSection";

import UserReviewSection from "../components/profile/UserReviewSection";
import UserStatsSection from "../components/profile/UserStatSection";

import TopButton from "../components/TopButton";

import "./ProfilePage.css";

export default function PublicProfilePage() {
  const { username } = useParams();

  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("log");
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getPublicProfile(username);
  
        setProfile(data);
        setFollowing(data.following);
      } catch (err) {
        console.error("Unable to load public profile:", err);
      }
    }
    loadProfile();
  }, [username]);


  const handleFollow = async () => {
    try {
      if (following) {
        await unfollowUser(profile.user.id);
        setFollowing(false);
      } else {
        await followUser(profile.user.id);
        setFollowing(true);
      }
    } catch (err) {
      console.error(
        "Unable to update follow status:",
        err.response?.data
      );
    }
  };

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-page">

      <PublicProfileHeader
        user={profile.user}
        stats={profile.stats}
        following={following}
        onFollow={handleFollow}
      />

      <PublicProfileTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === "log" && (
        <PublicLogSection
          entries={profile.entries}
          editable={false}
        />
      )}

      {activeTab === "reviews" && (
        <UserReviewSection
          username={username}
          editable={false}
        />
      )}

      {activeTab === "stats" && (
        <UserStatsSection
          stats={profile.stats}
        />
      )}
      <TopButton />
    </div>
  );
}