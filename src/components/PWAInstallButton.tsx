import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';

declare global {
  interface Window {
    deferredPrompt?: any;
  }
}

const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    const isInWebAppChrome = window.matchMedia('(display-mode: standalone)').matches;
    
    setIsStandalone(isInStandaloneMode || isInWebAppiOS || isInWebAppChrome);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Show button after 2 seconds if not installed and prompt available
    const timer = setTimeout(() => {
      if (!isStandalone && !deferredPrompt) {
        setShowInstallButton(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowInstallButton(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback: Show manual installation instructions
      const instructions = `
To install this app:

Chrome/Edge:
• Click the 3-dot menu (⋮) → "Install Monastery360..."
• Or look for the install icon (📱) in the address bar

Safari (iOS):
• Tap the share button → "Add to Home Screen"

Firefox:
• Menu → "Install" or "Add to Home Screen"
      `;
      alert(instructions);
    }
  };

  const handleDismiss = () => {
    setShowInstallButton(false);
  };

  // Don't show if already installed
  if (isStandalone || !showInstallButton) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-primary/95 backdrop-blur-sm text-primary-foreground rounded-full shadow-lg p-3 animate-in slide-in-from-bottom-4 duration-300">
      <Download className="w-5 h-5" />
      <span className="font-medium text-sm hidden sm:inline">Install App for Offline Access</span>
      <span className="font-medium text-sm sm:hidden">Install App</span>
      <Button
        size="sm"
        variant="secondary"
        onClick={handleInstallClick}
        className="ml-2 bg-background/10 hover:bg-background/20 text-primary-foreground border-0 rounded-full px-4"
      >
        Install
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleDismiss}
        className="ml-1 hover:bg-background/10 text-primary-foreground p-1 rounded-full"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default PWAInstallButton;