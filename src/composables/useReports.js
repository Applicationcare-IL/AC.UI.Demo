import { useReportsStore } from "@/stores/reportsStore";

const useReports = () => {
  const reportsStore = useReportsStore();

  const getReportData = async ({
    entity_type,
    fields,
    group_by,
    count_rows,
    order_by,
    order_dir,
    filters,
  }) => {
    let report = await reportsStore.getReportData({
      entity_type,
      fields,
      group_by,
      count_rows,
      order_by,
      order_dir,
      filters,
    });

    return report;
  };

  return {
    // ACTIONS
    getReportData,
  };
};

export default useReports;
