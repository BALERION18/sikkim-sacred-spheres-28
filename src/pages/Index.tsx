import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Homepage } from "@/components/Homepage";
import { InteractiveMap } from "@/components/InteractiveMap";
import { VirtualTours } from "@/components/VirtualTours";
import { DigitalArchives } from "@/components/DigitalArchives";
import { CulturalCalendar } from "@/components/CulturalCalendar";
import { AudioGuide } from "@/components/AudioGuide";
import { useResourcePreloader } from "@/hooks/useResourcePreloader";
import monasteryImage1 from "@/assets/monastery-1.jpg";
import monasteryImage2 from "@/assets/monastery-2.jpg";
import monasteryImage3 from "@/assets/monastery-3.jpg";
import heroImage from "@/assets/sikkim-monasteries-hero.jpg";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");

  // Preload critical images for better performance
  useResourcePreloader({
    images: [
      heroImage,
      monasteryImage1,
      monasteryImage2,
      monasteryImage3,
    ],
    critical: true // High priority preloading
  });

  // Preload Google Maps script for faster map loading
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAjIeX51QqM7A4i69Pv3_ui4sn0Bn9g8a4&libraries=maps,marker&v=weekly`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const renderActiveSection = () => {
    switch (activeSection) {
      case "home":
        return <Homepage setActiveSection={setActiveSection} />;
      case "map":
        return <InteractiveMap />;
      case "tours":
        return <VirtualTours />;
      case "archives":
        return <DigitalArchives />;
      case "calendar":
        return <CulturalCalendar />;
      case "audio":
        return <AudioGuide />;
      default:
        return <Homepage setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className={activeSection === "home" ? "" : "pt-16"}>
        {renderActiveSection()}
      </main>
    </div>
  );
};

export default Index;
