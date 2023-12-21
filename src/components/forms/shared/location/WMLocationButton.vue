<template>
  <WMButton class="m-1 col-6" name="location" icon="location" @click="toggle">
    {{ $t("buttons.view_map") }}
  </WMButton>
  <OverlayPanel ref="isOpen"> <WMLocationMap /> </OverlayPanel>
</template>

<script setup>
import { ref } from "vue";

const isOpen = ref();

const toggle = (event) => {
  isOpen.value.toggle(event);
};
</script>
