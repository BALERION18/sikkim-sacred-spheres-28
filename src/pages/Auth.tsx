import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Loader2, Eye, EyeOff, Upload, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import mountainAuthBg from "@/assets/mountain-auth-bg.jpg";

const Auth = () => {
  // User login/register states
  const [userIsLogin, setUserIsLogin] = useState(true);
  const [userUsername, setUserUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userShowPassword, setUserShowPassword] = useState(false);

  // Admin login states
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminShowPassword, setAdminShowPassword] = useState(false);

  // Guide registration states
  const [guideName, setGuideName] = useState("");
  const [guideEmail, setGuideEmail] = useState("");
  const [guidePassword, setGuidePassword] = useState("");
  const [guideGender, setGuideGender] = useState("");
  const [guideKycFile, setGuideKycFile] = useState<File | null>(null);
  const [guideShowPassword, setGuideShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleUserAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (userIsLogin) {
        // Sign in existing user
        const { error } = await supabase.auth.signInWithPassword({
          email: userEmail,
          password: userPassword,
        });
        
        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "You have been successfully signed in.",
        });
      } else {
        // Register new user
        const { error } = await supabase.auth.signUp({
          email: userEmail,
          password: userPassword,
          options: {
            data: {
              username: userUsername,
            }
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In real implementation, this would check admin credentials via Supabase
      if (adminEmail === "admin@gompix.com" && adminPassword === "admin123") {
        toast({
          title: "Admin Login Successful",
          description: "Redirecting to admin panel...",
        });
        
        // Simulate successful admin login and redirect
        setTimeout(() => {
          navigate("/admin");
        }, 1000);
      } else {
        throw new Error("Invalid admin credentials");
      }
    } catch (error: any) {
      toast({
        title: "Admin Login Error",
        description: error.message || "Invalid admin credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuideAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In real implementation, this would register guide via Supabase with KYC verification
      if (guideName && guideEmail && guidePassword && guideGender && guideKycFile) {
        toast({
          title: "Guide Registration Submitted",
          description: "Redirecting to guide panel... (KYC verification pending)",
        });
        
        // Simulate successful guide registration and redirect
        setTimeout(() => {
          navigate("/guide");
        }, 1000);
      } else {
        throw new Error("Please fill all required fields");
      }
    } catch (error: any) {
      toast({
        title: "Guide Registration Error", 
        description: error.message || "Please complete all required fields",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKycFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGuideKycFile(file);
    }
  };

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Hero Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${mountainAuthBg})` }}
      />
      <div className="absolute inset-0 bg-white/20" />
      
      {/* Back to Home Button */}
      <Button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-20 bg-card/90 backdrop-blur-md border-2 border-primary/20 text-foreground hover:bg-primary hover:text-primary-foreground shadow-lg"
        variant="outline"
        size="sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>
      
      <Card className="w-full max-w-lg shadow-2xl relative z-10 bg-card/95 backdrop-blur-md border-2 border-primary/20">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Welcome to GOMPIX
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            Choose your login type to access the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/80 p-1 rounded-lg">
              <TabsTrigger 
                value="user" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-medium transition-all"
              >
                User
              </TabsTrigger>
              <TabsTrigger 
                value="admin" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-medium transition-all"
              >
                Admin
              </TabsTrigger>
              <TabsTrigger 
                value="guide" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-medium transition-all"
              >
                Guide
              </TabsTrigger>
            </TabsList>

            {/* User Login/Register Tab */}
            <TabsContent value="user" className="space-y-6 mt-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {userIsLogin ? "User Login" : "Create Account"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {userIsLogin ? "Welcome back! Please sign in to continue." : "Join us to explore Sikkim's monasteries"}
                </p>
              </div>
              
              <form onSubmit={handleUserAuth} className="space-y-5">
                  {!userIsLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="userUsername" className="text-foreground font-medium">Username</Label>
                      <Input
                        id="userUsername"
                        type="text"
                        placeholder="Enter your username"
                        value={userUsername}
                        onChange={(e) => setUserUsername(e.target.value)}
                        required={!userIsLogin}
                        className="w-full h-11 border-2 border-border/50 focus:border-primary bg-background"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="userEmail" className="text-foreground font-medium">Email</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      placeholder="Enter your email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      required
                      className="w-full h-11 border-2 border-border/50 focus:border-primary bg-background"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="userPassword" className="text-foreground font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="userPassword"
                        type={userShowPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        required
                        className="w-full h-11 pr-12 border-2 border-border/50 focus:border-primary bg-background"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-9 w-9 hover:bg-muted"
                        onClick={() => setUserShowPassword(!userShowPassword)}
                      >
                        {userShowPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200" 
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    {userIsLogin ? "Sign In" : "Create Account"}
                  </Button>
                </form>

                <div className="text-center pt-4 border-t border-border/50">
                  <p className="text-sm text-muted-foreground mb-2">
                    {userIsLogin ? "Don't have an account?" : "Already have an account?"}
                  </p>
                  <Button
                    variant="link"
                    onClick={() => {
                      setUserIsLogin(!userIsLogin);
                      setUserUsername("");
                      setUserEmail("");
                      setUserPassword("");
                    }}
                    className="p-0 h-auto font-semibold text-primary hover:text-primary/80 text-base"
                  >
                    {userIsLogin ? "Register here" : "Sign in here"}
                  </Button>
                </div>
            </TabsContent>

            {/* Admin Login Tab */}
            <TabsContent value="admin" className="space-y-6 mt-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-2">Admin Access</h3>
                <p className="text-sm text-muted-foreground">
                  Administrative portal for platform management
                </p>
              </div>
              
              <form onSubmit={handleAdminAuth} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="adminEmail" className="text-foreground font-medium">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    placeholder="Enter admin email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                    className="w-full h-11 border-2 border-border/50 focus:border-primary bg-background"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adminPassword" className="text-foreground font-medium">Admin Password</Label>
                  <div className="relative">
                    <Input
                      id="adminPassword"
                      type={adminShowPassword ? "text" : "password"}
                      placeholder="Enter admin password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                      className="w-full h-11 pr-12 border-2 border-border/50 focus:border-primary bg-background"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-9 w-9 hover:bg-muted"
                      onClick={() => setAdminShowPassword(!adminShowPassword)}
                    >
                      {adminShowPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200" 
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  Access Admin Panel
                </Button>
              </form>
            </TabsContent>

            {/* Guide Registration Tab */}
            <TabsContent value="guide" className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-foreground">Guide Registration</h3>
              </div>
              
              <form onSubmit={handleGuideAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="guideName" className="text-foreground">Full Name</Label>
                  <Input
                    id="guideName"
                    type="text"
                    placeholder="Enter your full name"
                    value={guideName}
                    onChange={(e) => setGuideName(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="guideEmail" className="text-foreground">Email</Label>
                  <Input
                    id="guideEmail"
                    type="email"
                    placeholder="Enter your email"
                    value={guideEmail}
                    onChange={(e) => setGuideEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="guidePassword" className="text-foreground">Password</Label>
                  <div className="relative">
                    <Input
                      id="guidePassword"
                      type={guideShowPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={guidePassword}
                      onChange={(e) => setGuidePassword(e.target.value)}
                      required
                      className="w-full pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setGuideShowPassword(!guideShowPassword)}
                    >
                      {guideShowPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Gender</Label>
                  <RadioGroup
                    value={guideGender}
                    onValueChange={setGuideGender}
                    className="flex flex-row space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="M" id="male" />
                      <Label htmlFor="male" className="text-foreground">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="F" id="female" />
                      <Label htmlFor="female" className="text-foreground">Female</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kycDocument" className="text-foreground">E-KYC Document</Label>
                  <div className="border-2 border-dashed border-border rounded-md p-4 bg-muted/50">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <div className="text-sm text-foreground mb-2">
                        {guideKycFile ? guideKycFile.name : "Upload your KYC document"}
                      </div>
                      <Input
                        id="kycDocument"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleKycFileChange}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('kycDocument')?.click()}
                      >
                        Choose File
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Accepted formats: PDF, JPG, PNG (Max 5MB)
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200" 
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  Submit Guide Application
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;