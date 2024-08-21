import { useReportsStore } from "@/stores/reportsStore";

const useReports = () => {
  const reportsStore = useReportsStore();

  const getReports = async (params) => {
    const response = await reportsStore.getReports(params);
    const reports = response.data.map((report) => mapReport(report));
    const totalRecords = response.meta.total;

    return { data: reports, totalRecords };
  };

  const getReport = async (id) => {
    const response = await reportsStore.getReport(id);
    const report = response.data;

    return mapReport(report);
  };

  const getReportData = async ({
    entity_type,
    fields,
    group_by,
    count_rows,
    order_by,
    order_dir,
    filters,
    per_page,
    page,
  }) => {
    let report = await reportsStore.getReportData({
      entity_type,
      fields,
      group_by,
      count_rows,
      order_by,
      order_dir,
      filters,
      per_page,
      page,
    });

    return report;
  };

  const mapReport = (report) => {
    let visualization = report.visualization ? JSON.parse(report.visualization) : [];

    return {
      ...report,
      link_detail: {
        text: report.id,
        id: report.id,
      },
      title: report.name,
      visualization: JSON.parse(visualization),
    };
  };

  const exportReport = async (id, params) => {
    const response = await reportsStore.exportReport(id, params);

    return response;
  };

  const getReportTableColumns = (selectedFields, selectedEntity, groupBy) => {
    if (!selectedFields) return [];

    let columns = selectedFields.map((field) => ({
      field: field,
      header: selectedEntity.name + "." + field,
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
    getReport,
    getReportData,
    exportReport,
    getReportTableColumns,
  };
};

export default useReports;
