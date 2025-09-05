import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  User,
  MapPin,
  LogOut,
  Plus,
  Heart,
  MessageCircle,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  created_at: string;
  views_count: number;
  tags: string[];
}

const UserDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userBlogs, setUserBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchUserBlogs();
  }, [user, navigate]);

  const fetchUserBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, excerpt, created_at, views_count, tags')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserBlogs(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch your blogs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">User Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back!</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="hidden sm:inline-flex">
              <User className="w-3 h-3 mr-1" />
              User
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
                  <p className="text-sm text-muted-foreground">My Blogs</p>
                  <p className="text-3xl font-bold text-primary">{userBlogs.length}</p>
                </div>
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="text-3xl font-bold text-accent">
                    {userBlogs.reduce((sum, blog) => sum + (blog.views_count || 0), 0)}
                  </p>
                </div>
                <Heart className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="text-xl font-bold text-secondary">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="blogs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="blogs">My Blogs</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Blogs Management */}
          <TabsContent value="blogs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>My Blog Posts</span>
                  <Button size="sm" onClick={() => navigate("/blog/create")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Write Blog
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading your blogs...</p>
                  </div>
                ) : userBlogs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>You haven't written any blogs yet</p>
                    <p className="text-sm mt-2">Start sharing your thoughts with the community!</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => navigate("/blog/create")}
                    >
                      Write Your First Blog
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userBlogs.map((blog) => (
                      <div key={blog.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{blog.title}</h3>
                            {blog.excerpt && (
                              <p className="text-muted-foreground mb-3">{blog.excerpt}</p>
                            )}
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                              <span className="flex items-center">
                                <Heart className="w-4 h-4 mr-1" />
                                {blog.views_count || 0} views
                              </span>
                            </div>
                            {blog.tags && blog.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {blog.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">User ID</label>
                    <p className="text-muted-foreground font-mono text-xs">{user.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Account Created</label>
                    <p className="text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;