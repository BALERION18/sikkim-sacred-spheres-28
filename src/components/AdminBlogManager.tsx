import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, Edit, Trash2, Calendar, User } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  role: string;
  created_at: string;
  views_count: number;
  tags: string[];
  user_id: string;
  author_name?: string;
}

export const AdminBlogManager = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select(`
          id,
          title,
          excerpt,
          role,
          created_at,
          views_count,
          tags,
          user_id
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch author names for each blog
      const blogsWithAuthors = await Promise.all(
        (data || []).map(async (blog) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('id', blog.user_id)
            .single();
          
          return {
            ...blog,
            author_name: profile?.display_name || 'Unknown Author'
          };
        })
      );
      
      setBlogs(blogsWithAuthors);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch blogs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async () => {
    if (!blogToDelete) return;

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', blogToDelete);

      if (error) throw error;

      toast({
        title: "Blog Deleted",
        description: "The blog post has been successfully deleted.",
      });

      setBlogs(prev => prev.filter(blog => blog.id !== blogToDelete));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading blogs...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Blog Management</CardTitle>
        </CardHeader>
        <CardContent>
          {blogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No blogs found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {blogs.map((blog) => (
                <div key={blog.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{blog.title}</h3>
                        <Badge variant={blog.role === 'guide' ? 'default' : 'secondary'}>
                          {blog.role === 'guide' ? 'Guide Verified' : blog.role}
                        </Badge>
                      </div>
                      
                      {blog.excerpt && (
                        <p className="text-muted-foreground mb-3">{blog.excerpt}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {blog.author_name || 'Unknown Author'}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(blog.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {blog.views_count || 0} views
                        </span>
                      </div>
                      
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {blog.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setBlogToDelete(blog.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBlogToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBlog}>
              Delete Blog
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};