-- Create dummy blog data without user constraints for demo purposes
-- First, let's temporarily disable the foreign key constraint and insert data

-- Create some basic blogs without strict user references for demo
INSERT INTO public.blogs (title, content, excerpt, status, tags, featured_image, views_count) VALUES
('Exploring Ancient Monasteries of Sikkim', 
'Sikkim, nestled in the Eastern Himalayas, is home to some of the most magnificent and spiritually significant monasteries in the world. These sacred spaces, perched on mountainsides and hidden in valleys, offer glimpses into centuries-old Buddhist traditions and architectural marvels.

The journey through Sikkim''s monasteries begins with Rumtek Monastery, also known as the Dharma Chakra Centre. Built in the 1960s, this monastery serves as the seat of the 16th Karmapa and houses some of the world''s most sacred Buddhist relics.

Pemayangtse Monastery, meaning "Perfect Sublime Lotus," stands as one of the oldest monasteries in Sikkim. Founded in 1705, this three-story structure showcases traditional Sikkimese architecture.', 
'Discover the spiritual heritage and architectural wonders of Sikkim''s ancient monasteries.', 
'published', 
'{"Buddhism", "Monasteries", "Sikkim", "Heritage"}', 
'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=400&fit=crop', 
156),

('The Sacred Festivals of Himalayan Buddhism', 
'The Himalayan region comes alive during its sacred festivals, where ancient traditions blend with vibrant celebrations. These festivals are profound spiritual experiences that connect communities with their Buddhist heritage.

Losar, the Tibetan New Year, marks the most important celebration in the Buddhist calendar. Monasteries throughout Sikkim transform into centers of joy, with monks performing sacred Cham dances wearing elaborate masks and colorful robes.', 
'Experience the vibrant sacred festivals of Himalayan Buddhism and colorful ceremonies.', 
'published', 
'{"Festivals", "Buddhism", "Losar", "Culture"}', 
'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop', 
89),

('Hidden Gems: Lesser-Known Monasteries Worth Visiting', 
'Beyond the famous monasteries lie hidden gems that offer equally profound spiritual experiences without the crowds. These lesser-known sacred spaces provide intimate encounters with Buddhist culture.

Sang Choeling Monastery, built in 1697, stands as Sikkim''s second-oldest monastery. The trek through rhododendron forests is as rewarding as the destination itself.', 
'Discover Sikkim''s hidden monastic treasures away from the usual tourist trails.', 
'published', 
'{"Hidden Gems", "Monasteries", "Buddhism", "Travel"}', 
'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop', 
23),

('The Art of Thangka Painting in Monasteries', 
'Thangka painting represents one of the most sophisticated art forms in Tibetan Buddhism. In Sikkimese monasteries, this ancient tradition continues to thrive, preserving centuries-old techniques.

The creation of a thangka is both artistic endeavor and spiritual practice. Monks spend years mastering the precise proportions and sacred geometry that define these religious paintings.', 
'Explore the sacred art of thangka painting where ancient techniques meet spiritual devotion.', 
'published', 
'{"Art", "Thangka", "Monasteries", "Culture"}', 
'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=400&fit=crop', 
67),

('Meditation Practices in Mountain Monasteries', 
'High in the Himalayas, monasteries serve as perfect sanctuaries for meditation practice. The unique environment enhances the meditative experience in ways difficult to replicate elsewhere.

The daily rhythm begins before dawn with conch shells and drums echoing across valleys. The crisp mountain air and gradual emergence of light create perfect conditions for contemplation.', 
'Discover how mountain monasteries enhance meditation practices and spiritual development.', 
'draft', 
'{"Meditation", "Buddhism", "Spirituality"}', 
'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&h=400&fit=crop', 
5),

('Architectural Marvels of Sacred Spaces', 
'The construction of monasteries in challenging Himalayan terrain represents remarkable achievements in traditional engineering. These buildings must withstand harsh conditions while inspiring spiritual contemplation.

Traditional architecture follows ancient principles balancing functionality with spiritual symbolism. Three-story structures represent the three realms of Buddhist cosmology.', 
'Explore the ingenious solutions that make Himalayan monasteries structurally sound and spiritually inspiring.', 
'draft', 
'{"Architecture", "Monasteries", "Engineering"}', 
'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6b?w=800&h=400&fit=crop', 
2);