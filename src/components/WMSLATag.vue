<template>
  <div class="sla-tag" :class="slaClasses">
    <span
      v-if="
        props.state === 'active' &&
        props.sla !== 'breached' &&
        props.daysForClosing === 1
      "
    >
      {{ t("sla.one_day_left") }}
    </span>
    <span v-else-if="props.state === 'active' && props.sla !== 'breached'">
      {{ t("sla.days_left", { days: Math.abs(props.daysForClosing) }) }}
    </span>
    <span v-else-if="props.state === 'active' && props.sla === 'breached'">
      {{ t("sla.days_passed", { days: Math.abs(props.daysForClosing) }) }}
    </span>
    <span v-else-if="props.state !== 'active' && props.sla !== 'breached'">
      {{ t("sla.whithin_sla") }}
    </span>
    <span v-else-if="props.state !== 'active' && props.sla === 'breached'">
      {{ t("sla.ended_breach") }}
    </span>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

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
</script>

<style scoped lang="scss">
.sla-tag {
  font-weight: 700;
}
</style>
