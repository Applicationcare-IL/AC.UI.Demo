<template>
  <WMTempButton :text="$t('filter')" type="type-5" :is-active="isActive">
    <template #customIcon>
      <div class="d-flex" v-html="FilterIcon" />
    </template>
  </WMTempButton>
</template>

<script setup>
import FilterIcon from "/icons/filter.svg?raw";

defineProps({
  isActive: Boolean,
});
</script>
