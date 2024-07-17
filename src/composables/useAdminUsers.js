import { useAdminUsersStore } from "@/stores/adminUsersStore";

const useAdminFlowmaze = () => {
  const adminUsersStore = useAdminUsersStore();

  // ACTIONS
  const getUsers = async (params) => {
    const response = await adminUsersStore.getUsers(params);
    const users = response.data.map((user) => mapUser(user));
    const totalRecords = response.meta.total;

    return { data: users, totalRecords };
  };

  const getUser = async (id) => {
    const response = await adminUsersStore.getUser(id);

    return mapUser(response.data);
  };

  const mapUser = (user) => {
    return {
      ...user,
      link_detail: {
        text: user.id,
        id: user.id,
      },
    };
  };

  return {
    // ACTIONS
    getUsers,
    getUser,
  };
};

export default useAdminFlowmaze;
