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

  const mapTeam = (team) => {
    return {
      ...team,
      link_detail: {
        text: team.id,
        id: team.id,
      },
      manager_name: `${team.manager?.name} ${team.manager?.surname}`,
    };
  };

  return {
    //ACTIONS
    getTeams,
    getTeam,
  };
};
export default useAdminFlowmaze;
