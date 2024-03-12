<template>
  <div class="state-label h-full w-full font-bold" :class="slaClasses">
    {{ stateText }}
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  state: String,
});

const slaClasses = computed(() => {
  if (props.state === "active") {
    return "bg-green-200 text-green-900";
  } else {
    return "bg-red-100 text-red-900";
  }
});

const stateText = computed(() => {
  if (props.state === "active") {
    return t("state.active");
  } else {
    return t("state.not-active");
  }
});
</script>

<style scoped lang="scss">
.sla-tag {
  font-weight: 700;
}
</style>
