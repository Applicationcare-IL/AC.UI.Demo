<template>
  <span>{{ translatedValue }}</span>
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
  return props.optionSet[`value_${locale.value}`];
});
</script>
