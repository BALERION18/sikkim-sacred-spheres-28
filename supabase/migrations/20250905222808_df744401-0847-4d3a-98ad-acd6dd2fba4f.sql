-- Update blogs table to include role and media
ALTER TABLE public.blogs 
ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('user','guide','admin')) DEFAULT 'user',
ADD COLUMN IF NOT EXISTS media_url TEXT[];

-- Update RLS policies for enhanced blog functionality
DROP POLICY IF EXISTS "Authenticated users can create blogs" ON public.blogs;
DROP POLICY IF EXISTS "Users can update their own blogs or admins can update any" ON public.blogs;
DROP POLICY IF EXISTS "Users can delete their own blogs or admins can delete any" ON public.blogs;

CREATE POLICY "Authenticated users can create blogs" 
ON public.blogs 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  (role = 'user' OR role = 'guide' OR role = 'admin')
);

CREATE POLICY "Users can update their own blogs or admins can update any" 
ON public.blogs 
FOR UPDATE 
USING (
  (auth.uid() = user_id) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can delete their own blogs or admins can delete any" 
ON public.blogs 
FOR DELETE 
USING (
  (auth.uid() = user_id) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Create storage bucket for blog media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-media', 'blog-media', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for blog media
CREATE POLICY "Anyone can view blog media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'blog-media');

CREATE POLICY "Authenticated users can upload blog media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'blog-media' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update their own media or admins can update any" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'blog-media' AND 
  (auth.uid()::text = (storage.foldername(name))[1] OR 
   has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Users can delete their own media or admins can delete any" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'blog-media' AND 
  (auth.uid()::text = (storage.foldername(name))[1] OR 
   has_role(auth.uid(), 'admin'::app_role))
);