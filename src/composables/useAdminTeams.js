import { useAdminTeamsStore } from "@/stores/adminTeamsStore";

const useAdminFlowmaze = () => {
  const adminTeamsStore = useAdminTeamsStore();

  const getTeams = async (params) => {
    const response = await adminTeamsStore.getTeams(params);
    const teams = response.data.map((team) => mapTeam(team));
    const totalRecords = response.meta.total;

    return { data: teams, totalRecords };
  };

  const getTeam = async (id) => {
    const response = await adminTeamsStore.getTeam(id);

    return mapTeam(response.data);
  };

  const createTeam = async (params) => {
    return await adminTeamsStore.createTeam(params);
  };

  const updateTeam = async (teamId, params) => {
    return await adminTeamsStore.updateTeam(teamId, params);
  };

  const activateTeams = async (teamIds) => {
    const promises = teamIds.map((teamId) => adminTeamsStore.activateTeam(teamId));
    return await Promise.all(promises);
  };

  const addUsers = async (teamId, params) => {
    return adminTeamsStore.addUsers(teamId, params);
  };

  const removeUsers = async (teamId, params) => {
    return adminTeamsStore.removeUsers(teamId, params);
  };

  const mapTeam = (team) => {
    return {
      ...team,
      link_detail: {
        text: team.id,
        id: team.id,
      },
      manager_name: `${team.manager?.name} ${team.manager?.surname}`,
      title: team.name,
    };
  };

  const parseTeam = (team) => {
    return {
      ...team,
      manager_id: team.manager?.id,
    };
  };

  return {
    //ACTIONS
    getTeams,
    getTeam,
    createTeam,
    updateTeam,
    activateTeams,
    addUsers,
    removeUsers,
    // UTILITIES
    mapTeam,
    parseTeam,
  };
};
export default useAdminFlowmaze;
