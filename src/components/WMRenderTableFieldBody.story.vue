<template>
  <Story :layout="{ type: 'grid', width: '100%' }">
    <Variant title="Table">
      <DataTable :value="exampleData" :rows="1" :total-records="1">
        <Column
          v-for="column in columns"
          :key="column.name"
          :field="column.name"
          :header="$t(column.header)"
          :class="column.class"
          :style="column.width ? { width: column.width } : {}"
        >
          <template #body="{ data }">
            <WMRenderTableFieldBody v-model="data[column.field]" :column-data="column" />
          </template>
        </Column>
      </DataTable>
    </Variant>
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
    class: "p-0 filled-td",
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
  },
]);
</script>
