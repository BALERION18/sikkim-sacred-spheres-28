import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Eye, Heart, MessageCircle, Search, Tag, User, Loader2, Trash2 } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
interface BlogData {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  media_url: string[] | null;
  tags: string[] | null;
  status: string | null;
  views_count: number | null;
  created_at: string;
  user_id: string;
  role: string | null;
}
const BlogSection = () => {
  const [selectedBlog, setSelectedBlog] = useState<BlogData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, userRole } = useAuth();

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .not('title', 'is', null)
        .not('content', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error: any) {
      toast({
        title: "Error Loading Blogs",
        description: error.message || "Failed to load blog posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to delete blogs",
        variant: "destructive",
      });
      return;
    }

    // Confirm deletion
    if (!confirm("Are you sure you want to delete this blog? This action cannot be undone.")) {
      return;
    }

    setDeletingBlogId(blogId);
    
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', blogId);

      if (error) throw error;

      // Remove from local state
      setBlogs(blogs.filter(blog => blog.id !== blogId));
      
      toast({
        title: "Blog Deleted",
        description: "The blog post has been successfully deleted",
      });
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete blog post",
        variant: "destructive",
      });
    } finally {
      setDeletingBlogId(null);
    }
  };

  const canDeleteBlog = (blog: BlogData) => {
    if (!user) return false;
    return blog.user_id === user.id || userRole === 'admin';
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const dummyBlogs: BlogData[] = [{
    id: '1',
    title: 'Dawn Prayers at Rumtek Monastery: A Soul-Stirring Experience',
    content: 'The first light of dawn was just breaking over the mountains when I made my way to Rumtek Monastery for the morning prayers. The cool mountain air carried the distant sound of conch shells and deep Tibetan horns, signaling the beginning of another day of spiritual practice.\n\nInside the main prayer hall, the atmosphere was electric with devotion. Rows of monks in their maroon robes sat cross-legged on cushions, their voices harmonizing in ancient chants that seemed to vibrate through every fiber of my being. The flickering butter lamps cast dancing shadows on the elaborate murals depicting scenes from Buddha\'s life, creating an otherworldly ambiance.\n\nWhat struck me most was the profound sense of peace that enveloped the entire space. Despite being a tourist, I felt welcomed into this sacred ritual. The rhythmic chanting, the gentle ring of bells, and the sweet fragrance of incense created a meditative atmosphere that stayed with me long after I left.\n\nThis experience taught me that spirituality transcends language and cultural barriers. In that prayer hall, surrounded by centuries of tradition, I found a deeper connection to something greater than myself.',
    excerpt: 'Join the sacred dawn prayers at Rumtek Monastery and discover how ancient Tibetan Buddhist traditions can touch your soul and transform your spiritual perspective.',
    featured_image: '/lovable-uploads/monastery-1.jpg',
    media_url: ['/lovable-uploads/monastery-1.jpg', '/lovable-uploads/monastery-2.jpg'],
    tags: ['rumtek', 'monastery', 'prayer', 'spirituality', 'tibet', 'meditation', 'buddhism', 'sikkim'],
    status: 'published',
    views_count: 1247,
    created_at: '2024-12-15T05:30:00Z',
    user_id: 'user1',
    role: 'user'
  }, {
    id: '2',
    title: 'The Living Art of Pemayangtse: Where Faith Meets Craftsmanship',
    content: 'Nestled in the hills of West Sikkim, Pemayangtse Monastery is home to one of the most extraordinary displays of religious art I\'ve ever witnessed. The monastery, whose name means "Perfect Sublime Lotus," lives up to its name in every intricate detail of its sacred artwork.\n\nThe highlight of my visit was the seven-tiered wooden sculpture called "Zangdok Palri" (Copper-Colored Mountain), crafted entirely by the late Dungzin Rimpoche. This masterpiece depicts Guru Rinpoche\'s celestial paradise and took five years to complete. Every figure, every architectural detail, and every landscape element tells a story from Tibetan Buddhist cosmology.\n\nI spent hours studying the Thangka paintings that adorned the walls. Each scroll painting is a meditation in itself, with precise geometric patterns and symbolic colors that represent different aspects of enlightenment. The deep blues representing infinite space, the fiery reds of transformation, and the pure whites of wisdom created a visual symphony of spiritual meaning.\n\nThe monks were incredibly gracious, explaining the significance of various symbols and sharing stories passed down through generations. Their dedication to preserving these art forms while maintaining their spiritual significance was truly inspiring.\n\nLeaving Pemayangtse, I realized I had witnessed not just art, but living expressions of faith that have guided seekers for centuries.',
    excerpt: 'Explore the magnificent religious artworks of Pemayangtse Monastery, where every painting and sculpture serves as a gateway to Buddhist wisdom and spiritual understanding.',
    featured_image: '/lovable-uploads/monastery-2.jpg',
    media_url: ['/lovable-uploads/monastery-2.jpg', '/lovable-uploads/monastery-3.jpg', '/lovable-uploads/monastery-1.jpg'],
    tags: ['pemayangtse', 'art', 'thangka', 'buddhist-art', 'sikkim', 'culture', 'tradition', 'craftsmanship'],
    status: 'published',
    views_count: 892,
    created_at: '2024-12-10T14:45:00Z',
    user_id: 'user2',
    role: 'guide'
  }, {
    id: '3',
    title: 'Enchey Monastery During Losar: A Festival That Changed My Life',
    content: 'Nothing could have prepared me for the spectacular celebration of Losar (Tibetan New Year) at Enchey Monastery in Gangtok. What I thought would be a simple cultural observation turned into a life-changing immersion into the heart of Tibetan Buddhist community life.\n\nThe festival began three days before the official New Year with elaborate preparations. I watched families arrive from remote villages, their traditional chubas (robes) adorned with turquoise jewelry and intricate brocade. The monastery courtyard, usually a place of quiet contemplation, transformed into a vibrant hub of laughter, storytelling, and shared meals.\n\nThe highlight was the Cham dance performed by the monks. Dressed in elaborate costumes and painted masks representing various deities and demons, they moved with fluid grace that seemed to blur the line between performance and prayer. Each gesture carried profound meaning - the triumph of good over evil, the protection of dharma, and the blessings for the coming year.\n\nWhat moved me most was the sense of inclusivity. Despite being an outsider, families invited me to share their butter tea and momos. Children taught me basic Tibetan phrases while elders shared stories of their homeland. In those moments, I understood that this wasn\'t just a festival - it was a celebration of human connection and shared hope.\n\nAs the ceremonial horns announced the arrival of the New Year, I found myself surrounded by a thousand prayer flags fluttering in the mountain breeze, each one carrying wishes for peace and happiness for all beings. It was a moment of pure magic that redefined my understanding of community and compassion.',
    excerpt: 'Experience the magical celebration of Losar at Enchey Monastery, where ancient traditions, vibrant dances, and warm community spirit create unforgettable memories.',
    featured_image: '/lovable-uploads/monastery-3.jpg',
    media_url: ['/lovable-uploads/monastery-3.jpg', '/lovable-uploads/monastery-1.jpg', '/lovable-uploads/monastery-2.jpg'],
    tags: ['enchey', 'losar', 'festival', 'tibetan-new-year', 'community', 'celebration', 'gangtok', 'tradition', 'culture'],
    status: 'published',
    views_count: 634,
    created_at: '2024-12-05T16:20:00Z',
    user_id: 'user3',
    role: 'user'
  }, {
    id: '4',
    title: 'Silent Meditation Retreat at Tashiding: Finding Inner Peace',
    content: 'Perched on a hilltop at the confluence of the Rathong and Rangeet rivers, Tashiding Monastery offered me something I didn\'t even know I was seeking - complete silence and profound inner peace.\n\nI joined a week-long meditation retreat led by Lama Tenzin, a gentle teacher who had spent decades in contemplative practice. Each day began at 4 AM with sitting meditation in the main hall, where the only sounds were our collective breathing and the distant call of mountain birds.\n\nThe monastery\'s location is breathtaking - surrounded by rhododendron forests and overlooking the Kanchenjunga range. During walking meditation sessions, I would slowly pace along mountain paths, feeling completely connected to the natural world. The simplicity of each step, each breath, became a gateway to deeper awareness.\n\nWhat surprised me most was how challenging and rewarding the silence was. Without the constant chatter of daily life, I began to hear the subtle whispers of my own heart. Old anxieties surfaced and dissolved, replaced by a clarity I had never experienced before.\n\nThe retreat culminated with a blessing ceremony at the sacred Bumchu (holy water) shrine. Lama Tenzin explained that the water level in the pot predicts the year ahead for the region. As I received the blessing, I felt a profound sense of gratitude and interconnectedness with all life.\n\nReturning to the world after this retreat, I carried with me a precious gift - the understanding that peace is not something to be found externally, but something to be cultivated within.',
    excerpt: 'Discover the transformative power of silent meditation retreat at Tashiding Monastery, where ancient practices guide you toward inner peace and spiritual awakening.',
    featured_image: '/lovable-uploads/monastery-1.jpg',
    media_url: ['/lovable-uploads/monastery-1.jpg', '/lovable-uploads/monastery-3.jpg'],
    tags: ['tashiding', 'meditation', 'silence', 'retreat', 'mindfulness', 'inner-peace', 'spirituality', 'mountain'],
    status: 'published',
    views_count: 445,
    created_at: '2024-11-28T08:15:00Z',
    user_id: 'user4',
    role: 'user'
  }, {
    id: '5',
    title: 'Photography Journey Through Hidden Monasteries of Sikkim',
    content: 'As a photographer drawn to spiritual subjects, my month-long journey through Sikkim\'s lesser-known monasteries revealed a treasure trove of visual stories waiting to be told.\n\nMy adventure began at Dubdi Monastery, Sikkim\'s oldest, where morning mist created ethereal silhouettes of ancient stupas. The play of light and shadow on weathered stone walls told stories of centuries past. I spent hours capturing the interplay between nature and architecture, where prayer flags created bursts of color against the monochromatic mountain landscape.\n\nAt Ralang Monastery, I witnessed the preparation of sacred sand mandalas. Through my macro lens, I captured the intricate process as monks used colored sand to create temporary masterpieces. The concentration on their faces, the precision of their movements, and the vibrant patterns emerging grain by grain - each image became a meditation on impermanence and beauty.\n\nThe remote Yangchen Monastery offered the most challenging but rewarding shoot. After a three-hour trek through rhododendron forests, I arrived to find monks engaged in philosophical debates in the courtyard. Their animated gestures, traditional robes flowing in mountain winds, and the dramatic backdrop of snow-capped peaks created some of my most powerful images.\n\nWhat struck me throughout this journey was how photography became a form of prayer. Each frame was an offering, a way of honoring the sacred spaces and devoted practitioners who welcomed me with such warmth.\n\nThese images now serve as windows for others to glimpse the profound beauty and spirituality that thrives in Sikkim\'s hidden monasteries.',
    excerpt: 'Join a visual journey through Sikkim\'s hidden monasteries, where photography becomes prayer and every frame captures the essence of Himalayan spirituality.',
    featured_image: '/lovable-uploads/monastery-2.jpg',
    media_url: ['/lovable-uploads/monastery-2.jpg', '/lovable-uploads/monastery-1.jpg', '/lovable-uploads/monastery-3.jpg'],
    tags: ['photography', 'hidden-monasteries', 'sikkim', 'visual-story', 'spiritual-photography', 'himalayas', 'dubdi', 'ralang'],
    status: 'published',
    views_count: 723,
    created_at: '2024-11-20T12:00:00Z',
    user_id: 'user5',
    role: 'guide'
  }];

  // Combine real blogs with dummy blogs for demo purposes
  const allBlogs = [...blogs, ...dummyBlogs];
  
  const filteredBlogs = allBlogs.filter(blog => {
    const matchesSearch = searchTerm === '' || 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      blog.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesTags = selectedTags.length === 0 || 
      (blog.tags && selectedTags.some(selectedTag => blog.tags!.includes(selectedTag)));
    return matchesSearch && matchesTags;
  });
  const allTags = Array.from(new Set(allBlogs.flatMap(blog => blog.tags || [])));
  const handleView = (blog: BlogData) => {
    setSelectedBlog(blog);
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-foreground">Community Blog</h2>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
          Discover inspiring stories, spiritual insights, and travel experiences from fellow monastery visitors
        </p>
        
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search blogs..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {allTags.slice(0, 10).map(tag => <Button key={tag} variant={selectedTags.includes(tag) ? "default" : "outline"} size="sm" onClick={() => {
          if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
          } else {
            setSelectedTags([...selectedTags, tag]);
          }
        }} className="text-sm">
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </Button>)}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map(blog => <Card key={blog.id} className="group hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm">
            <div className="aspect-video overflow-hidden rounded-t-lg">
              <OptimizedImage 
                src={blog.featured_image || (blog.media_url && blog.media_url[0]) || '/lovable-uploads/monastery-1.jpg'} 
                alt={blog.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                loading="lazy" 
                width={400} 
                height={225} 
              />
            </div>
            <CardHeader>
              <CardTitle className="text-lg text-foreground line-clamp-2">{blog.title}</CardTitle>
              <div className="flex items-center space-x-2 text-sm text-foreground/70">
                <User className="w-4 h-4" />
                <span>Anonymous</span>
                <Calendar className="w-4 h-4 ml-2" />
                <span>{new Date(blog.created_at).toLocaleDateString()}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-foreground/80 line-clamp-3">
                {blog.excerpt || blog.content.substring(0, 150) + '...'}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {blog.role === 'guide' && (
                  <Badge variant="default" className="text-xs bg-primary text-primary-foreground">
                    Guide Verified
                  </Badge>
                )}
                {(blog.tags || []).slice(0, 3).map((tag, index) => <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>)}
                {(blog.tags || []).length > 3 && <Badge variant="secondary" className="text-xs">
                    +{(blog.tags || []).length - 3}
                  </Badge>}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-4 text-sm text-foreground/70">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{blog.views_count || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{Math.floor((blog.views_count || 0) * 0.1)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{Math.floor((blog.views_count || 0) * 0.05)}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {canDeleteBlog(blog) && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBlog(blog.id);
                      }}
                      disabled={deletingBlogId === blog.id}
                      className="flex items-center space-x-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      {deletingBlogId === blog.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <span>Delete</span>
                      )}
                    </Button>
                  )}
                  
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => handleView(blog)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Read More
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-background">
                    <DialogHeader className="space-y-4 pb-6 border-b border-border">
                      <DialogTitle className="text-2xl font-bold text-foreground leading-tight">
                        {blog.title}
                      </DialogTitle>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/70">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Anonymous</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span>{blog.views_count || 0} views</span>
                        </div>
                        {blog.role === 'guide' && (
                          <Badge variant="default" className="text-xs bg-primary text-primary-foreground">
                            Guide Verified
                          </Badge>
                        )}
                      </div>
                    </DialogHeader>

                    <div className="py-6 space-y-8">
                      <div className="aspect-video max-w-2xl mx-auto overflow-hidden rounded-lg shadow-md">
                        <OptimizedImage 
                          src={blog.featured_image || (blog.media_url && blog.media_url[0]) || '/lovable-uploads/monastery-1.jpg'} 
                          alt={blog.title} 
                          className="w-full h-full object-cover" 
                          loading="eager" 
                          width={600} 
                          height={337} 
                        />
                      </div>

                      <div className="prose prose-slate max-w-none text-foreground">
                        <div className="text-lg leading-relaxed whitespace-pre-wrap font-medium text-foreground/90">
                          {blog.content}
                        </div>
                      </div>

                      {(blog.media_url && blog.media_url.length > 1) && <div className="space-y-6 pt-8 border-t border-border">
                          <h4 className="text-lg font-semibold text-foreground">Additional Media</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {blog.media_url.slice(1).map((mediaUrl, index) => <div key={index} className="space-y-3">
                                <div className="aspect-video overflow-hidden rounded-lg shadow-md">
                                  <OptimizedImage src={mediaUrl} alt={`Blog media ${index + 2}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" loading="lazy" width={400} height={225} />
                                </div>
                              </div>)}
                          </div>
                        </div>}
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {(blog.tags || []).map((tag, index) => <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>)}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>)}
      </div>

      {filteredBlogs.length === 0 && <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-foreground mb-2">No blogs found</h3>
          <p className="text-foreground/70">Try adjusting your search or filter criteria</p>
        </div>}
    </div>;
};
export default BlogSection;
export { BlogSection };