import { useAdminPermissionsStore } from "@/stores/adminPermissionsStore";

const usePermissions = () => {
  const adminPermissionsStore = useAdminPermissionsStore();

  const getPermissions = async (entity_type, entity_id) => {
    return await adminPermissionsStore.getPermissions({ entity_type, entity_id });
  };

  const updatePermissions = async (entity_type, entity_id, permissions) => {
    try {
      return await adminPermissionsStore.updatePermissions({ entity_type, entity_id, permissions });
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };

  return {
    getPermissions,
    updatePermissions,
  };
};

export default usePermissions;
