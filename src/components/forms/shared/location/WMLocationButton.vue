<template>
  <WMButton class="m-1 col-6" name="location" icon="location" @click="toggle">
    {{ $t("buttons.view_map") }}
  </WMButton>
  {{ utilsStore.selectedElements[utilsStore.entity][0]["location"] }}
  <OverlayPanel ref="isOpen">
    <WMLocationMap
      :location="utilsStore.selectedElements[utilsStore.entity][0]['location']"
    />
  </OverlayPanel>
</template>

<script setup>
import { ref } from "vue";

import { useUtilsStore } from "@/stores/utils";
const utilsStore = useUtilsStore();

const isOpen = ref();

const toggle = (event) => {
  isOpen.value.toggle(event);
};
</script>
