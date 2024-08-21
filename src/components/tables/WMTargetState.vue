<template>
  <div class="state-label h-full w-full font-bold" :class="slaClasses">
    {{ targetText }}
  </div>
</template>

<script setup>
// IMPORTS

// DEPENDENCIES

// INJECT

// PROPS, EMITS
import {computed} from "vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n();

const props = defineProps({
  target: String
})

// REFS

// COMPUTED
const slaClasses = computed(() => {
  if (props.target === "service") {
    return "bg-blue-200";
  }
  if (props.target === "customer") {
    return "bg-purple-200";
  }
  if (props.target === "sale") {
    return "bg-green-300";
  }
  if (props.target === "project") {
    return "bg-yellow-200";
  }
  if (props.target === "employee") {
    return "bg-orange-200";
  }
  return '';
});

const targetText = computed(() => {
  return t("message." + props.target);
});

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
