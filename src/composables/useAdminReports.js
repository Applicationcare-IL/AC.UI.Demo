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

  return {
    // ACTIONS
    getReports,
  };
};

export default useAdminReports;
