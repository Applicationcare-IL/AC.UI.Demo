<template>
  <pre>{{ users[0] }}</pre>
  <DataTable
    lazy
    :value="users"
    data-key="id"
    scrollable
    :rows="10"
    :total-records="totalRecords"
    class="w-full"
  >
    <Column
      v-for="column in columns"
      :key="column.name"
      :field="column.name"
      :header="column.header"
      :class="column.class"
    >
      <template #body="{ data }">
        <WMRenderTableFieldBody v-model="data[column.field]" :column-data="column" />
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

// DEPENDENCIES
const { getUsers } = useAdminUsers();

// INJECT

// PROPS, EMITS

// REFS
const editingRows = ref([]);

// const selectedContacts = ref([]);
// const contacts = ref([]);
const totalRecords = ref(0);
// const showControls = ref(true);
const users = ref([]);

const columns = [
  {
    name: "first_name",
    type: "text",
    field: "first_name",
    header: "first_name",
  },
  {
    name: "id",
    type: "link",
    field: "link_detail",
    header: "id",
    routeName: "adminUserDetail",
  },
];

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  let response = await getUsers();
  users.value = response.data;
  totalRecords.value = response.totalRecords;
};

loadLazyData();

// const onSelectionChanged = (event) => {
//   selectedContacts.value = event;
// };

// const onPage = (event) => {
//   console.log(event);
// };

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
