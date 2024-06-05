<template>
  <WMTempButton :text="text" type="new" @click="toggle">
    <template #customIcon>
      <div class="flex" v-html="PlusIcon" />
    </template>
  </WMTempButton>
</template>

<script setup>
import PlusIcon from "/icons/plus.svg?raw";

defineProps({
  text: String,
});
</script>
