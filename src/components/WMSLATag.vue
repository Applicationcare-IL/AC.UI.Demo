<template>
  <div class="sla-tag" :class="slaClasses">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  sla: String,
});

const slaClasses = computed(() => {
  return [
    "px-2",
    {
      "bg-teal-200 text-teal-900": props.sla === "no_breach",
      "bg-yellow-100 text-gray-900": props.sla === "near_breach",
      "bg-red-100 text-red-600 ": props.sla === "breach",
      "text-teal-900": props.sla === "עמד ביעד",
      "text-red-600": props.sla === "הסתיים בחריגה",
    },
  ];
});
</script>

<style scoped lang="scss">
.sla-tag {
  font-weight: 700;
}
</style>
