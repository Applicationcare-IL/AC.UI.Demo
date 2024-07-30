import { useReportsStore } from "@/stores/reportsStore";

const useReports = () => {
  const reportsStore = useReportsStore();

  const getReports = async (params) => {
    const response = await reportsStore.getReports(params);
    const reports = response.data.map((report) => mapReport(report));
    const totalRecords = response.meta.total;

    return { data: reports, totalRecords };
  };

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

  const mapReport = (report) => {
    return {
      ...report,
      link_detail: {
        text: report.id,
        id: report.id,
      },
      title: report.name,
    };
  };

  const getReportTableColumns = (selectedFields, selectedEntity, groupBy) => {
    if (!selectedFields) return [];

    let columns = selectedFields.map((item) => ({
      field: item.id,
      header: selectedEntity.name + "." + item.name,
    }));

    if (groupBy) {
      columns.unshift({
        field: "total",
        header: "Count",
      });
    }

    return columns;
  };

  return {
    // ACTIONS
    getReports,
    getReportData,
    getReportTableColumns,
  };
};

export default useReports;
