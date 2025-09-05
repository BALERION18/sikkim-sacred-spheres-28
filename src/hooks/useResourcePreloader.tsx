import { useEffect, useCallback } from 'react';

interface ResourcePreloaderConfig {
  images?: string[];
  fonts?: string[];
  critical?: boolean;
}

export const useResourcePreloader = ({ images = [], fonts = [], critical = false }: ResourcePreloaderConfig) => {
  
  const preloadImage = useCallback((src: string, priority: boolean = false) => {
    return new Promise<void>((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      
      if (priority) {
        link.setAttribute('fetchpriority', 'high');
      }
      
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
      
      document.head.appendChild(link);
    });
  }, []);
  
  const preloadFont = useCallback((fontUrl: string) => {
    return new Promise<void>((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = fontUrl;
      
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to preload font: ${fontUrl}`));
      
      document.head.appendChild(link);
    });
  }, []);
  
  const preloadResources = useCallback(async () => {
    const promises: Promise<void>[] = [];
    
    // Preload images with priority for critical ones
    images.forEach((src, index) => {
      const isPriority = critical && index < 2; // First 2 images are priority if critical
      promises.push(preloadImage(src, isPriority));
    });
    
    // Preload fonts
    fonts.forEach(fontUrl => {
      promises.push(preloadFont(fontUrl));
    });
    
    try {
      await Promise.allSettled(promises);
    } catch (error) {
      console.warn('Some resources failed to preload:', error);
    }
  }, [images, fonts, critical, preloadImage, preloadFont]);
  
  useEffect(() => {
    if (critical) {
      // For critical resources, preload immediately
      preloadResources();
    } else {
      // For non-critical, wait a bit to avoid blocking critical rendering
      const timer = setTimeout(() => {
        preloadResources();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [preloadResources, critical]);
  
  return { preloadResources };
};