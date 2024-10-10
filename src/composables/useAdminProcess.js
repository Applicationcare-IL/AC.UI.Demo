import { useAdminProcessStore } from "@/stores/adminProcessStore";

const useAdminFlowmaze = () => {
  const adminProcessStore = useAdminProcessStore();

  //ACTIONS
  const getProcesses = async (params) => {
    const response = await adminProcessStore.getProcesses(params);
    const processes = response.data.map((process) => mapProcess(process));
    const totalRecords = response.meta.total;

    return { data: processes, totalRecords };
  };

  const getProcess = async (id) => {
    const response = await adminProcessStore.getProcess(id);

    return mapProcess(response.data);
  };

  const createProcess = async (process) => {
    return await adminProcessStore.createProcess(process);
  };

  const updateProcess = async (processId, data) => {
    return await adminProcessStore.updateProcess(processId, data);
  };

  const deleteProcess = async (processId) => {
    return await adminProcessStore.deleteProcess(processId);
  };

  //UTILITIES
  const mapProcess = (process) => {
    return {
      ...process,
      link_detail: {
        text: process.id,
        id: process.id,
      },
    };
  };

  const parseProcess = (process) => {
    return {
      ...process,
    };
  };

  return {
    //ACTIONS
    getProcesses,
    getProcess,
    createProcess,
    updateProcess,
    deleteProcess,
    //UTILITIES
    mapProcess,
    parseProcess,
  };
};

export default useAdminFlowmaze;
