export function useFilters() {
  const filterList = {
    service: [
      {
        type: "dropdown",
        name: "area",
        optionSet: "service_area",
      },
      {
        type: "buttons",
        name: "status",
        optionSet: "service_status",
      },
      {
        type: "date",
        name: "open",
      },
    ],
  };

  return {
    // ACTIONS
    filterList,
  };
}
