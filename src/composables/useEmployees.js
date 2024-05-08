import { useEmployeesStore } from "@/stores/employeesStore";

export function useEmployees() {
  const employeesStore = useEmployeesStore();

  const getTeams = () => {
    return employeesStore.getTeams();
  };

  return {
    // ACTIONS
    getTeams,
  };
}
