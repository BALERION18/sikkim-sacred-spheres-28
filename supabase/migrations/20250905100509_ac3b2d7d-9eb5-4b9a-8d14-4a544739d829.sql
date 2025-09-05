-- Create blogs table
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  tags TEXT[] DEFAULT '{}',
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Create policies for blogs
CREATE POLICY "Anyone can view published blogs" 
ON public.blogs 
FOR SELECT 
USING (status = 'published');

CREATE POLICY "Users can view their own blogs" 
ON public.blogs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own blogs" 
ON public.blogs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own blogs" 
ON public.blogs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blogs" 
ON public.blogs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);

-- Create policies for blog image uploads
CREATE POLICY "Anyone can view blog images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'blog-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own blog images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'blog-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own blog images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'blog-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create bus routes table
CREATE TABLE public.bus_routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  route_name TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  duration_minutes INTEGER,
  price DECIMAL(10,2) NOT NULL,
  available_seats INTEGER DEFAULT 40,
  bus_type TEXT DEFAULT 'regular' CHECK (bus_type IN ('regular', 'deluxe', 'ac')),
  operating_days TEXT[] DEFAULT '{"Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for bus routes
ALTER TABLE public.bus_routes ENABLE ROW LEVEL SECURITY;

-- Anyone can view bus routes
CREATE POLICY "Anyone can view bus routes" 
ON public.bus_routes 
FOR SELECT 
USING (true);

-- Create bus bookings table
CREATE TABLE public.bus_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  route_id UUID NOT NULL REFERENCES public.bus_routes(id) ON DELETE CASCADE,
  passenger_name TEXT NOT NULL,
  passenger_email TEXT NOT NULL,
  passenger_phone TEXT NOT NULL,
  travel_date DATE NOT NULL,
  seats_booked INTEGER DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  booking_status TEXT DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for bookings
ALTER TABLE public.bus_bookings ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookings
CREATE POLICY "Users can view their own bookings" 
ON public.bus_bookings 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can create bookings
CREATE POLICY "Anyone can create bookings" 
ON public.bus_bookings 
FOR INSERT 
WITH CHECK (true);

-- Users can update their own bookings
CREATE POLICY "Users can update their own bookings" 
ON public.bus_bookings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_blogs_updated_at
BEFORE UPDATE ON public.blogs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bus_routes_updated_at
BEFORE UPDATE ON public.bus_routes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bus_bookings_updated_at
BEFORE UPDATE ON public.bus_bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample bus routes
INSERT INTO public.bus_routes (route_name, origin, destination, departure_time, arrival_time, duration_minutes, price, bus_type) VALUES
('Gangtok Express', 'Gangtok', 'Siliguri', '06:00:00', '10:30:00', 270, 450.00, 'ac'),
('Pelling Paradise', 'Pelling', 'Gangtok', '08:00:00', '11:00:00', 180, 300.00, 'deluxe'),
('Monastery Circuit', 'Gangtok', 'Rumtek Monastery', '09:00:00', '10:00:00', 60, 150.00, 'regular'),
('Yuksom Heritage', 'Gangtok', 'Yuksom', '07:30:00', '12:30:00', 300, 500.00, 'ac'),
('Namchi Sacred', 'Gangtok', 'Namchi', '10:00:00', '12:30:00', 150, 250.00, 'deluxe');