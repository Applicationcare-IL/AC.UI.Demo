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

  const getReport = async (id) => {
    const response = await adminReportsStore.getReport(id);

    return mapReport(response.data);
  };

  const createReport = async (data) => {
    await adminReportsStore.createReport(data);
  };

  // UTILITIES
  const mapReport = (report) => {
    return {
      ...report,
      link_detail: {
        text: report.id,
        id: report.id,
      },
    };
  };

  const parseReport = (report) => {
    console.log("parseRepport", report);
    return {
      ...report,
      easymaze_entity: report.entity.id,
    };
  };

  return {
    // ACTIONS
    getReports,
    getReport,
    createReport,
    //  UTILITIES
    parseReport,
  };
};

export default useAdminReports;
