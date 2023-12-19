<template>
  <span class="p-input-icon-left">
    <i class="pi pi-search" />
    <InputText
      class="w-30rem"
      v-model="searchValue"
      placeholder="Search"
      @input="input"
    />
  </span>
</template>

<script setup>
import { ref } from "vue";
import { useUtilsStore } from "../stores/utils";

const utilsStore = useUtilsStore();

const searchValue = ref("");

const props = defineProps({
  entity: String,
});

const input = (event) => {
  utilsStore.searchString[props.entity] = event.target.value;
};
</script>
