import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import Layout from "../Components/Layout";
import Hero from "../Components/Hero";
import StoryTimeline from "../Components/StoryTimeline";
import GallerySection from "../Components/GallerySection";
import InteractiveEarth from "../Components/InteractiveEarth";
import InteractiveMars from "../Components/InteractiveMars";
import FavoritesSection from "../Components/FavoritesSection";
import FeedbackSection from "../Components/FeedbackSection";
import CallToAction from "../Components/CallToAction";
import StickySpacecraft from "../Components/StickySpacecraft";

export default function Home({ auth }) {
  const [apodData, setApodData] = useState([]);
  const [marsPhotos, setMarsPhotos] = useState([]);
  const [epicImages, setEpicImages] = useState([]);
  const [loading, setLoading] = useState(true);
  // store full favorite records and derived ids
  const [favoritesFull, setFavoritesFull] = useState([]);
  const favoriteIds = favoritesFull.map((f) => f.item_id);
  const [favoritesRefresh, setFavoritesRefresh] = useState(0);

  useEffect(() => {
    fetchNasaData();
    // Fetch favorites whenever component mounts or user changes
    if (auth?.user) {
      fetchFavorites();
    }
  }, [auth?.user?.id]);

  const fetchFavorites = async () => {
    try {
      const res = await axios.get("/favorites");
      // store full favorite objects
      setFavoritesFull(res.data);
    } catch (e) {
      console.error("Error loading favorites:", e);
    }
  };

  // Function to trigger favorites section refresh
  const refreshFavorites = () => {
    setFavoritesRefresh((prev) => prev + 1);
  };

  const fetchNasaData = async () => {
    try {
      setLoading(true);

      // Fetch all NASA data in parallel
      console.log("Fetching NASA data...");
      const [apodResponse, marsResponse, epicResponse] = await Promise.all([
        axios.get("/api/nasa/apod?count=6"),
        axios.get("/api/nasa/mars-photos?sol=1000"),
        axios.get("/api/nasa/epic"),
      ]);

      console.log("APOD Response:", apodResponse.data);
      console.log("Mars Response:", marsResponse.data);
      console.log("EPIC Response:", epicResponse.data);

      setApodData(apodResponse.data);
      setMarsPhotos(marsResponse.data);
      setEpicImages(epicResponse.data);
    } catch (error) {
      console.error("Error fetching NASA data:", error);
      console.error("Error details:", error.response?.data || error.message);

      // Show user-friendly error message
      alert(
        "Unable to connect to NASA API. Please check your internet connection or try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head title="Beyond Earth - Journey Through Space" />

      {/* 3D Sticky Spacecraft */}
      <StickySpacecraft />

      {/* Hero Section - First Impression */}
      <Hero />

      {/* Story Timeline - Narrative Journey */}
      <StoryTimeline apodData={apodData} loading={loading} />

      {/* Gallery Section - Visual Showcase */}
      <GallerySection
        apodData={apodData}
        loading={loading}
        onFavoriteAdded={refreshFavorites}
        favoriteIds={favoriteIds}
        onAddFavorite={(fav) => setFavoritesFull((prev) => [fav, ...prev])}
      />

      {/* Interactive Earth - 3D Experience */}
      <InteractiveEarth epicImages={epicImages} loading={loading} />

      {/* Interactive Mars - 3D Red Planet */}
      <InteractiveMars />

      {/* Favorites Section - User Engagement */}
      <FavoritesSection
        refreshTrigger={favoritesRefresh}
        favoritesFull={favoritesFull}
        setFavoritesFull={setFavoritesFull}
      />

      {/* Feedback Section - Community Voice */}
      <FeedbackSection />

      {/* Call to Action - Final Push */}
      <CallToAction />
    </Layout>
  );
}
