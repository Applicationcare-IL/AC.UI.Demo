<template>
  <Story :layout="{ type: 'grid', width: '300px' }">
    <template v-for="column in columns" :key="column.name">
      <Variant :title="`Type: ${column.type}`">
        <WMRenderTableFieldInfo :column="column" :example-data="exampleData" />
      </Variant>
    </template>
  </Story>
</template>
<script setup>
import { reactive } from "vue";

const columns = [
  {
    name: "text",
    type: "text",
    field: "text",
    header: "Type Text",
  },
  {
    name: "active",
    type: "state",
    field: "state",
    header: "State",
    width: "100px",
    class: "filled-td",
  },
  {
    name: "option-set",
    type: "option-set",
    field: "option_set",
    header: "option-set",
  },
];

const exampleData = reactive([
  {
    text: "Test",
    state: {
      id: 292,
      value: "not_active",
      value_en: "Not Active",
      value_he: "לא פעיל",
      attributes: [],
    },
    option_set: {
      id: 2153,
      value: "option_set",
      value_en: "option_set_en",
      value_he: "option_set_he",
      attributes: null,
    },
  },
]);
</script>
