<template>
  <span class="p-input-icon-left">
    <i class="pi pi-search" />
    <InputText v-model="modelValue" class="w-30rem searchbox" placeholder="Search" @input="input" />
  </span>
</template>

<script setup>
// IMPORTS
import { onMounted } from "vue";

import { useUtilsStore } from "../stores/utils";

// DEPENDENCIES
const utilsStore = useUtilsStore();

// INJECT

// PROPS, EMITS
const modelValue = defineModel();

const props = defineProps({
  entity: String,
});

const emit = defineEmits(["update:search"]);

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC
const input = (event) => {
  utilsStore.searchString[props.entity] = event.target.value;
  emit("update:search", event.target.value);
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  modelValue.value = utilsStore.searchString[props.entity];
});
</script>

<style scoped>
.searchbox {
  height: 100%;
}
</style>
