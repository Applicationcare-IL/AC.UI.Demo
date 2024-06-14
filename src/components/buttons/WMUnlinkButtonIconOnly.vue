<template>
  <WMButton :is-disabled="isDisabled" type="type-5" :icon-only="true">
    <template #customIcon>
      <div class="flex" v-html="UnlinkIcon" />
    </template>
  </WMButton>
</template>

<script setup>
import UnlinkIcon from "/icons/unlink_default.svg?raw";

defineProps({
  isDisabled: {
    type: Boolean,
    required: false,
  },
});
</script>
