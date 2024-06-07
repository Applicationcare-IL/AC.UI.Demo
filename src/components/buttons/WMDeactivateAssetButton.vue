<template>
  <WMTempButton
    :text="t('asset.deactivate')"
    type="secondary"
    :disabled="selectedElements == 0"
    :is-disabled="selectedElements == 0"
    @click="handleDeactivateAsset"
  />
</template>

<script setup>
// IMPORTS
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { t } = useI18n();
const { deactivateAsset } = useAssets();
const utilsStore = useUtilsStore();
const toast = useToast();

// INJECT

// PROPS, EMITS
const emit = defineEmits(["assetDeactivated"]);

// REFS
const selectedElements = ref(0);
const areAssetsActive = ref(false);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const handleDeactivateAsset = () => {
  console.log("handleDeactivateAsset");

  deactivateAsset(utilsStore.selectedElements["asset"].map((x) => x.id)).then(() => {
    toast.successAction("asset", "deactivated");
    emit("assetDeactivated");
  });
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
