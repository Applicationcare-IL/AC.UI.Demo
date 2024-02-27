<template>
  <span class="p-input-icon-left">
    <i class="pi pi-search" />
    <InputText
      v-model="modelValue"
      class="w-30rem"
      placeholder="Search"
      @input="input"
    />
  </span>
</template>

<script setup>
import { useUtilsStore } from "../stores/utils";

const utilsStore = useUtilsStore();

const modelValue = defineModel();

const props = defineProps({
  entity: String,
});

const input = (event) => {
  utilsStore.searchString[props.entity] = event.target.value;
};
</script>
