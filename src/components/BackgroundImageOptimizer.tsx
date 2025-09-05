import { useEffect, useState, useCallback } from 'react';

interface BackgroundImageOptimizerProps {
  src: string;
  className?: string;
  children?: React.ReactNode;
  priority?: boolean;
  quality?: number;
  sizes?: string;
}

export const BackgroundImageOptimizer = ({
  src,
  className = '',
  children,
  priority = false,
  quality = 80,
  sizes = '100vw'
}: BackgroundImageOptimizerProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [optimizedSrc, setOptimizedSrc] = useState(src);
  const [error, setError] = useState(false);

  const generateOptimizedSources = useCallback((originalSrc: string) => {
    // Generate WebP and fallback sources
    const sources = [];
    
    // For modern browsers - WebP
    if (originalSrc.includes('supabase')) {
      sources.push(`${originalSrc}?format=webp&quality=${quality}`);
    }
    
    // Fallback
    sources.push(originalSrc);
    
    return sources;
  }, [quality]);

  const preloadImage = useCallback(async (imageSrc: string) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      
      if (priority) {
        img.loading = 'eager';
        img.fetchPriority = 'high' as any;
      } else {
        img.loading = 'lazy';
      }
      
      img.onload = () => {
        setOptimizedSrc(imageSrc);
        setIsLoaded(true);
        resolve();
      };
      
      img.onerror = () => {
        setError(true);
        reject(new Error(`Failed to load background image: ${imageSrc}`));
      };
      
      img.src = imageSrc;
    });
  }, [priority]);

  useEffect(() => {
    const sources = generateOptimizedSources(src);
    
    // Try to load optimized version first, fallback to original
    const loadImages = async () => {
      for (const source of sources) {
        try {
          await preloadImage(source);
          break; // Success, no need to try other formats
        } catch (err) {
          console.warn(`Failed to load ${source}, trying next format`);
          continue;
        }
      }
    };
    
    loadImages();
  }, [src, generateOptimizedSources, preloadImage]);

  const backgroundStyle = {
    backgroundImage: isLoaded ? `url("${optimizedSrc}")` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 1 : 0,
  };

  const placeholderStyle = {
    backgroundColor: '#f0f0f0',
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: !isLoaded ? 'loading 1.5s infinite' : 'none',
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder/Loading state */}
      {!isLoaded && !error && (
        <div 
          className="absolute inset-0 z-0"
          style={placeholderStyle}
        />
      )}
      
      {/* Optimized background image */}
      {isLoaded && (
        <div 
          className="absolute inset-0 z-0"
          style={backgroundStyle}
        />
      )}
      
      {/* Error state */}
      {error && (
        <div className="absolute inset-0 z-0 bg-muted flex items-center justify-center">
          <div className="text-muted-foreground text-sm">
            Failed to load background image
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};