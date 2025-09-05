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
  const { user, userRole, signInWithEmail, signUpWithEmail, signInWithProvider } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to their dashboards
  useEffect(() => {
    if (user && userRole) {
      switch (userRole) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'guide':
          navigate('/guide/dashboard');
          break;
        case 'user':
          navigate('/user/home');
          break;
        default:
          navigate('/');
          break;
      }
    }
  }, [user, userRole, navigate]);

  const handleUserAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (userIsLogin) {
        // Sign in existing user
        const { error } = await signInWithEmail(userEmail, userPassword);
        
        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "You have been successfully signed in.",
        });
        
        navigate("/");
      } else {
        // Register new user
        const { error } = await signUpWithEmail(userEmail, userPassword, {
          username: userUsername,
          full_name: userUsername
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
      if (!guideName || !guideEmail || !guidePassword || !guideGender || !guideKycFile) {
        throw new Error("Please fill all required fields");
      }

      // Upload KYC document first
      const fileExt = guideKycFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${guideEmail}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(filePath, guideKycFile);

      if (uploadError) throw uploadError;

      // Register guide user
      const { error: authError } = await signUpWithEmail(guideEmail, guidePassword, {
        full_name: guideName,
        gender: guideGender,
        kyc_document_url: uploadData.path
      });

      if (authError) throw authError;

      // Insert guide role and update profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Update user role to guide
        await supabase.from('user_roles').update({ role: 'guide' }).eq('user_id', user.id);
        
        // Update profile with guide-specific data
        await supabase.from('profiles').update({
          full_name: guideName,
          gender: guideGender,
          kyc_document_url: uploadData.path,
          kyc_status: 'pending'
        }).eq('id', user.id);
      }

      toast({
        title: "Guide Registration Submitted",
        description: "KYC verification is pending. You'll be notified once approved.",
      });
      
      navigate("/guide");
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

                {/* Social Login Options */}
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <p className="text-center text-sm text-muted-foreground">
                    Or continue with
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => signInWithProvider('google')}
                      disabled={loading}
                      className="h-10"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => signInWithProvider('github')}
                      disabled={loading}
                      className="h-10"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => signInWithProvider('twitter')}
                      disabled={loading}
                      className="h-10"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </Button>
                  </div>
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