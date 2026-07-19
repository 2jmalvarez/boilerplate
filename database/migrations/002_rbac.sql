CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(80) NOT NULL UNIQUE,
  description text,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX roles_single_default_idx ON roles (is_default) WHERE is_default;

CREATE TABLE permissions (
  key varchar(120) PRIMARY KEY CHECK (key ~ '^[a-z][a-z0-9-]*:[a-z][a-z0-9-]*$'),
  description text NOT NULL
);

CREATE TABLE role_permissions (
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_key varchar(120) NOT NULL REFERENCES permissions(key) ON DELETE RESTRICT,
  PRIMARY KEY (role_id, permission_key)
);

CREATE TABLE user_roles (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

CREATE INDEX user_roles_role_idx ON user_roles (role_id);
CREATE INDEX role_permissions_permission_idx ON role_permissions (permission_key);

INSERT INTO roles (name, description, is_default)
VALUES
  ('admin', 'Administración completa del sistema', false),
  ('user', 'Usuario estándar', true);

INSERT INTO permissions (key, description)
VALUES
  ('task:create', 'Crear tareas'),
  ('task:read', 'Consultar tareas'),
  ('task:update', 'Actualizar tareas'),
  ('task:delete', 'Eliminar tareas'),
  ('task:access-any', 'Acceder a tareas de cualquier usuario'),
  ('permission:read', 'Consultar el catálogo de permisos'),
  ('role:create', 'Crear roles'),
  ('role:read', 'Consultar roles'),
  ('role:update', 'Actualizar roles'),
  ('role:delete', 'Eliminar roles'),
  ('user:read', 'Consultar usuarios'),
  ('user:update-roles', 'Asignar roles a usuarios');

INSERT INTO role_permissions (role_id, permission_key)
SELECT r.id, p.key
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'admin';

INSERT INTO role_permissions (role_id, permission_key)
SELECT r.id, p.key
FROM roles r
JOIN permissions p ON p.key IN ('task:create', 'task:read', 'task:update', 'task:delete')
WHERE r.name = 'user';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.name = u.role;

ALTER TABLE users DROP COLUMN role;
