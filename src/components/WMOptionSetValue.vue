<template>
  <span v-tooltip.top="optionSet.attributes">
    {{ translatedValue }}
  </span>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const props = defineProps({
  optionSet: {
    type: Object,
    default: () => {},
  },
});

const translatedValue = computed(() => {
  if (!props.optionSet) return;
  return props.optionSet[`value_${locale.value}`];
});
</script>
