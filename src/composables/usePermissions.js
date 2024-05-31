import { usePermissionsStore } from "@/stores/permissionsStore";

export function usePermissions() {
  const permissionsStore = usePermissionsStore();

  /**
   * Check if the user has a specific permission
   * @param {*} permission
   * @returns true if the user has the permission
   * @returns false if the user does not have the permission or the permission does not exist
   */
  function can(permission) {
    if (!permissionsStore.permissionExists(permission)) {
      return false;
    }

    return permissionsStore.can(permission);
  }

  return {
    can,
  };
}
