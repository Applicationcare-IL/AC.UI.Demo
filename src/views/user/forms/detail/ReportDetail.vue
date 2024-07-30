<template>
  <!-- <WMButton :text="$t('export')" type="type-5">
    <template #customIcon>
      <div class="flex" v-html="ExportIcon" />
    </template>
  </WMButton> -->

  <WMReportDetail />
</template>

<script setup>
import ExportIcon from "/icons/export.svg?raw";

useHead({
  title: "Report Detail",
});
</script>
