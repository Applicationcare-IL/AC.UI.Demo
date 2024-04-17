<template>
  <WMButton
    name="basic-secondary"
    :disabled="selectedElements == 0"
    @click="handleDeactivateAsset"
  >
    {{ t("asset.deactivate") }}
  </WMButton>
</template>

<script setup>
// IMPORTS
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { t } = useI18n();
const { deactivateAsset } = useAssets();
const utilsStore = useUtilsStore();
const formUtilsStore = useFormUtilsStore();
const dialog = useDialog();
const toast = useToast();

// INJECT

// PROPS, EMITS

const emit = defineEmits(["assetDeactivated"]);

// REFS
const selectedElements = ref(0);
const areAssetsActive = ref(false);

// COMPUTED

// COMPONENT METHODS

const handleDeactivateAsset = () => {
  deactivateAsset(utilsStore.selectedElements["asset"].map((x) => x.id)).then(
    () => {
      toast.successAction("asset", "deactivated");
      emit("assetDeactivated");
    }
  );
};

const updateStates = () => {
  selectedElements.value = utilsStore.selectedElements["asset"].length;
  areAssetsActive.value = utilsStore.selectedElements["asset"].every(
    (x) => x.state == "active"
  );
};

// PROVIDE, EXPOSE

// WATCHERS
watch(
  () => utilsStore.selectedElements["asset"],
  () => {
    updateStates();
  },
  { deep: true }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
