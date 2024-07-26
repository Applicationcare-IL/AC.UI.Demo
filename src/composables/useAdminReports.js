import { useAdminReportsStore } from "@/stores/adminReportsStore";

const useAdminReports = () => {
  const adminReportsStore = useAdminReportsStore();

  // ACTIONS
  const getReports = async (params) => {
    const response = await adminReportsStore.getReports(params);
    const reports = response.data.map((report) => mapReport(report));
    const totalRecords = response.meta.total;

    return { data: reports, totalRecords };
  };

  const getAdminReport = async (id) => {
    const response = await adminReportsStore.getReport(id);

    return mapReport(response.data);
  };

  const createReport = async (data) => {
    return await adminReportsStore.createReport(data);
  };

  const updateReport = async (reportId, data) => {
    await adminReportsStore.updateReport(reportId, data);
  };

  // UTILITIES
  const mapReport = (report) => {
    return {
      ...report,
      entity_name: report.easymaze_entity?.name,
      link_detail: {
        text: report.id,
        id: report.id,
      },
    };
  };

  const parseReport = (report) => {
    return {
      ...report,
      easymaze_entity: report.entity.id,
    };
  };

  return {
    // ACTIONS
    getReports,
    getAdminReport,
    createReport,
    updateReport,
    //  UTILITIES
    parseReport,
  };
};

export default useAdminReports;
