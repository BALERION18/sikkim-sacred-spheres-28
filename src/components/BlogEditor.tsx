import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Upload, X, Image, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const BlogEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  
  const { toast } = useToast();
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate files
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const sizeLimit = isVideo ? 20 * 1024 * 1024 : 5 * 1024 * 1024; // 20MB for videos, 5MB for images
      
      if (!isImage && !isVideo) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not a valid image or video file.`,
          variant: "destructive",
        });
        return false;
      }
      
      if (file.size > sizeLimit) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds the size limit (${isVideo ? '20MB' : '5MB'}).`,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });
    
    setMediaFiles(prev => [...prev, ...validFiles]);
  };

  const removeMediaFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaUrls(prev => prev.filter((_, i) => i !== index));
  };

  const uploadMediaFiles = async () => {
    if (mediaFiles.length === 0) return [];
    
    setUploadingMedia(true);
    const uploadedUrls: string[] = [];
    
    try {
      for (const file of mediaFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user!.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('blog-media')
          .upload(fileName, file);
        
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from('blog-media')
          .getPublicUrl(data.path);
        
        uploadedUrls.push(publicUrl);
      }
      
      return uploadedUrls;
    } catch (error: any) {
      toast({
        title: "Media Upload Error",
        description: error.message || "Failed to upload media files",
        variant: "destructive",
      });
      throw error;
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a blog post.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Upload media files first
      const uploadedMediaUrls = await uploadMediaFiles();
      
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      
      const { error } = await supabase
        .from('blogs')
        .insert({
          title,
          content,
          excerpt,
          tags: tagsArray,
          user_id: user.id,
          role: userRole || 'user',
          media_url: uploadedMediaUrls,
          status: 'published'
        });

      if (error) throw error;

      toast({
        title: "Blog Published!",
        description: "Your blog post has been successfully published.",
      });

      // Reset form
      setTitle("");
      setContent("");
      setExcerpt("");
      setTags("");
      setMediaFiles([]);
      setMediaUrls([]);
      
      // Redirect to home page
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Publishing Error",
        description: error.message || "Failed to publish blog post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to create a blog post
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate("/auth")} 
              className="w-full"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="sm"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-3xl font-bold text-foreground">Create Blog Post</h1>
          <p className="text-muted-foreground">Share your thoughts with the community</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Write Your Blog</CardTitle>
            <CardDescription>
              Fill in the details below to create your blog post
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter your blog title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="A brief description of your blog post"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your blog content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={12}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  type="text"
                  placeholder="Enter tags separated by commas (e.g., travel, monastery, sikkim)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Media Files</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload images (JPG, PNG up to 5MB) or videos (MP4 up to 20MB)
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingMedia}
                    >
                      Choose Files
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleMediaUpload}
                      className="hidden"
                    />
                  </div>
                  
                  {mediaFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium">Selected Files:</p>
                      {mediaFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                          <div className="flex items-center space-x-2">
                            {file.type.startsWith('image/') ? (
                              <Image className="h-4 w-4" />
                            ) : (
                              <Video className="h-4 w-4" />
                            )}
                            <span className="text-sm">{file.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {(file.size / 1024 / 1024).toFixed(1)}MB
                            </Badge>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMediaFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={loading || uploadingMedia}
                  className="flex-1"
                >
                  {(loading || uploadingMedia) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {userRole === 'guide' && (
                    <Badge variant="secondary" className="mr-2">Guide Verified</Badge>
                  )}
                  Publish Blog
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogEditor;