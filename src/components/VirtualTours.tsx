import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MediaPlayer } from "@/components/MediaPlayer";
import monasteryImage1 from "@/assets/monastery-1.jpg";
import monasteryImage2 from "@/assets/monastery-2.jpg";
import monasteryImage3 from "@/assets/monastery-3.jpg";
import virtualToursHero from "@/assets/virtual-tours-hero.jpg";

const virtualTours = [
  {
    id: 1,
    name: "Rumtek Monastery", // Change this to your tour name
    image: monasteryImage1, // Or import your custom image
    duration: "15 minutes",
    language: ["English", "Hindi", "Nepali"],
    description: "Your custom virtual tour description here",
    highlights: ["360° Architecture", "Prayer Spaces", "Mountain Views"],
    difficulty: "Easy",
    videoUrl: "/gonjang-tour..mp4", // Your uploaded video
    youtubeId: "X7tgD2W_cNs", // Keep as fallback
    title: "Your Custom Tour Title",
    useLocalVideo: true, // Flag to use local video instead of YouTube
  },
  {
    id: 2,
    name: "Gonjang Monastery",
    image: monasteryImage2,
    duration: "12 minutes",
    language: ["English", "Hindi"],
    description: "Experience the 360° panoramic view of Gonjang Monastery near Gangtok with its stunning architecture.",
    highlights: ["360° Architecture", "Prayer Spaces", "Mountain Views"],
    difficulty: "Moderate",
    videoUrl: "/your-monastery-tour.mp4",
    youtubeId: "YcQ8uLZHjyE",
    title: "GONJANG MONASTERY 360° VIEW GANGTOK SIKKIM",
    useLocalVideo: true
  },
  {
    id: 3,
    name: "Ranka Monastery",
    image: monasteryImage3,
    duration: "10 minutes",
    language: ["English", "Hindi", "Lepcha"],
    description: "360-degree view of Ranka Monastery in Gangtok showcasing its traditional architecture and sacred spaces.",
    highlights: ["360° View", "Traditional Architecture", "Sacred Spaces"],
    difficulty: "Easy",
    videoUrl: "/Ranka-tour.mp4",
    youtubeId: "pF8N2rk6yjI",
    title: "360 degree view of Ranka Monastery, Gangtok",
    useLocalVideo: true
  },
];

export const VirtualTours = () => {
  const [activeTour, setActiveTour] = useState<typeof virtualTours[0] | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const { toast } = useToast();

  const handleStartTour = (tour: typeof virtualTours[0]) => {
    setActiveTour(tour);
    toast({
      title: "Virtual Tour Started",
      description: `Starting tour of ${tour.name}`,
    });
  };

  const handleFullscreen = () => {
    toast({
      title: "Fullscreen Mode",
      description: "Entering immersive 360° experience",
    });
  };

  const handleReset = () => {
    toast({
      title: "Tour Reset",
      description: "Returning to starting position",
    });
  };

  if (activeTour) {
    return (
      <div className="w-full h-screen bg-black relative">
        {/* Custom Video or YouTube Player */}
        {activeTour.useLocalVideo && activeTour.videoUrl ? (
          <video
            className="w-full h-full object-cover"
            controls
            autoPlay
            muted
            loop
          >
            <source src={activeTour.videoUrl} type="video/mp4" />
            <source src={activeTour.videoUrl} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${activeTour.youtubeId}?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0&fs=1&cc_load_policy=1&iv_load_policy=3&hl=${selectedLanguage.toLowerCase()}`}
            title={activeTour.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ border: 'none' }}
          />
        )}
        
        {/* Language Selector Overlay */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex space-x-2 bg-black/70 backdrop-blur-sm rounded-lg p-2">
            {activeTour.language.map((lang) => (
              <Button
                key={lang}
                variant={selectedLanguage === lang ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLanguage(lang)}
                className="text-xs"
              >
                {lang}
              </Button>
            ))}
          </div>
        </div>

        {/* Tour Info Overlay */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 max-w-sm">
            <h2 className="text-white font-bold text-lg">{activeTour.name}</h2>
            <p className="text-gray-300 text-sm">{activeTour.description}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {activeTour.highlights.map((highlight, index) => (
                <span key={index} className="bg-primary/20 text-primary text-xs px-2 py-1 rounded">
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Exit Button */}
        <div className="absolute bottom-4 left-4 z-10">
          <Button
            variant="outline"
            onClick={() => setActiveTour(null)}
            className="bg-black/70 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
          >
            ← Exit Tour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${virtualToursHero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Virtual <span className="text-primary">Tours</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in">
            Immerse yourself in 360° virtual experiences of Sikkim's most sacred monasteries
          </p>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto animate-fade-in">
            Explore ancient halls, view precious artifacts, and learn about centuries of Buddhist tradition.
          </p>
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-primary rounded-full animate-float opacity-60" />
        <div className="absolute top-32 right-16 w-6 h-6 bg-primary-glow rounded-full animate-float opacity-40" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-accent rounded-full animate-float opacity-50" style={{ animationDelay: "2s" }} />
      </section>
      
      {/* Tours Grid Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Available Virtual Tours
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose from our collection of immersive monastery experiences
            </p>
          </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {virtualTours.map((tour) => (
          <Card key={tour.id} className="group hover:shadow-heritage transition-all duration-300 glass-morphism">
            <CardHeader className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={tour.image}
                  alt={tour.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="lg"
                    onClick={() => handleStartTour(tour)}
                    className="bg-primary/90 hover:bg-primary shadow-glow"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Tour
                  </Button>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-black/70 text-white">
                    <Camera className="w-3 h-3 mr-1" />
                    360°
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="mb-2">{tour.name}</CardTitle>
              <p className="text-sm text-muted-foreground mb-3">{tour.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration:</span>
                  <span>{tour.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Difficulty:</span>
                  <Badge variant="outline" className="text-xs">
                    {tour.difficulty}
                  </Badge>
                </div>
              </div>

              <div className="mb-3">
                <h4 className="text-sm font-medium mb-2">Tour Highlights:</h4>
                <div className="flex flex-wrap gap-1">
                  {tour.highlights.map((highlight, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Available Languages:</h4>
                <div className="flex flex-wrap gap-1">
                  {tour.language.map((lang, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={() => handleStartTour(tour)}
              >
                <Play className="w-4 h-4 mr-2" />
                Start Virtual Tour
              </Button>
            </CardContent>
          </Card>
        ))}
        </div>
        </div>
      </section>
    </div>
  );
};
