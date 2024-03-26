<template>
  <span v-tooltip.top="formattedAttributes" :class="classes">
    {{ translatedValue }}
  </span>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { locale, t } = useI18n();

const props = defineProps({
  optionSet: {
    type: Object,
    default: () => {},
  },
});

const classes = computed(() => {
  return {
    "has-attributes": props.optionSet && props.optionSet.attributes,
  };
});

const translatedValue = computed(() => {
  if (!props.optionSet) return;
  return props.optionSet[`value_${locale.value}`];
});

function formatArray(array) {
  return array
    .map((item) => {
      const [key, value] = item.split(": ");
      return `${key.charAt(0).toUpperCase()}${key.slice(1)}: ${value}`;
    })
    .join("\n");
}

const formattedAttributes = computed(() => {
  if (!props.optionSet || !props.optionSet.attributes) return;

  const attributesWithTranslationKey = props.optionSet.attributes.map(
    (attr) => {
      return `${t(attr.translation_key)}: ${attr.value}`;
    }
  );

  // print each attribute on a new line and stringify it
  return formatArray(attributesWithTranslationKey);
});
</script>

<style scoped lang="scss">
.has-attributes {
  cursor: help;
}
</style>
