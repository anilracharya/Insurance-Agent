-- Seed admin user (password: Admin@123)
-- BCrypt hash generated with strength 10
INSERT INTO app_users (id, username, password, email, full_name, role, enabled, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'admin',
    '$2a$10$/hchSnA/2SV.hWlKpHZnMeKgO6oTZr8DUg6/SvLjHGZYLnYs.rKfq',
    'admin@insureagent.com',
    'System Administrator',
    'ADMIN',
    TRUE,
    NOW(),
    NOW()
)
ON CONFLICT (username) DO NOTHING;
