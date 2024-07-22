<template>
  <!-- Type text -->
  <template v-if="columnData.type == 'text'">
    {{ modelValue }}
  </template>
  <!-- Type project-link -->
  <template v-if="columnData.type == 'link'">
    <router-link
      v-if="modelValue"
      :to="{
        name: columnData.routeName,
        params: { id: modelValue.id },
      }"
    >
      {{ modelValue.text }}
    </router-link>
  </template>
  <!-- Type state -->
  <template v-if="columnData.type == 'state'">
    <WMStateField :state="stateValue" />
  </template>
</template>
<script setup>
// IMPORTS
import { computed } from "vue";

// DEPENDENCIES

// INJECT

// PROPS, EMITS
defineProps({
  columnData: Object,
});

const modelValue = defineModel();

// REFS

// COMPUTED
const stateValue = computed(() => {
  return modelValue.value === 1 ? { value: "active" } : { value: "not-active" };
});

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
