import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MapPin, Navigation, Phone, Clock, CloudSun, ChevronDown, Menu, Hotel, Bus, Train } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WeatherForecast } from "./WeatherForecast";
import { LocationDetailPanel } from "./LocationDetailPanel";

const mapData = {
  monasteries: [
    {
      id: 1,
      name: "Rumtek Monastery",
      lat: 27.3012,
      lng: 88.5584,
      description: "The largest monastery in Sikkim and seat of the Karmapa",
      contact: "+91-3592-252068",
      hours: "6:00 AM - 6:00 PM",
      founded: "1740",
      type: "monastery",
      details: "Also known as the Dharmachakra Centre, this is one of the most important monasteries in Sikkim."
    },
    {
      id: 2,
      name: "Enchey Monastery",
      lat: 27.3314,
      lng: 88.6138,
      description: "200-year-old monastery with stunning mountain views",
      contact: "+91-3592-205637",
      hours: "5:00 AM - 7:00 PM",
      founded: "1840",
      type: "monastery",
      details: "Built on a site blessed by Lama Drupthob Karpo, this monastery is known for its spiritual significance."
    },
    {
      id: 3,
      name: "Pemayangtse Monastery",
      lat: 27.2167,
      lng: 88.2167,
      description: "One of the oldest monasteries in Sikkim",
      contact: "+91-3595-250263",
      hours: "6:00 AM - 5:00 PM",
      founded: "1705",
      type: "monastery",
      details: "This three-storied monastery is famous for its ancient sculptures and paintings."
    },
    {
      id: 4,
      name: "Tashiding Monastery",
      lat: 27.3,
      lng: 88.15,
      description: "Sacred monastery overlooking the Rangit River",
      contact: "+91-3595-250124",
      hours: "5:30 AM - 6:30 PM",
      founded: "1717",
      type: "monastery",
      details: "Located on a hilltop, this monastery offers breathtaking views of the surrounding valleys."
    },
  ],
  hotels: [
    {
      id: 5,
      name: "The Elgin Nor-Khill",
      lat: 27.3389,
      lng: 88.6065,
      description: "Heritage luxury hotel in the heart of Gangtok",
      contact: "+91-3592-205637",
      hours: "24/7 Check-in",
      type: "hotel",
      details: "A heritage property offering panoramic views of the Kanchenjunga range with world-class amenities."
    },
    {
      id: 6,
      name: "Hotel Golden Heights",
      lat: 27.3367,
      lng: 88.6122,
      description: "Premium hotel with mountain views on MG Marg",
      contact: "+91-3592-203991",
      hours: "24/7 Check-in",
      type: "hotel",
      details: "Located on the famous MG Marg, this hotel offers luxury accommodation with modern facilities."
    },
    {
      id: 7,
      name: "The Z Retreat & Spa",
      lat: 27.3200,
      lng: 88.6100,
      description: "Luxury spa resort with panoramic mountain views",
      contact: "+91-3592-252050",
      hours: "24/7 Check-in",
      type: "hotel",
      details: "A luxury retreat offering spa services and stunning views of the Himalayas."
    },
    {
      id: 8,
      name: "Hotel Sunmount Mayal Retreat",
      lat: 27.3150,
      lng: 88.6080,
      description: "Comfortable stay with valley views",
      contact: "+91-3592-251234",
      hours: "24/7 Check-in",
      type: "hotel",
      details: "A peaceful retreat offering comfortable accommodation with scenic valley views."
    },
  ],
  transport: [
    {
      id: 17,
      name: "SNT Bus Terminal Gangtok",
      lat: 27.3259,
      lng: 88.6137,
      description: "Main Sikkim Nationalised Transport terminal",
      contact: "+91-9733151359",
      hours: "5:00 AM - 9:00 PM",
      type: "bus",
      details: "Primary bus terminal for inter-state and local transportation within Sikkim."
    },
    {
      id: 18,
      name: "Siliguri Bus Terminal",
      lat: 26.7271,
      lng: 88.3953,
      description: "Major bus terminal connecting to Sikkim",
      contact: "+91-8637023266",
      hours: "24/7 Operations",
      type: "bus",
      details: "Gateway terminal for buses to Sikkim from West Bengal and other states."
    },
    {
      id: 19,
      name: "Jorethang Bus Terminal",
      lat: 27.1833,
      lng: 88.2167,
      description: "Important bus terminal in South Sikkim",
      contact: "+91-9733070010",
      hours: "5:30 AM - 8:30 PM",
      type: "bus",
      details: "Key transit point for South and West Sikkim routes."
    },
    {
      id: 20,
      name: "Pelling Bus Stand",
      lat: 27.2139,
      lng: 88.2139,
      description: "Local bus terminal in Pelling",
      contact: "+91-3595-250156",
      hours: "6:00 AM - 8:00 PM",
      type: "bus",
      details: "Bus terminal serving West Sikkim and connecting to major tourist destinations."
    },
    {
      id: 21,
      name: "Namchi Bus Terminal",
      lat: 27.1667,
      lng: 88.3667,
      description: "South Sikkim district headquarters bus terminal",
      contact: "+91-3595-264045",
      hours: "5:30 AM - 9:00 PM",
      type: "bus",
      details: "Important bus hub for South Sikkim connecting to major towns."
    },
    {
      id: 22,
      name: "Mangan Bus Terminal",
      lat: 27.5167,
      lng: 88.5333,
      description: "North Sikkim district headquarters bus terminal",
      contact: "+91-3592-234067",
      hours: "6:00 AM - 7:00 PM",
      type: "bus",
      details: "Gateway for North Sikkim destinations and trekking routes."
    },
    {
      id: 23,
      name: "New Jalpaiguri Railway Station",
      lat: 26.7006,
      lng: 88.3953,
      description: "Nearest major railway station to Sikkim",
      contact: "+91-353-2564000",
      hours: "24/7 Operations",
      type: "train",
      details: "Major railway junction connecting Sikkim to the rest of India via road transport."
    },
    {
      id: 24,
      name: "Siliguri Junction Railway Station",
      lat: 26.7271,
      lng: 88.4283,
      description: "Important railway station near Sikkim",
      contact: "+91-353-2641234",
      hours: "24/7 Operations",
      type: "train",
      details: "Key railway station serving as gateway to Northeast India and Sikkim."
    },
    {
      id: 25,
      name: "Bagdogra Railway Station",
      lat: 26.6992,
      lng: 88.3192,
      description: "Railway station near Bagdogra Airport",
      contact: "+91-353-2580234",
      hours: "24/7 Operations",
      type: "train",
      details: "Convenient railway station for air-rail connectivity to Sikkim."
    },
    {
      id: 26,
      name: "Kurseong Railway Station",
      lat: 26.8820,
      lng: 88.2743,
      description: "Historic hill railway station",
      contact: "+91-354-243567",
      hours: "6:00 AM - 10:00 PM",
      type: "train",
      details: "Part of the famous Darjeeling Himalayan Railway toy train route."
    },
    {
      id: 27,
      name: "Darjeeling Railway Station",
      lat: 27.0410,
      lng: 88.2663,
      description: "Famous toy train terminus",
      contact: "+91-354-2254555",
      hours: "6:00 AM - 9:00 PM",
      type: "train",
      details: "UNESCO World Heritage Darjeeling Himalayan Railway terminus."
    },
  ]
};

type MarkerType = typeof mapData.monasteries[0] | typeof mapData.hotels[0] | typeof mapData.transport[0];

export const InteractiveMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const currentInfoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedItem, setSelectedItem] = useState<MarkerType | null>(null);
  const [showWeather, setShowWeather] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: "AIzaSyAjIeX51QqM7A4i69Pv3_ui4sn0Bn9g8a4",
        version: "weekly",
        libraries: ["maps", "marker"],
      });

      // Add performance optimizations
      loader.load().then(() => {
        // Preload map tiles by setting map bounds
        const bounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(26.5, 87.5), // SW
          new google.maps.LatLng(28.5, 89.2)  // NE
        );
      });

      try {
        const { Map } = await loader.importLibrary("maps");
        const { AdvancedMarkerElement, PinElement } = await loader.importLibrary("marker");

        if (mapRef.current) {
          const mapInstance = new Map(mapRef.current, {
            center: { lat: 27.1, lng: 88.4 }, // Centered between Sikkim and railway stations
            zoom: 7, // Wider zoom to show more area
            minZoom: 6, // Allow wider view
            maxZoom: 16,
            mapId: "gompix-map",
            gestureHandling: "cooperative",
            // Performance optimizations
            renderingType: google.maps.RenderingType.RASTER,
            tilt: 0,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            restriction: {
              latLngBounds: {
                north: 28.5,
                south: 26.5,
                east: 89.2,
                west: 87.5,
              },
              strictBounds: true,
            },
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              },
              {
                featureType: "transit",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ]
          });

          setMap(mapInstance);

          // Helper function to create markers
          const createMarkers = (items: any[], type: string) => {
            items.forEach((item) => {
              let pinConfig = {
                background: "#f59e0b",
                borderColor: "#d97706", 
                glyph: "🏛️",
                glyphColor: "white",
                scale: 1.2,
              };

              // Customize pin based on type
              switch(type) {
                case 'hotel':
                  pinConfig = { ...pinConfig, background: "#3b82f6", borderColor: "#1d4ed8", glyph: "🏨" };
                  break;
                case 'bus':
                  pinConfig = { ...pinConfig, background: "#10b981", borderColor: "#047857", glyph: "🚌" };
                  break;
                case 'train':
                  pinConfig = { ...pinConfig, background: "#8b5cf6", borderColor: "#7c3aed", glyph: "🚂" };
                  break;
              }

              const pin = new PinElement(pinConfig);

              const marker = new AdvancedMarkerElement({
                map: mapInstance,
                position: { lat: item.lat, lng: item.lng },
                title: item.name,
                content: pin.element,
              });

              // Create info window content
              const infoWindowContent = `
                <div class="p-4 max-w-xs">
                  <h3 class="font-bold text-lg mb-2">${item.name}</h3>
                  <p class="text-sm text-gray-600 mb-2">${item.description}</p>
                  <div class="space-y-1 text-xs text-gray-500">
                    ${item.founded ? `<div class="flex items-center"><span class="font-medium">Founded:</span><span class="ml-1">${item.founded}</span></div>` : ''}
                    <div class="flex items-center">
                      <span class="font-medium">Hours:</span> 
                      <span class="ml-1">${item.hours}</span>
                    </div>
                    <div class="flex items-center">
                      <span class="font-medium">Contact:</span> 
                      <span class="ml-1">${item.contact}</span>
                    </div>
                  </div>
                  <div class="mt-3 flex space-x-2">
                    <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}&travelmode=driving', '_blank')" 
                      class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">
                      Directions
                    </button>
                    ${type === 'monastery' ? `<button onclick="alert('Opening virtual tour for ${item.name}')" class="px-3 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600">Virtual Tour</button>` : ''}
                  </div>
                </div>
              `;

              const infoWindow = new google.maps.InfoWindow({
                content: infoWindowContent,
              });

              marker.addListener("click", () => {
                // Close any open info windows
                if (currentInfoWindowRef.current) {
                  currentInfoWindowRef.current.close();
                }
                
                setSelectedItem(item);
                setShowDetailPanel(true);
                mapInstance.panTo({ lat: item.lat, lng: item.lng });
                mapInstance.setZoom(14);
              });
            });
          };

          // Create markers by type
          createMarkers(mapData.monasteries, 'monastery');
          createMarkers(mapData.hotels, 'hotel');
          
          // Separate bus and train stations correctly
          const busStations = mapData.transport.filter(item => item.type === 'bus');
          const trainStations = mapData.transport.filter(item => item.type === 'train');
          
          createMarkers(busStations, 'bus');
          createMarkers(trainStations, 'train');
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
        toast({
          title: "Map Loading Error",
          description: "Unable to load the interactive map. Please try again later.",
          variant: "destructive",
        });
      }
    };

    initMap();
  }, [toast]);

  const handleGetDirections = (item: MarkerType) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}&travelmode=driving`;
    window.open(url, "_blank");
  };

  const handleViewTour = (item: MarkerType) => {
    toast({
      title: "Virtual Tour",
      description: `Opening virtual tour for ${item.name}`,
    });
    // This would integrate with the virtual tour section
  };

  const allItems = [...mapData.monasteries, ...mapData.hotels, ...mapData.transport];

  return (
    <div className="w-full h-screen relative">
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg shadow-monastery"
        style={{ minHeight: "600px" }}
      />
      
      {/* Weather Button - Top Header Area */}
      <div className="absolute top-4 right-16 z-20">
        <Button
          onClick={() => setShowWeather(!showWeather)}
          variant="outline"
          size="sm"
          className="glass-morphism border-white/30 text-white hover:bg-white/20 shadow-xl backdrop-blur-md bg-black/20 hover:border-white/50"
        >
          <CloudSun className="w-4 h-4 mr-2" />
          Weather
        </Button>
      </div>
      
      {/* Markers Dropdown Menu */}
      <div className="absolute top-4 left-4 z-10">
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="glass-morphism border-white/30 text-white hover:bg-white/20 shadow-xl backdrop-blur-md bg-black/20 hover:border-white/50"
            >
              <Menu className="w-4 h-4 mr-2" />
              Explore Locations
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-80 max-h-[calc(100vh-6rem)] overflow-y-auto glass-morphism bg-background/95 backdrop-blur-md border-white/20 shadow-heritage"
            sideOffset={8}
          >
            <div className="p-2 space-y-2">
              {allItems.map((item) => {
                const getIcon = () => {
                  switch(item.type) {
                    case 'monastery': return <MapPin className="w-4 h-4 text-primary" />;
                    case 'hotel': return <Hotel className="w-4 h-4 text-blue-500" />;
                    case 'bus': return <Bus className="w-4 h-4 text-green-500" />;
                    case 'train': return <Train className="w-4 h-4 text-purple-500" />;
                    default: return <MapPin className="w-4 h-4" />;
                  }
                };

                return (
                  <Card 
                    key={item.id} 
                    className={`cursor-pointer transition-all duration-300 hover:shadow-heritage glass-morphism ${
                      selectedItem?.id === item.id ? 'ring-2 ring-primary shadow-glow' : ''
                    }`}
                    onClick={() => {
                      setSelectedItem(item);
                      setShowDetailPanel(true);
                      setIsDropdownOpen(false);
                      if (map) {
                        map.panTo({ lat: item.lat, lng: item.lng });
                        map.setZoom(14);
                      }
                    }}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center space-x-2">
                        {getIcon()}
                        <span>{item.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground mb-1">{item.description}</p>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{item.hours}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Weather Forecast Panel */}
      {showWeather && (
        <div className="absolute top-16 right-4 w-80 z-10">
          <WeatherForecast onClose={() => setShowWeather(false)} />
        </div>
      )}

      {/* Location Detail Panel */}
      {showDetailPanel && selectedItem && (
        <LocationDetailPanel
          location={selectedItem}
          onClose={() => setShowDetailPanel(false)}
          onGetDirections={handleGetDirections}
          onViewTour={selectedItem.type === 'monastery' ? handleViewTour : undefined}
        />
      )}
    </div>
  );
};