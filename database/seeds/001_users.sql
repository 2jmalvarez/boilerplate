INSERT INTO users (name, email, password_hash)
VALUES
  ('Administrador', 'admin@example.com', crypt('Test12345!', gen_salt('bf', 12))),
  ('Usuario', 'user@example.com', crypt('Test12345!', gen_salt('bf', 12)))
ON CONFLICT (lower(email)) DO UPDATE
SET
  name = EXCLUDED.name,
  password_hash = EXCLUDED.password_hash,
  updated_at = now();

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON (u.email = 'admin@example.com' AND r.name = 'admin')
  OR (u.email = 'user@example.com' AND r.name = 'user')
WHERE u.email IN ('admin@example.com', 'user@example.com')
ON CONFLICT DO NOTHING;
