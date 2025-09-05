import { useState, useEffect, useCallback } from 'react';

interface UseImagePreloaderOptions {
  priority?: boolean;
  preloadNext?: number;
  sizes?: string[];
  formats?: string[];
}

interface PreloadedImage {
  src: string;
  loaded: boolean;
  error: boolean;
  element?: HTMLImageElement;
}

export const useImagePreloader = (
  sources: string[],
  options: UseImagePreloaderOptions = {}
) => {
  const { priority = false, preloadNext = 2, sizes = [], formats = ['webp', 'jpg'] } = options;
  const [preloadedImages, setPreloadedImages] = useState<Map<string, PreloadedImage>>(new Map());
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const preloadImage = useCallback((src: string, isPriority = false): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      // Set loading attribute based on priority
      if (isPriority) {
        img.loading = 'eager';
        img.fetchPriority = 'high' as any;
      } else {
        img.loading = 'lazy';
        img.fetchPriority = 'low' as any;
      }
      
      // Add sizes attribute if provided
      if (sizes.length > 0) {
        img.sizes = sizes.join(', ');
      }
      
      // Handle different formats
      img.onload = () => {
        setPreloadedImages(prev => new Map(prev.set(src, {
          src,
          loaded: true,
          error: false,
          element: img
        })));
        resolve(img);
      };
      
      img.onerror = () => {
        setPreloadedImages(prev => new Map(prev.set(src, {
          src,
          loaded: false,
          error: true
        })));
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      img.src = src;
      
      // Set initial state
      setPreloadedImages(prev => new Map(prev.set(src, {
        src,
        loaded: false,
        error: false,
        element: img
      })));
    });
  }, [sizes]);
  
  const preloadBatch = useCallback(async (startIndex: number, count: number) => {
    const imagesToPreload = sources.slice(startIndex, startIndex + count);
    const promises = imagesToPreload.map((src, index) => 
      preloadImage(src, priority && index === 0)
    );
    
    try {
      await Promise.allSettled(promises);
    } catch (error) {
      console.warn('Some images failed to preload:', error);
    }
  }, [sources, preloadImage, priority]);
  
  // Preload images around current index
  useEffect(() => {
    if (sources.length === 0) return;
    
    // Always preload current image with priority
    preloadImage(sources[currentIndex], true);
    
    // Preload next images
    const nextImages = Math.min(preloadNext, sources.length - currentIndex - 1);
    if (nextImages > 0) {
      preloadBatch(currentIndex + 1, nextImages);
    }
    
    // Preload previous images
    const prevImages = Math.min(preloadNext, currentIndex);
    if (prevImages > 0) {
      preloadBatch(Math.max(0, currentIndex - preloadNext), prevImages);
    }
  }, [currentIndex, sources, preloadBatch, preloadImage, preloadNext]);
  
  // Initial preload
  useEffect(() => {
    if (sources.length > 0 && priority) {
      // Preload first few images immediately for priority content
      preloadBatch(0, Math.min(3, sources.length));
    }
  }, [sources, preloadBatch, priority]);
  
  const getImageState = (src: string) => {
    return preloadedImages.get(src) || { src, loaded: false, error: false };
  };
  
  const setIndex = (index: number) => {
    if (index >= 0 && index < sources.length) {
      setCurrentIndex(index);
    }
  };
  
  const preloadAll = async () => {
    await preloadBatch(0, sources.length);
  };
  
  return {
    preloadedImages,
    currentIndex,
    setIndex,
    getImageState,
    preloadImage,
    preloadAll,
    isLoaded: (src: string) => preloadedImages.get(src)?.loaded || false,
    hasError: (src: string) => preloadedImages.get(src)?.error || false,
  };
};