import WMLocationMap from '../WMLocationMap.vue';
<template>
  <WMButton class="m-1 col-6" name="location" icon="location" @click="toggle"
    >צפיה במפה</WMButton
  >
  <OverlayPanel ref="isOpen"> <WMLocationMap /> </OverlayPanel>
</template>

<script setup>
import { ref } from "vue";

const isOpen = ref();

const toggle = (event) => {
  isOpen.value.toggle(event);
};
</script>
