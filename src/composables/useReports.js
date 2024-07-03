import { useReportsStore } from "@/stores/reportsStore";

export function useReports() {
  const reportsStore = useReportsStore();

  const getReport = async ({
    entity_type,
    fields,
    group_by,
    count_rows,
    order_column,
    order_dir,
  }) => {
    let report = await reportsStore.getReport({
      entity_type,
      fields,
      group_by,
      count_rows,
      order_column,
      order_dir,
    });

    return report;
  };

  return {
    // ACTIONS
    getReport,
  };
}
