import { useBudgetsStore } from "@/stores/budgetsStore";

export function useBudgets() {
  const budgetStore = useBudgetsStore();

  // ACTIONS
  const getProjectBudget = async (projectId) => {
    const response = await budgetStore.getProjectBudget(projectId);

    return response;

    // const tasks = response.data.map((task) => {
    //   return mapTask(task);
    // });

    // const totalRecords = response.meta.total;

    // return { data: tasks, totalRecords };
  };

  return {
    // API
    getProjectBudget,
    // UTILITIES
  };
}
