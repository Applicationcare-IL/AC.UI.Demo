<template>
  <WMButton :is-disabled="isDisabled" type="save" :icon-only="true">
    <template #customIcon>
      <div class="flex" v-html="SaveIcon" />
    </template>
  </WMButton>
</template>

<script setup>
import SaveIcon from "/icons/save_default.svg?raw";

defineProps({
  isDisabled: {
    type: Boolean,
    required: false,
  },
});
</script>
