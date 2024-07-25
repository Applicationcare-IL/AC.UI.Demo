import { storeToRefs } from "pinia";

import { usePermissionsStore } from "@/stores/permissionsStore";

const usePermissions = () => {
  const permissionsStore = usePermissionsStore();

  const { permissions, isPermissionsLoaded } = storeToRefs(permissionsStore);

  /**
   * Check if the user has a specific permission
   * @param {*} permission
   * @returns true if the user has the permission
   * @returns false if the user does not have the permission or the permission does not exist
   */
  const can = (permission) => {
    console.log("permission", permission, !permissionsStore.permissionExists(permission));
    if (!permissionsStore.permissionExists(permission)) {
      return false;
    }

    return permissionsStore.can(permission);
  };

  return {
    fetchPermissionsFromApi: permissionsStore.fetchPermissionsFromApi,
    isPermissionsLoaded,
    permissions,
    can,
  };
};

export default usePermissions;
