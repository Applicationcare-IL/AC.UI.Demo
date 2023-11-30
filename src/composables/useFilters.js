export function useFilters() {
  const filterList = {
    service: [
      {
        type: "dropdown",
        filterName: "area",
        optionSet: "service_area",
      },
      {
        type: "buttons",
        filterName: "status",
        optionSet: "service_status",
      },
      {
        type: "date",
        filterName: "open",
      },
    ],
  };

  return {
    // ACTIONS
    filterList,
  };
}
