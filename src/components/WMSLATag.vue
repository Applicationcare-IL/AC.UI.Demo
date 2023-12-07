<template>
  <div class="sla-tag" :class="slaClasses">
    {{ getSLAText }}
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  sla: String,
  daysForClosing: Number,
  state: String,
});

const slaClasses = computed(() => {
  return [
    "px-2",
    {
      "bg-teal-200 text-teal-900":
        props.sla === "no_breach" && props.state === "active",
      "bg-yellow-100 text-gray-900":
        props.sla === "near_breach" && props.state === "active",
      "bg-red-100 text-red-600 ":
        props.sla === "breached" && props.state === "active",
      "text-teal-900": props.sla !== "breached" && props.state === "not_active",
      "text-red-600": props.sla === "breached" && props.state === "not_active",
    },
  ];
});

const getSLAText = computed(() => {
  if (props.state === "active" && props.sla !== "breached")
    return "נותרו " + props.daysForClosing + " ימים";
  if (props.state === "active" && props.sla === "breached")
    return "חריגה " + props.daysForClosing + " ימים";
  if (props.sla !== "breached") return "עמד ביעד";
  if (props.sla === "breached") return "הסתיים בחריגה";
});
</script>

<style scoped lang="scss">
.sla-tag {
  font-weight: 700;
}
</style>
