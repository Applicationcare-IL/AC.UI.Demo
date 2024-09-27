<template>
  <div class="flex flex-column gap-2" style="direction: ltr">
    <div style="min-height: 100px">
      <div class="h5">Field example:</div>
      <DataTable :value="exampleData" :rows="1" :total-records="1">
        <Column
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
    </div>

    <Diviver class="mb-3" />

    <div style="min-height: 250px">
      <div class="h5">Column config:</div>
      <pre class="bg-gray-50 text-gray-900 border-none text-base">{{ column }}</pre>
    </div>

    <Diviver class="mb-3" />

    <div style="min-height: 250px">
      <div class="h5">Example data:</div>
      <pre class="bg-gray-50 text-gray-900 border-none text-base">
    {{ exampleData[0][column.field] }}
    </pre
      >
    </div>
  </div>
</template>

<script setup>
// IMPORTS

// DEPENDENCIES

// INJECT

// PROPS, EMITS
defineProps({
  column: {
    type: Array,
    required: true,
  },
  exampleData: {
    type: Array,
    required: true,
  },
});

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
