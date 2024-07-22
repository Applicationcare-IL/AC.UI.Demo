<template>
  <!-- <pre>lazyParams: {{ lazyParams }}</pre> -->
  <!-- <pre>{{ users }}</pre> -->
  <DataTable
    v-model:selection="selectedUsers"
    lazy
    :value="users"
    data-key="id"
    scrollable
    paginator
    :rows="10"
    :total-records="totalRecords"
    class="w-full"
    @page="onPage($event)"
  >
    <Column style="width: 40px" selection-mode="multiple" />
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
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

// DEPENDENCIES
const { getUsers } = useAdminUsers();

// INJECT

// PROPS, EMITS

// REFS
const selectedUsers = ref([]);
const totalRecords = ref(0);
const users = ref([]);
const lazyParams = ref({});

const columns = [
  {
    name: "id",
    type: "link",
    field: "link_detail",
    header: "id",
    routeName: "adminUserDetail",
  },
  {
    name: "username",
    type: "text",
    field: "username",
    header: "employee.username",
  },

  {
    name: "phone",
    type: "text",
    field: "phone",
    header: "mobilephone",
  },
  {
    name: "email",
    type: "text",
    field: "email",
    header: "email",
  },
  {
    name: "active",
    type: "state",
    field: "active",
    header: "state.state",
    width: "100px",
    class: "p-0 filled-td",
  },
];

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  const nextPage = lazyParams.value.page + 1;

  const params = {
    page: nextPage,
    per_page: 10,
  };

  let response = await getUsers(params);
  users.value = response.data;
  totalRecords.value = response.totalRecords;
};

loadLazyData();

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

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
