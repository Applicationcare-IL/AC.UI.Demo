import { onBeforeRouteLeave } from "vue-router";

export function useNavigationGuards() {
  const { confirmCancelDialog } = useDialog();

  const handleRouteChangeWithUnsavedFormChanges = (meta) => {
    if (!meta.value) {
      console.error(
        "handleRouteChangeWithUnsavedFormChanges: meta is not defined"
      );
    }

    onBeforeRouteLeave(async (to, from, next) => {
      if (meta.value.dirty) {
        const result = await confirmCancelDialog({ to });

        if (result) {
          next(false);
        } else {
          next();
        }
      } else {
        next();
      }
    });
  };

  return {
    handleRouteChangeWithUnsavedFormChanges,
  };
}
