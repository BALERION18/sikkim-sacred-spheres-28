import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Volume2, VolumeX, RotateCcw, Maximize } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaPlayerProps {
  type: "video" | "audio";
  src: string;
  poster?: string;
  title: string;
  onFullscreen?: () => void;
  className?: string;
}

export const MediaPlayer = ({ 
  type, 
  src, 
  poster, 
  title, 
  onFullscreen,
  className = ""
}: MediaPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const handleLoadedData = () => {
      setDuration(media.duration);
      setIsLoading(false);
      toast({
        title: `${type === 'video' ? 'Video' : 'Audio'} Ready`,
        description: `${title} is ready to play`,
      });
    };

    const handleTimeUpdate = () => {
      const current = media.currentTime;
      const total = media.duration;
      setCurrentTime(current);
      setProgress((current / total) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    const handleError = (e: any) => {
      console.error('Media error:', e);
      setHasError(true);
      setIsLoading(false);
      toast({
        title: "Media Error",
        description: `Unable to load ${type}. Please try again later.`,
        variant: "destructive",
      });
    };

    media.addEventListener('loadeddata', handleLoadedData);
    media.addEventListener('timeupdate', handleTimeUpdate);
    media.addEventListener('ended', handleEnded);
    media.addEventListener('error', handleError);

    return () => {
      media.removeEventListener('loadeddata', handleLoadedData);
      media.removeEventListener('timeupdate', handleTimeUpdate);
      media.removeEventListener('ended', handleEnded);
      media.removeEventListener('error', handleError);
    };
  }, [src, title, type, toast]);

  const handlePlayPause = async () => {
    const media = mediaRef.current;
    if (!media) return;

    try {
      if (isPlaying) {
        await media.pause();
        setIsPlaying(false);
      } else {
        await media.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Playback error:', error);
      toast({
        title: "Playback Error",
        description: "Unable to play media. Please check your connection.",
        variant: "destructive",
      });
    }
  };

  const handleMuteToggle = () => {
    const media = mediaRef.current;
    if (!media) return;
    
    media.muted = !media.muted;
    setIsMuted(media.muted);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const media = mediaRef.current;
    if (!media || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    
    media.currentTime = newTime;
  };

  const handleReset = () => {
    const media = mediaRef.current;
    if (!media) return;
    
    media.currentTime = 0;
    setCurrentTime(0);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate sample media URLs for demonstration
  const getSampleMediaUrl = () => {
    if (type === 'video') {
      // Using a sample video URL that actually works
      return 'https://www.w3schools.com/html/mov_bbb.mp4';
    } else {
      // Using a sample audio URL that actually works
      return 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav';
    }
  };

  if (hasError) {
    return (
      <div className={`flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm rounded-lg p-8 ${className}`}>
        <div className="text-center text-white">
          <h3 className="text-lg font-semibold mb-2">Media Unavailable</h3>
          <p className="text-gray-300 mb-4">
            The {type} content is currently unavailable. This would be replaced with actual monastery {type}s.
          </p>
          <Button
            onClick={() => {
              setHasError(false);
              setIsLoading(true);
              if (mediaRef.current) {
                mediaRef.current.load();
              }
            }}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {type === 'video' ? (
        <video
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          src={getSampleMediaUrl()}
          poster={poster}
          className="w-full h-full object-cover"
          playsInline
          preload="metadata"
        />
      ) : (
        <audio
          ref={mediaRef as React.RefObject<HTMLAudioElement>}
          src={getSampleMediaUrl()}
          preload="metadata"
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p>Loading {type}...</p>
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-black/70 via-transparent to-black/50">
        {/* Top Controls */}
        <div className="flex justify-between items-start">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white">
            <h3 className="font-bold">{title}</h3>
            <p className="text-sm text-gray-300">{type === 'video' ? '360° Virtual Tour' : 'Audio Guide'}</p>
          </div>
          
          {type === 'video' && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleMuteToggle}
                className="bg-black/70 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleReset}
                className="bg-black/70 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              {onFullscreen && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onFullscreen}
                  className="bg-black/70 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                >
                  <Maximize className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration || 0)}
            </span>
            <span className="text-sm">{Math.round(progress)}%</span>
          </div>
          
          <div 
            className="w-full bg-gray-600 rounded-full h-2 cursor-pointer mb-3"
            onClick={handleProgressClick}
          >
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handlePlayPause}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/80 w-16 h-16 rounded-full"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};