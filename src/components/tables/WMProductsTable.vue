<template>
  <DataTable
    v-model:selection="selectedContacts"
    lazy
    :value="contacts"
    data-key="contact_id"
    table-style="min-width: 50rem"
    scrollable
    :paginator="showControls"
    :rows="10"
    :total-records="totalRecords"
    class="w-full"
    @page="onPage($event)"
    @update:selection="onSelectionChanged"
  >
    <Column
      v-for="column in columns"
      :key="column.name"
      :field="column.name"
      :header="getColumHeader(column)"
      :class="column.class"
    >
      <template #body="{ data }">
        <WMRenderTableFieldBody v-model="data[column.field]" :type="column.type" />
      </template>
      <template v-if="column.editable" #editor="{ data }">
        <WMRenderTableFieldEditor v-model="data[column.field]" :type="column.type" />
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { ref } from "vue";

const selectedContacts = ref([]);
const contacts = ref([]);
const totalRecords = ref(0);
const showControls = ref(true);

const onSelectionChanged = (event) => {
  selectedContacts.value = event;
};

const onPage = (event) => {
  console.log(event);
};

const columns = [
  {
    name: "test",
    type: "text",
    header: "test",
  },
];
</script>
