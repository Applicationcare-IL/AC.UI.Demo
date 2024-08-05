<template>
  <!-- search -->
  <WMInputSearch
              name="newUser"
              :placeholder="$t('select', ['contact'])"
              type="table"
              :label="$t('contact.contacts') + ':'"
              width="160"
              :highlighted="true"
              :search-function="searchUsers"
              :new="true"
              related-sidebar="newUser"
              :multiple="true"
              @change="onUserSelected"
          />
<!--          <pre>{{ selectedUsers }}</pre>-->
  <!-- table -->
  <DataTable
      lazy
      :value="selectedUsers"
      data-key="id"
      scrollable
      paginator
      :rows="10"
      :total-records="selectedUsers.length"
      class="w-full"
      @page="onPage($event)"
      @update:selection="onSelectionChanged"
  >
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
import {ref} from "vue";

import useAdminUsers from "@/composables/useAdminUsers";

// DEPENDENCIES
const { getUsers }= useAdminUsers();

// INJECT

// PROPS, EMITS

// REFS
const selectedUsers = ref([]);

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
    name: "email",
    type: "text",
    field: "email",
    header: "email",
  },
];

// COMPUTED

// COMPONENT METHODS AND LOGIC
const searchUsers = (query) => {
  let params = {
    per_page: 99999,
    search: query,
  };

  return getUsers(params);
};

const onUserSelected = (newUser) => {
  if (selectedUsers.value.some((contact) => contact.id === newUser.value.id)) {
    return;
  }
  selectedUsers.value.push(newUser.value);
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
