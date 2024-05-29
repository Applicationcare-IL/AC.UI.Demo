<template>
  <span class="p-input-icon-left">
    <i class="pi pi-search" />
    <InputText
      v-model="modelValue"
      class="w-30rem searchbox"
      placeholder="Search"
      @input="input"
    />
  </span>
</template>

<script setup>
import { onMounted } from "vue";

import { useUtilsStore } from "../stores/utils";

const utilsStore = useUtilsStore();

const modelValue = defineModel();

const props = defineProps({
  entity: String,
});

const input = (event) => {
  utilsStore.searchString[props.entity] = event.target.value;
};

onMounted(() => {
  modelValue.value = utilsStore.searchString[props.entity];
});
</script>

<style scoped>
.searchbox {
  height: 100%;
}
</style>
