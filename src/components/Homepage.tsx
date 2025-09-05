import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SikkimCarousel } from "./SikkimCarousel";
import { MapPin, Camera, Archive, Calendar, Headphones, Play } from "lucide-react";
import heroImage from "@/assets/sikkim-monasteries-hero.jpg";

interface HomepageProps {
  setActiveSection: (section: string) => void;
}

export const Homepage = ({ setActiveSection }: HomepageProps) => {
  const features = [
    {
      icon: MapPin,
      title: "Interactive Map",
      description: "Discover 200+ monasteries with GPS navigation and detailed information",
      action: () => setActiveSection("map"),
      color: "text-blue-600",
    },
    {
      icon: Camera,
      title: "Virtual Tours",
      description: "Immersive 360° experiences of sacred spaces and ancient architecture",
      action: () => setActiveSection("tours"),
      color: "text-green-600",
    },
    {
      icon: Archive,
      title: "Digital Archives",
      description: "Access digitized manuscripts, murals, and historical documents",
      action: () => setActiveSection("archives"),
      color: "text-purple-600",
    },
    {
      icon: Calendar,
      title: "Cultural Calendar",
      description: "Join festivals, prayer sessions, and cultural events",
      action: () => setActiveSection("calendar"),
      color: "text-orange-600",
    },
    {
      icon: Headphones,
      title: "Audio Guide",
      description: "Professional narration in multiple languages with offline access",
      action: () => setActiveSection("audio"),
      color: "text-red-600",
    },
  ];

  const stats = [
    { number: "200+", label: "Monasteries" },
    { number: "17th", label: "Century Origins" },
    { number: "5", label: "Languages" },
    { number: "1000+", label: "Digital Archives" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="text-primary">GOMPIX</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in">
            Digitizing Sikkim's Sacred Heritage for Future Generations
          </p>
          <p className="text-lg mb-12 text-gray-300 max-w-2xl mx-auto animate-fade-in">
            Explore 200+ monasteries through immersive virtual tours, discover ancient manuscripts, 
            and participate in authentic Buddhist cultural experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button 
              size="lg" 
              onClick={() => setActiveSection("tours")}
              className="bg-primary hover:bg-primary/80 text-primary-foreground shadow-glow"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Virtual Tour
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setActiveSection("map")}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Explore Map
            </Button>
          </div>
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-primary rounded-full animate-float opacity-60" />
        <div className="absolute top-32 right-16 w-6 h-6 bg-primary-glow rounded-full animate-float opacity-40" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-accent rounded-full animate-float opacity-50" style={{ animationDelay: "2s" }} />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Carousel */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Discover Sacred Monasteries
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Journey through time and explore the spiritual heart of Sikkim through our 
              immersive digital experiences.
            </p>
          </div>
          <SikkimCarousel />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore Our Features
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive digital tools to explore, learn, and participate in 
              Sikkim's rich monastic heritage.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className="group hover:shadow-heritage transition-all duration-300 cursor-pointer glass-morphism"
                  onClick={feature.action}
                >
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <Icon className={`w-12 h-12 mx-auto ${feature.color} group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    <Button 
                      variant="outline" 
                      className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
                    >
                      Explore Feature
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-gradient-mountain text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Preserving Heritage, Inspiring Discovery
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
            GOMPIX bridges ancient wisdom with modern technology, making Sikkim's 
            spiritual treasures accessible to everyone while supporting local communities 
            and preserving cultural heritage for future generations.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="glass-morphism p-6">
              <h3 className="text-xl font-bold mb-3">Cultural Preservation</h3>
              <p className="text-gray-300">
                Digitizing ancient manuscripts and preserving monastery architecture 
                for future generations to study and appreciate.
              </p>
            </div>
            <div className="glass-morphism p-6">
              <h3 className="text-xl font-bold mb-3">Tourism Enhancement</h3>
              <p className="text-gray-300">
                Making monasteries more accessible to global visitors through 
                virtual experiences and comprehensive travel information.
              </p>
            </div>
            <div className="glass-morphism p-6">
              <h3 className="text-xl font-bold mb-3">Community Empowerment</h3>
              <p className="text-gray-300">
                Supporting local communities through participatory archiving 
                and sustainable tourism initiatives.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};