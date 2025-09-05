import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage = ({
  src,
  alt,
  className,
  loading = 'lazy',
  placeholder,
  width,
  height,
  onLoad,
  onError,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const getOptimizedSrc = (originalSrc: string, targetWidth?: number) => {
    // For local images, add optimization parameters
    if (originalSrc.includes('supabase') && targetWidth) {
      return `${originalSrc}?width=${targetWidth}&quality=80&format=webp`;
    }
    
    // For other external images, try to optimize if possible
    if (targetWidth && originalSrc.includes('http')) {
      // Add common optimization parameters that many CDNs support
      const url = new URL(originalSrc);
      url.searchParams.set('w', targetWidth.toString());
      url.searchParams.set('q', '80');
      url.searchParams.set('f', 'webp');
      return url.toString();
    }
    
    return originalSrc;
  };

  return (
    <div ref={imgRef} className={cn('relative overflow-hidden', className)}>
      {!inView && loading === 'lazy' ? (
        <div 
          className="w-full h-full bg-muted animate-pulse flex items-center justify-center"
          style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}
        >
          <div className="text-muted-foreground text-sm">Loading...</div>
        </div>
      ) : (
        <>
          {placeholder && !isLoaded && !hasError && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          <img
            src={getOptimizedSrc(src, width)}
            alt={alt}
            loading={loading}
            width={width}
            height={height}
            className={cn(
              'transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0',
              hasError && 'hidden'
            )}
            onLoad={handleLoad}
            onError={handleError}
            decoding="async"
          />
          {hasError && (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <div className="text-muted-foreground text-sm">Failed to load image</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};