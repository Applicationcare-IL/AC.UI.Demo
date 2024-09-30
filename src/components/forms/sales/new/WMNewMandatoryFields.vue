<template>
  <div ref="el">
    {{ modelValue }}
    <div
      v-for="(item, index) in modelValue"
      :key="item.id"
      class="flex gap-3 align-items-center mb-3"
    >
      <div class="flex" v-html="DragIndicator" />
      <WMInput
        id="description"
        type="text-area"
        name="description"
        size="md"
        required
        rows="4"
        :value="item"
        @update:value="updateItem($event, index)"
      />
      <WMDeleteButton @click="deleteItem(item)" />
      item{{ item }}
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { useSortable } from "@vueuse/integrations/useSortable";
import { onMounted, ref, watch } from "vue";

import DragIndicator from "/icons/drag_indicator.svg?raw";

// DEPENDENCIES

// INJECT

// PROPS, EMITS
const modelValue = defineModel();

// REFS
const el = ref(null);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const updateItem = (item, index) => {
  modelValue.value[index] = item;
};

const deleteItem = (item) => {
  console.log("item", item);
  modelValue.value = modelValue.value.filter((i) => i !== item);
};

// PROVIDE, EXPOSE

// WATCHERS
watch(
  modelValue,
  () => {
    useSortable(el, modelValue, {
      animation: 150,
    });
  },
  {
    deep: true,
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  useSortable(el, modelValue, {
    animation: 150,
  });
});
</script>

<style scoped></style>
