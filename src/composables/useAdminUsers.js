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

  const updateUser = async (userId, data) => {
    return await adminUsersStore.updateUser(userId, data);
  };

  const activateUsers = async (userIds) => {
    const promises = userIds.map((userId) => adminUsersStore.activateUser(userId));
    return await Promise.all(promises);
  };

  const deactivateUser = async (userId) => {
    return await adminUsersStore.deactivateUser(userId);
  }

  const unlockUser = async (userId) => {
    return await adminUsersStore.unlockUser(userId);
  }

  const resetPassUsers = async (userIds) => {
    const promises = userIds.map((userId) => adminUsersStore.resetPassUser(userId));
    return await Promise.all(promises);
  };

  // UTILITIES
  const mapUser = (user) => {
    const username = `${user.name} ${user.surname}`;
    const manager_fullname = `${user.manager?.name} ${user.manager?.surname}`;

    return {
      ...user,
      username: username,
      link_detail: {
        text: user.id,
        id: user.id,
      },
      title: username,
      manager_fullname: user.manager?.name && user.manager?.surname ? manager_fullname : "",
      locked: !user.locked,
    };
  };

  const parseUser = (user) => {
    return {
      ...user,
      manager_id: user.manager?.id,
      teams: user.teams?.map((team) => team.id),
      default_team: user.default_team.id,
      roles: user.roles?.map((role) => role.id),
    };
  };

  const parseUpdateUser = (user) => {
    return {
      ...user,
      manager_id: user.manager?.id,
      teams: user.teams?.map((team) => team.id),
      default_team: user.default_team.id,
      roles: user.roles?.map((role) => role.id),
    };
  };

  return {
    // ACTIONS
    getUsers,
    getUser,
    createUser,
    updateUser,
    activateUsers,
    deactivateUser,
    unlockUser,
    resetPassUsers,
    // UTILITIES
    mapUser,
    parseUser,
    parseUpdateUser,
  };
};

export default useAdminFlowmaze;
