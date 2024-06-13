<template>
  <WMButton :text="$t('filter')" type="type-5" :is-active="isActive">
    <template #customIcon>
      <div class="flex" v-html="FilterIcon" />
    </template>
  </WMButton>
</template>

<script setup>
import FilterIcon from "/icons/filter.svg?raw";

defineProps({
  isActive: Boolean,
});
</script>
