import { usePermissionsStore } from "@/stores/permissionsStore";

export function usePermissions() {
  const permissionsStore = usePermissionsStore();

  function can(permission) {
    return permissionsStore.can(permission);
  }

  return {
    can,
  };
}
