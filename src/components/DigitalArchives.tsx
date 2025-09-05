import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, Eye, Filter, BookOpen, FileImage, Scroll } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BlogSection } from "@/components/BlogSection";
import digitalArchivesHero from "@/assets/digital-archives-hero.jpg";

const archiveItems = [
  {
    id: 1,
    title: "Tibetan Buddhist Manuscripts",
    type: "manuscript",
    date: "17th Century",
    monastery: "Rumtek",
    description: "Ancient Sanskrit and Tibetan texts on Buddhist philosophy and meditation practices.",
    language: "Tibetan, Sanskrit",
    pages: 245,
    digitized: true,
    rarity: "Rare",
  },
  {
    id: 2,
    title: "Monastery Wall Paintings",
    type: "mural",
    date: "18th Century",
    monastery: "Pemayangtse",
    description: "Intricate mandala paintings and Buddha imagery from monastery walls.",
    language: "Visual",
    pages: 1,
    digitized: true,
    rarity: "Unique",
  },
  {
    id: 3,
    title: "Prayer Ritual Scrolls",
    type: "scroll",
    date: "19th Century", 
    monastery: "Enchey",
    description: "Traditional prayer scrolls used in daily monastery rituals and ceremonies.",
    language: "Tibetan",
    pages: 156,
    digitized: true,
    rarity: "Common",
  },
  {
    id: 4,
    title: "Historical Chronicles",
    type: "manuscript",
    date: "16th Century",
    monastery: "Tashiding",
    description: "Historical records of monastery founding and early Buddhist presence in Sikkim.",
    language: "Tibetan, Lepcha",
    pages: 89,
    digitized: true,
    rarity: "Very Rare",
  },
  {
    id: 5,
    title: "Thangka Paintings Collection",
    type: "artwork",
    date: "Various Periods",
    monastery: "Multiple",
    description: "Collection of sacred Thangka paintings depicting Buddhist deities and teachings.",
    language: "Visual",
    pages: 45,
    digitized: true,
    rarity: "Rare",
  },
  {
    id: 6,
    title: "Medicinal Plant Manuscripts",
    type: "manuscript",
    date: "18th Century",
    monastery: "Rumtek",
    description: "Traditional Tibetan medicine texts documenting medicinal plants found in Sikkim.",
    language: "Tibetan",
    pages: 178,
    digitized: true,
    rarity: "Rare",
  },
];

export const DigitalArchives = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredItems, setFilteredItems] = useState(archiveItems);
  const { toast } = useToast();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = archiveItems.filter(item =>
      item.title.toLowerCase().includes(term.toLowerCase()) ||
      item.description.toLowerCase().includes(term.toLowerCase()) ||
      item.monastery.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    const filtered = category === "all" 
      ? archiveItems 
      : archiveItems.filter(item => item.type === category);
    setFilteredItems(filtered);
  };

  const handleDownload = (item: typeof archiveItems[0]) => {
    toast({
      title: "Download Started",
      description: `Downloading ${item.title}`,
    });
  };

  const handleView = (item: typeof archiveItems[0]) => {
    toast({
      title: "Opening Archive",
      description: `Opening ${item.title} in viewer`,
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "manuscript": return <BookOpen className="w-4 h-4" />;
      case "mural": return <FileImage className="w-4 h-4" />;
      case "scroll": return <Scroll className="w-4 h-4" />;
      case "artwork": return <FileImage className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Very Rare": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Rare": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "Unique": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${digitalArchivesHero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Digital <span className="text-primary">Archives</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in">
            Preserving Sacred Knowledge for Future Generations
          </p>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto animate-fade-in">
            Explore our comprehensive collection of digitized manuscripts, murals, and artifacts from Sikkim's monasteries.
          </p>
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-primary rounded-full animate-float opacity-60" />
        <div className="absolute top-32 right-16 w-6 h-6 bg-primary-glow rounded-full animate-float opacity-40" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-accent rounded-full animate-float opacity-50" style={{ animationDelay: "2s" }} />
      </section>
      
      {/* Archives Content Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">

        <Tabs defaultValue="archives" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 bg-card/80 backdrop-blur-sm">
            <TabsTrigger value="archives" className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Historical Archives</TabsTrigger>
            <TabsTrigger value="blogs" className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Community Blogs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="archives" className="space-y-8">
            <div className="space-y-8">

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search archives by title, monastery, or description..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex space-x-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => handleCategoryFilter("all")}
            size="sm"
          >
            <Filter className="w-4 h-4 mr-2" />
            All
          </Button>
          <Button
            variant={selectedCategory === "manuscript" ? "default" : "outline"}
            onClick={() => handleCategoryFilter("manuscript")}
            size="sm"
          >
            Manuscripts
          </Button>
          <Button
            variant={selectedCategory === "mural" ? "default" : "outline"}
            onClick={() => handleCategoryFilter("mural")}
            size="sm"
          >
            Murals
          </Button>
          <Button
            variant={selectedCategory === "artwork" ? "default" : "outline"}
            onClick={() => handleCategoryFilter("artwork")}
            size="sm"
          >
            Artwork
          </Button>
        </div>
      </div>

      {/* Archive Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="glass-morphism">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{archiveItems.length}</div>
            <div className="text-sm text-muted-foreground">Total Items</div>
          </CardContent>
        </Card>
        <Card className="glass-morphism">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {archiveItems.reduce((sum, item) => sum + item.pages, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Pages</div>
          </CardContent>
        </Card>
        <Card className="glass-morphism">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">6</div>
            <div className="text-sm text-muted-foreground">Monasteries</div>
          </CardContent>
        </Card>
        <Card className="glass-morphism">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">100%</div>
            <div className="text-sm text-muted-foreground">Digitized</div>
          </CardContent>
        </Card>
      </div>

      {/* Archive Items */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="group hover:shadow-heritage transition-all duration-300 glass-morphism">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(item.type)}
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
                <Badge className={getRarityColor(item.rarity)}>
                  {item.rarity}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{item.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monastery:</span>
                  <span className="font-medium">{item.monastery}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Period:</span>
                  <span>{item.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Language:</span>
                  <span>{item.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pages:</span>
                  <span>{item.pages}</span>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button 
                  size="sm" 
                  onClick={() => handleView(item)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDownload(item)}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No archives found matching your search criteria.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setFilteredItems(archiveItems);
              }}
              className="mt-4 border-foreground/20 text-foreground hover:bg-foreground/10"
            >
              Clear Filters
            </Button>
          </div>
        )}
        </div>
      </TabsContent>
      
      <TabsContent value="blogs">
        <BlogSection />
      </TabsContent>
    </Tabs>
        </div>
      </section>
    </div>
  );
};