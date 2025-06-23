-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS "User" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS "Post" (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    published BOOLEAN DEFAULT false,
    "authorId" INTEGER NOT NULL,
    FOREIGN KEY ("authorId") REFERENCES "User"(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO "User" (email, name) VALUES 
    ('admin@exemplo.com', 'Administrador'),
    ('user@exemplo.com', 'Usuário Teste')
ON CONFLICT (email) DO NOTHING;

-- Get user IDs for posts
INSERT INTO "Post" (title, content, published, "authorId") 
SELECT 'Primeiro Post', 'Este é o conteúdo do primeiro post', true, u.id
FROM "User" u WHERE u.email = 'admin@exemplo.com'
ON CONFLICT DO NOTHING;

INSERT INTO "Post" (title, content, published, "authorId") 
SELECT 'Post em Rascunho', 'Este post ainda não foi publicado', false, u.id
FROM "User" u WHERE u.email = 'user@exemplo.com'
ON CONFLICT DO NOTHING;
