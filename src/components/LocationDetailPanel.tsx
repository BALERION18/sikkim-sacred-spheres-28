import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation, Phone, Clock, Star, MapPin, X } from "lucide-react";

// Import images
import monasteryDetail from "@/assets/monastery-detail.jpg";
import hotelDetail from "@/assets/hotel-detail.jpg";
import busDetail from "@/assets/bus-detail.jpg";
import trainDetail from "@/assets/train-detail.jpg";

type LocationItem = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  description: string;
  contact: string;
  hours: string;
  type: string;
  details: string;
  founded?: string;
};

interface LocationDetailPanelProps {
  location: LocationItem;
  onClose: () => void;
  onGetDirections: (location: LocationItem) => void;
  onViewTour?: (location: LocationItem) => void;
}

export const LocationDetailPanel = ({ 
  location, 
  onClose, 
  onGetDirections, 
  onViewTour 
}: LocationDetailPanelProps) => {
  const getLocationImage = () => {
    switch(location.type) {
      case 'monastery': return monasteryDetail;
      case 'hotel': return hotelDetail;
      case 'bus': return busDetail;
      case 'train': return trainDetail;
      default: return monasteryDetail;
    }
  };

  const getLocationBadge = () => {
    const badgeConfig = {
      monastery: { label: "Monastery", className: "bg-primary text-primary-foreground" },
      hotel: { label: "Hotel", className: "bg-blue-500 text-white" },
      bus: { label: "Bus Terminal", className: "bg-green-500 text-white" },
      train: { label: "Railway Station", className: "bg-purple-500 text-white" }
    };
    
    const config = badgeConfig[location.type as keyof typeof badgeConfig] || badgeConfig.monastery;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getRating = () => {
    // Generate a random rating between 4.0 and 4.8 for demo purposes
    return (4.0 + Math.random() * 0.8).toFixed(1);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-morphism border-white/20 shadow-heritage">
        <div className="relative">
          {/* Header with Image */}
          <div className="relative h-64 overflow-hidden rounded-t-lg">
            <img 
              src={getLocationImage()} 
              alt={location.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Close Button */}
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 glass-morphism border-white/20 text-white hover:bg-white/20"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
            
            {/* Title Overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{location.name}</h2>
                  {getLocationBadge()}
                </div>
                <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-md rounded-lg px-3 py-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-medium">{getRating()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">About</h3>
              <p className="text-muted-foreground mb-2">{location.description}</p>
              <p className="text-sm text-muted-foreground">{location.details}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Hours</p>
                    <p className="text-sm text-muted-foreground">{location.hours}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Contact</p>
                    <p className="text-sm text-muted-foreground">{location.contact}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {location.founded && (
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Founded</p>
                      <p className="text-sm text-muted-foreground">{location.founded}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <Navigation className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
              <Button 
                onClick={() => onGetDirections(location)}
                className="flex items-center space-x-2 bg-primary hover:bg-primary/90 shadow-glow"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </Button>
              
              {location.type === 'monastery' && onViewTour && (
                <Button 
                  variant="outline"
                  onClick={() => onViewTour(location)}
                  className="flex items-center space-x-2 glass-morphism border-primary/20 hover:bg-primary/10"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Virtual Tour</span>
                </Button>
              )}
              
              <Button 
                variant="outline"
                onClick={() => window.open(`tel:${location.contact}`, '_blank')}
                className="flex items-center space-x-2 glass-morphism border-green-500/20 hover:bg-green-500/10"
              >
                <Phone className="w-4 h-4" />
                <span>Call</span>
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};