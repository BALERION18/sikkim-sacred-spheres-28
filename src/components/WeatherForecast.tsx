import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer, Droplets, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OptimizedImage } from "@/components/OptimizedImage";

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
  sys: {
    country: string;
  };
}

interface WeatherForecastProps {
  onClose: () => void;
}

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'clear':
      return <Sun className="w-8 h-8 text-yellow-500" />;
    case 'clouds':
      return <Cloud className="w-8 h-8 text-gray-400" />;
    case 'rain':
      return <CloudRain className="w-8 h-8 text-blue-500" />;
    case 'snow':
      return <CloudSnow className="w-8 h-8 text-blue-200" />;
    default:
      return <Sun className="w-8 h-8 text-yellow-500" />;
  }
};

export const WeatherForecast = ({ onClose }: WeatherForecastProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const API_KEY = "703ceeabc3144899d128381be6c3f416";
  const SIKKIM_COORDS = { lat: 27.533, lon: 88.5122 }; // Gangtok, Sikkim coordinates

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${SIKKIM_COORDS.lat}&lon=${SIKKIM_COORDS.lon}&appid=${API_KEY}&units=metric`
        );
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
          }
          throw new Error('Weather data not available');
        }
        
        const data: WeatherData = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather:", error);
        toast({
          title: "Weather API Error",
          description: "Invalid API key. Please get a valid OpenWeatherMap API key from openweathermap.org",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh weather data every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [toast]);

  if (loading) {
    return (
      <Card className="glass-morphism border-white/20 backdrop-blur-md bg-white/10 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <Card className="glass-morphism border-white/20 backdrop-blur-md bg-white/10 shadow-xl hover:bg-white/15 transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Thermometer className="w-5 h-5 text-primary" />
            <span className="text-lg">Sikkim Weather</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main weather display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getWeatherIcon(weather.weather[0].main)}
            <div>
              <div className="text-2xl font-bold text-white">
                {Math.round(weather.main.temp)}°C
              </div>
              <div className="text-sm text-white/80 capitalize">
                {weather.weather[0].description}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/80">Feels like</div>
            <div className="text-lg font-semibold text-white">
              {Math.round(weather.main.feels_like)}°C
            </div>
          </div>
        </div>

        {/* Weather details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2 text-white/90">
            <Droplets className="w-4 h-4 text-blue-400" />
            <span>Humidity: {weather.main.humidity}%</span>
          </div>
          <div className="flex items-center space-x-2 text-white/90">
            <Wind className="w-4 h-4 text-gray-300" />
            <span>Wind: {weather.wind.speed} m/s</span>
          </div>
        </div>

        {/* Location */}
        <div className="pt-2 border-t border-white/20">
          <div className="text-xs text-white/70 text-center">
            📍 {weather.name}, {weather.sys.country}
          </div>
        </div>

        {/* Weather image background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <OptimizedImage
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather condition"
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
            width={64}
            height={64}
          />
        </div>
      </CardContent>
    </Card>
  );
};