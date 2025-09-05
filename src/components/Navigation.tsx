import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, MapPin, Camera, Archive, Calendar, Headphones, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import gompixLogo from "/lovable-uploads/34f6e409-143f-4b09-8ac6-da046805dbe2.png";
import { BusScheduling } from "@/components/BusScheduling";
import { OptimizedImage } from "@/components/OptimizedImage";

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Navigation = ({ activeSection, setActiveSection }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const navigationItems = [
    { id: "home", label: "Home", icon: null },
    { id: "map", label: "Interactive Map", icon: MapPin },
    { id: "tours", label: "Virtual Tours", icon: Camera },
    { id: "archives", label: "Digital Archives", icon: Archive },
    { id: "calendar", label: "Cultural Calendar", icon: Calendar },
    { id: "audio", label: "Audio Guide", icon: Headphones },
  ];

  const handleNavigation = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsOpen(false);
  };

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      navigate("/auth");
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-card backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center mr-8">
          <OptimizedImage 
            src={gompixLogo} 
            alt="GOMPIX Logo" 
            className="w-20 h-12 object-contain"
            loading="eager"
            width={80}
            height={48}
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                onClick={() => handleNavigation(item.id)}
                className="flex items-center space-x-2 transition-all duration-200"
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{item.label}</span>
              </Button>
            );
          })}
          
          {/* Bus Scheduling */}
          <BusScheduling />
          
          {/* Auth Button */}
          <Button
            variant="outline"
            onClick={handleAuthAction}
            className="flex items-center space-x-2 ml-4 border-primary/20 hover:bg-primary/10 text-foreground"
          >
            {user ? (
              <>
                <User className="w-4 h-4" />
                <span>Profile</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </>
            )}
          </Button>
          
          {user && (
            <Button
              variant="ghost"
              onClick={() => signOut()}
              className="flex items-center space-x-2 text-destructive hover:text-destructive/80"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <div className="flex flex-col space-y-4 mt-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? "default" : "ghost"}
                    onClick={() => handleNavigation(item.id)}
                    className="flex items-center space-x-2 justify-start w-full transition-all duration-200"
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </Button>
                );
              })}
              
              {/* Mobile Bus Scheduling */}
              <div className="border-t border-border pt-4 mt-6">
                <BusScheduling />
              </div>
              
              {/* Mobile Auth Button */}
              <div className="border-t border-border pt-4 mt-2">
                <Button
                  variant="outline"
                  onClick={handleAuthAction}
                  className="flex items-center space-x-2 justify-start w-full border-foreground/20 text-foreground hover:bg-foreground/10"
                >
                  {user ? (
                    <>
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Login</span>
                    </>
                  )}
                </Button>
                
                {user && (
                  <Button
                    variant="ghost"
                    onClick={() => signOut()}
                    className="flex items-center space-x-2 justify-start w-full mt-2 text-destructive hover:text-destructive/80"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};