-- Update RLS policy to allow public read access to blogs
DROP POLICY IF EXISTS "Blogs are viewable by everyone" ON public.blogs;

CREATE POLICY "Enable read access for all users"
ON public.blogs
FOR SELECT
USING (status = 'published');

-- Ensure the table has the correct structure
UPDATE public.blogs SET views_count = 0 WHERE views_count IS NULL;
UPDATE public.blogs SET status = 'published' WHERE status IS NULL;