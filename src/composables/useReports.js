import { useReportsStore } from "@/stores/reportsStore";

const useReports = () => {
  const reportsStore = useReportsStore();

  const getReport = async ({
    entity_type,
    fields,
    group_by,
    count_rows,
    order_by,
    order_dir,
    filters,
  }) => {
    let report = await reportsStore.getReport({
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
    getReport,
  };
};

export default useReports;
