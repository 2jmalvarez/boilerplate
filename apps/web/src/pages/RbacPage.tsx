import { Plus, Save, ShieldCheck, Trash2, Users } from "lucide-react";
import { useEffect, useState, type FormEventHandler } from "react";
import { api, getErrorMessage } from "../lib/api";
import type { ApiEnvelope, Role, RoleInput, UserRoleInput } from "../types/api";
import { Button } from "../ui/Button/Button";
import { PageHeader } from "../ui/PageHeader/PageHeader";

interface PermissionDefinition {
  key: string;
  description: string;
}

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
  createdAt: string;
}

const emptyRole: RoleInput = {
  name: "",
  description: null,
  permissionKeys: [],
  isDefault: false,
};

function getUserRoleIds(
  roles: Role[],
  assignedRoleNames: string[],
  roleId: string,
  isAssigned: boolean,
): string[] {
  const assignedRoleIds = roles
    .filter((role) => assignedRoleNames.includes(role.name))
    .map((role) => role.id);

  return isAssigned
    ? [...assignedRoleIds, roleId]
    : assignedRoleIds.filter((id) => id !== roleId);
}

interface UserRoleAssignmentsProps {
  users: ManagedUser[];
  roles: Role[];
  onUpdate: (userId: string, roleIds: string[]) => void;
}

function UserRoleAssignments({
  users,
  roles,
  onUpdate,
}: Readonly<UserRoleAssignmentsProps>) {
  return (
    <div className="user-role-list">
      {users.map((user) => (
        <article key={user.id}>
          <div>
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </div>
          <fieldset aria-label={`Roles de ${user.name}`}>
            {roles.map((role) => (
              <label key={role.id}>
                <input
                  type="checkbox"
                  checked={user.roles.includes(role.name)}
                  onChange={(event) =>
                    onUpdate(
                      user.id,
                      getUserRoleIds(
                        roles,
                        user.roles,
                        role.id,
                        event.target.checked,
                      ),
                    )
                  }
                />
                {role.name}
              </label>
            ))}
          </fieldset>
        </article>
      ))}
    </div>
  );
}

/** Manages role definitions and user role assignments. */
export function RbacPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<PermissionDefinition[]>([]);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [draft, setDraft] = useState<RoleInput>(emptyRole);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setError("");
    try {
      const [roleResponse, permissionResponse, userResponse] =
        await Promise.all([
          api.get<ApiEnvelope<Role[]>>("/rbac/roles"),
          api.get<ApiEnvelope<PermissionDefinition[]>>("/rbac/permissions"),
          api.get<ApiEnvelope<ManagedUser[]>>("/rbac/users"),
        ]);
      setRoles(roleResponse.data.data);
      setPermissions(permissionResponse.data.data);
      setUsers(userResponse.data.data);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    }
  }

  useEffect(() => void load(), []);

  function editRole(role: Role) {
    setEditingId(role.id);
    setDraft({
      name: role.name,
      description: role.description,
      permissionKeys: role.permissions,
      isDefault: role.isDefault,
    });
  }

  function togglePermission(key: string) {
    setDraft((current) => ({
      ...current,
      permissionKeys: current.permissionKeys.includes(key)
        ? current.permissionKeys.filter((permission) => permission !== key)
        : [...current.permissionKeys, key],
    }));
  }

  const saveRole: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) await api.patch(`/rbac/roles/${editingId}`, draft);
      else await api.post("/rbac/roles", draft);
      setDraft(emptyRole);
      setEditingId(null);
      await load();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  };

  async function deleteRole(id: string) {
    if (
      !window.confirm(
        "¿Eliminar este rol? Los usuarios perderán esta asignación.",
      )
    )
      return;
    try {
      await api.delete(`/rbac/roles/${id}`);
      if (editingId === id) {
        setEditingId(null);
        setDraft(emptyRole);
      }
      await load();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  }

  async function updateUserRoles(userId: string, roleIds: string[]) {
    try {
      await api.put<ApiEnvelope<null>, unknown, UserRoleInput>(
        `/rbac/users/${userId}/roles`,
        { roleIds },
      );
      await load();
    } catch (updateError) {
      setError(getErrorMessage(updateError));
    }
  }

  return (
    <div className="dashboard rbac-page">
      <PageHeader
        eyebrow="Administración / Acceso"
        title="Roles y permisos"
        description="Los permisos se definen por acción. Los cambios se aplican en el próximo inicio de sesión."
      />
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="rbac-grid">
        <section className="rbac-card" aria-labelledby="role-form-title">
          <div className="rbac-card-heading">
            <ShieldCheck aria-hidden="true" />
            <h2 id="role-form-title">
              {editingId ? "Editar rol" : "Nuevo rol"}
            </h2>
          </div>
          <form className="rbac-form" onSubmit={saveRole}>
            <label>
              <span>Nombre</span>
              <input
                value={draft.name}
                onChange={(event) =>
                  setDraft({ ...draft, name: event.target.value })
                }
                required
                minLength={2}
                maxLength={80}
              />
            </label>
            <label>
              <span>Descripción</span>
              <textarea
                value={draft.description ?? ""}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    description: event.target.value || null,
                  })
                }
                maxLength={500}
              />
            </label>
            <label className="rbac-default">
              <input
                type="checkbox"
                checked={draft.isDefault}
                onChange={(event) =>
                  setDraft({ ...draft, isDefault: event.target.checked })
                }
              />{" "}
              Rol predeterminado para nuevos usuarios
            </label>
            <fieldset>
              <legend>Permisos</legend>
              <div className="permission-list">
                {permissions.map((permission) => (
                  <label key={permission.key}>
                    <input
                      type="checkbox"
                      checked={draft.permissionKeys.includes(permission.key)}
                      onChange={() => togglePermission(permission.key)}
                    />{" "}
                    <span>
                      <code>{permission.key}</code>
                      <small>{permission.description}</small>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="rbac-actions">
              <Button loading={saving} type="submit">
                <Save size={16} aria-hidden="true" />
                {editingId ? "Guardar cambios" : "Crear rol"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setEditingId(null);
                    setDraft(emptyRole);
                  }}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </section>
        <section className="rbac-card" aria-labelledby="roles-title">
          <div className="rbac-card-heading">
            <Plus aria-hidden="true" />
            <h2 id="roles-title">Roles activos</h2>
          </div>
          <div className="role-list">
            {roles.map((role) => (
              <article key={role.id}>
                <div>
                  <strong>{role.name}</strong>
                  {role.isDefault && <small>Predeterminado</small>}
                  <p>{role.description || "Sin descripción"}</p>
                  <code>{role.permissions.length} permisos</code>
                </div>
                <div>
                  <Button
                    size="small"
                    variant="ghost"
                    onClick={() => editRole(role)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    variant="danger"
                    onClick={() => void deleteRole(role.id)}
                    aria-label={`Eliminar ${role.name}`}
                  >
                    <Trash2 size={15} aria-hidden="true" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
      <section className="rbac-card rbac-users" aria-labelledby="users-title">
        <div className="rbac-card-heading">
          <Users aria-hidden="true" />
          <h2 id="users-title">Asignación de usuarios</h2>
        </div>
        <UserRoleAssignments
          roles={roles}
          users={users}
          onUpdate={(userId, roleIds) => void updateUserRoles(userId, roleIds)}
        />
      </section>
    </div>
  );
}
