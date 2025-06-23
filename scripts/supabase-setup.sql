-- Enable Row Level Security (RLS) - Supabase best practice
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Post" ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Enable read access for all users" ON "User" FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON "User" FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON "User" FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON "User" FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON "Post" FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON "Post" FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON "Post" FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON "Post" FOR DELETE USING (true);

-- Insert sample data
INSERT INTO "User" (email, name) VALUES 
    ('admin@exemplo.com', 'Administrador'),
    ('user@exemplo.com', 'Usuário Teste')
ON CONFLICT (email) DO NOTHING;

-- Insert sample posts
DO $$
DECLARE
    admin_id INTEGER;
    user_id INTEGER;
BEGIN
    SELECT id INTO admin_id FROM "User" WHERE email = 'admin@exemplo.com';
    SELECT id INTO user_id FROM "User" WHERE email = 'user@exemplo.com';
    
    IF admin_id IS NOT NULL THEN
        INSERT INTO "Post" (title, content, published, "authorId") 
        VALUES ('Primeiro Post', 'Este é o conteúdo do primeiro post', true, admin_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF user_id IS NOT NULL THEN
        INSERT INTO "Post" (title, content, published, "authorId") 
        VALUES ('Post em Rascunho', 'Este post ainda não foi publicado', false, user_id)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;
