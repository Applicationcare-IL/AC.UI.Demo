import { useReportsStore } from "@/stores/reportsStore";

export function useReports() {
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
}
