export function useExports() {
  const toast = useToast();

  const handleExport = async ({ filters, searchValue, exportFunction }) => {
    const searchValueParam = searchValue.value;

    const params = new URLSearchParams({
      ...filters,
      search: searchValueParam,
    });

    const response = await exportFunction(params);
    const hash = response.data.hash;

    console.log("hash", hash);

    toast.showLoadingExportToast();

    if (window.Echo) {
      window.Echo.channel(`export.${hash}`).listen(".exports.ready", (data) => {
        const url = data.url;
        window.open(url, "_blank");

        toast.clearLoadingExportToast();
      });
    }
  };

  return {
    // ACTIONS
    handleExport,
  };
}
