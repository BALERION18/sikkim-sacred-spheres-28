import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Map, 
  BookOpen, 
  Camera, 
  Calendar,
  BarChart3, 
  User,
  MapPin,
  LogOut,
  Plus,
  Edit,
  Star,
  MessageCircle,
  Headphones
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GuidePanel = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [totalTours, setTotalTours] = useState(23);
  const [avgRating, setAvgRating] = useState(4.8);
  const [monthlyBookings, setMonthlyBookings] = useState(67);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-card border-b border-border p-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Map className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Guide Panel</h1>
              <p className="text-sm text-muted-foreground">GOMPIX Guide Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="hidden sm:inline-flex">
              <User className="w-3 h-3 mr-1" />
              Tour Guide
            </Badge>
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="hidden sm:inline-flex"
            >
              <MapPin className="w-4 h-4 mr-2" />
              View Site
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-morphism">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tours</p>
                  <p className="text-3xl font-bold text-primary">{totalTours}</p>
                </div>
                <Map className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                  <p className="text-3xl font-bold text-accent">{avgRating}</p>
                </div>
                <Star className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Bookings</p>
                  <p className="text-3xl font-bold text-secondary">{monthlyBookings}</p>
                </div>
                <Calendar className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="tours" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tours">My Tours</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Tours Management */}
          <TabsContent value="tours">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Tour Management</span>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Tour
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Map className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Tour management functionality requires Supabase integration</p>
                  <p className="text-sm mt-2">Connect to Supabase to create and manage your guided tours</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Management */}
          <TabsContent value="content">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Blog Posts</span>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Write Blog
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Blog management functionality requires Supabase integration</p>
                    <p className="text-sm mt-2">Connect to Supabase to write and manage your blog posts</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Audio Guides</span>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Upload Audio
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Headphones className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Audio guide management requires Supabase integration</p>
                    <p className="text-sm mt-2">Connect to Supabase to upload and manage audio guides</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Photo Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Photo gallery management requires Supabase integration</p>
                    <p className="text-sm mt-2">Connect to Supabase to upload and organize your tour photos</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Tour Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Booking management functionality requires Supabase integration</p>
                  <p className="text-sm mt-2">Connect to Supabase to manage tour bookings and schedules</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Guide Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Profile management requires Supabase integration</p>
                  <p className="text-sm mt-2">Connect to Supabase to update your profile and credentials</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GuidePanel;