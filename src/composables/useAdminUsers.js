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

  const createUser = async (user) => {
    return await adminUsersStore.createUser(user);
  };

  // UTILITIES
  const mapUser = (user) => {
    const username = `${user.name} ${user.surname}`;

    return {
      ...user,
      username: username,
      link_detail: {
        text: user.id,
        id: user.id,
      },
      title: username,
    };
  };

  const parseUser = (user) => {
    return {
      ...user,
      manager_id: user.manager?.id,
    };
  };

  return {
    // ACTIONS
    getUsers,
    getUser,
    createUser,
    // UTILITIES
    mapUser,
    parseUser,
  };
};

export default useAdminFlowmaze;
