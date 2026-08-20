import { useEffect, useState, useCallback } from "react";

import HeroSection from "../components/home/HeroSection";
import FeedTabs from "../components/home/FeedTabs";
import ActivityFeed from "../components/home/ActivityFeed";
import TrendingSection from "../components/home/TrendingSection";
import Sidebar from "../components/home/Sidebar";
import AddEntry from "../components/AddEntry";

import { getFeed, create_entry, getTrending } from "../api/endpoints";

import "./HomePage.css";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("following");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingEntry, setEditingEntry] = useState(null);
  const [trending, setTrending] = useState({artists: [], albums: []})

  const loadFeed = useCallback(async () => {
    setLoading(true);
    setError("");
  
    try {
      const data = await getFeed(activeTab);
  
      setActivities(data);
    } catch (err) {
      console.error(err);
  
      setError("Unable to load the activity feed.");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  async function loadTrending() {
    try {
      const data = await getTrending();
      setTrending(data);
    } catch (err) {
      console.error("Unable to load trending data:", err);
    }
  }

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  useEffect(() => {
    loadTrending();
  }, []);

  async function addEntry(
    artist,
    title,
    year,
    musicbrainzId,
    musicbrainzUrl
  ) {
    const entry = await create_entry(
      artist,
      title,
      year,
      musicbrainzId,
      musicbrainzUrl
    );
    await loadFeed();
    await loadTrending();

    return entry;
  }

  return (
    <div className="home-page">
      <HeroSection />
      <section className="home-add-entry">
        <AddEntry
          addEntry={addEntry}
          editingEntry={editingEntry}
          setEditingEntry={setEditingEntry}
        />
      </section>

      <div className="home-content">
        <main>
          <FeedTabs
            activeTab={activeTab}
            onChange={setActiveTab}
          />
          <ActivityFeed
            activities={activities}
            loading={loading}
            error={error}
          />
        </main>
        <Sidebar artists={trending.artists}/>
      </div>
      <TrendingSection albums={trending.albums}/>
    </div>
  );
}