export function useExports() {
  const toast = useToast();

  const handleExport = async ({ filters, searchValue, exportFunction }) => {
    const searchValueParam = searchValue.value;

    const params = new URLSearchParams({
      ...filters,
      search: searchValueParam,
    });

    const response = await exportFunction(params);

    const { hash, exists_url, download_url } = response.data;

    if (exists_url) {
      window.open(download_url, "_blank");
      return;
    }

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
