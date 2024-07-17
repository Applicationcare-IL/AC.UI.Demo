import { useAdminUsersStore } from "@/stores/adminUsersStore";

const useAdminFlowmaze = () => {
  const adminUsersStore = useAdminUsersStore();

  // ACTIONS
  const getUsers = async (params) => {
    const response = await adminUsersStore.getUsers(params);
    const users = response.data;
    const totalRecords = response.meta.total;

    return { data: users, totalRecords };
  };

  const getUser = async (id) => {
    const response = await adminUsersStore.getUser(id);
    return response.data;
  };

  return {
    // ACTIONS
    getUsers,
    getUser,
  };
};

export default useAdminFlowmaze;
