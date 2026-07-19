INSERT INTO users (name, email, password_hash, role)
VALUES
  ('Administrador', 'admin@example.com', crypt('Test12345!', gen_salt('bf', 12)), 'admin'),
  ('Usuario', 'user@example.com', crypt('Test12345!', gen_salt('bf', 12)), 'user')
ON CONFLICT (lower(email)) DO UPDATE
SET
  name = EXCLUDED.name,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  updated_at = now();
