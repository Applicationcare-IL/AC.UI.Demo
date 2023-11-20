import axiosConfig from "@/service/axiosConfig";

export const TasksService = {
  updateTask(id, task) {
    return axiosConfig
      .patch("/tasks/" + id, task)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  },

  completeTask(id) {
    return axiosConfig
      .post("/tasks/" + id + "/complete")
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  },

  completeTasks(ids, reasons) {
    const params = {
      ids: ids,
      completion_reason_1: reasons?.completion_reason_1,
      completion_reason_2: reasons?.completion_reason_2,
    };
    return axiosConfig
      .post("/tasks/complete", params)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  },
};
