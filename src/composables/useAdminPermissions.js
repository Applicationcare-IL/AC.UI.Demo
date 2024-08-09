import { useAdminPermissionsStore } from "@/stores/adminPermissionsStore";

const usePermissions = () => {
  const adminPermissionsStore = useAdminPermissionsStore();

  const getPermissions = async (entity_type, entity_id) => {
    return await adminPermissionsStore.getPermissions({ entity_type, entity_id });
  };

  return {
    getPermissions,
  };
};

export default usePermissions;
