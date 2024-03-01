<template>
  <WMTempButton
    icon="pi-filter"
    :text="$t('filter')"
    type="filter-blue"
    :is-active="isActive"
  />
</template>

<script setup>
defineProps({
  isActive: Boolean,
});
</script>
