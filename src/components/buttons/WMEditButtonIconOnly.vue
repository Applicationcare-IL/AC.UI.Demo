<template>
  <WMTempButton :is-disabled="isDisabled" type="type-5" :icon-only="true">
    <template #customIcon>
      <div class="flex" v-html="EditIcon" />
    </template>
  </WMTempButton>
</template>

<script setup>
import EditIcon from "/icons/edit_default.svg?raw";

defineProps({
  isDisabled: {
    type: Boolean,
    required: false,
  },
});
</script>
