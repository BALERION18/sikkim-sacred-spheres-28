-- Add user role for existing user so they can test delete functionality
INSERT INTO user_roles (user_id, role) 
VALUES ('62b071d1-e20d-40e3-968c-2d86d63ee97e', 'admin')
ON CONFLICT (id) DO NOTHING;