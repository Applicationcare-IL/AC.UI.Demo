import { storeToRefs } from "pinia";
import { computed } from "vue";
import { onBeforeRouteLeave } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";

export function useNavigationGuards(formKey) {
  const formUtilsStore = useFormUtilsStore();

  const { getFormMeta } = storeToRefs(formUtilsStore);
  const { confirmCancelDialog } = useDialog();

  const isFormDirty = computed(() => {
    return getFormMeta.value(formKey)?.dirty;
  });

  const handleRouteChangeWithUnsavedFormChanges = () => {
    onBeforeRouteLeave(async (to, from, next) => {
      if (isFormDirty.value) {
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
