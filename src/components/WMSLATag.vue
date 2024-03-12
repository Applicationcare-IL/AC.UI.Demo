<template>
  <div class="sla-tag" :class="slaClasses">
    {{ getSLAText }}
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const i18n = useI18n();

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
  if (props.sla === null) return;
  if (props.state === "active" && props.sla !== "breached")
    return i18n.t("sla.days_left", { days: Math.abs(props.daysForClosing) });
  if (props.state === "active" && props.sla === "breached")
    return i18n.t("sla.days_passed", { days: Math.abs(props.daysForClosing) });
  if (props.sla !== "breached") return i18n.t("sla.whithin_sla");
  if (props.sla === "breached") return i18n.t("sla.ended_breach");

  return "";
});
</script>

<style scoped lang="scss">
.sla-tag {
  font-weight: 700;
}
</style>
