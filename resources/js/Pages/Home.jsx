import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import Layout from "../Components/Layout";
import Hero from "../Components/Hero";
import StoryTimeline from "../Components/StoryTimeline";
import GallerySection from "../Components/GallerySection";
import MarsJourney from "../Components/MarsJourney";
import InteractiveEarth from "../Components/InteractiveEarth";
import FavoritesSection from "../Components/FavoritesSection";
import FeedbackSection from "../Components/FeedbackSection";
import CallToAction from "../Components/CallToAction";

export default function Home() {
  const [apodData, setApodData] = useState([]);
  const [marsPhotos, setMarsPhotos] = useState([]);
  const [epicImages, setEpicImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNasaData();
  }, []);

  const fetchNasaData = async () => {
    try {
      setLoading(true);

      // Fetch all NASA data in parallel
      console.log("Fetching NASA data...");
      const [apodResponse, marsResponse, epicResponse] = await Promise.all([
        axios.get("/api/nasa/apod?count=5"),
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head title="Beyond Earth - Journey Through Space" />

      {/* Hero Section - First Impression */}
      <Hero />

      {/* Story Timeline - Narrative Journey */}
      <StoryTimeline apodData={apodData} loading={loading} />

      {/* Gallery Section - Visual Showcase */}
      <GallerySection apodData={apodData} loading={loading} />

      {/* Mars Journey - Red Planet Exploration */}
      <MarsJourney marsPhotos={marsPhotos} loading={loading} />

      {/* Interactive Earth - 3D Experience */}
      <InteractiveEarth epicImages={epicImages} loading={loading} />

      {/* Favorites Section - User Engagement */}
      <FavoritesSection />

      {/* Feedback Section - Community Voice */}
      <FeedbackSection />

      {/* Call to Action - Final Push */}
      <CallToAction />
    </Layout>
  );
}
