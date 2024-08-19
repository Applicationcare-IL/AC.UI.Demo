<template>
  <!-- search -->
  <WMInputSearch
    name="userList"
    :placeholder="$t('select', ['user'])"
    type="table"
    :label="$t('add-user') + ':'"
    size="lg"
    :highlighted="true"
    :search-function="searchUsers"
    :new="true"
    related-sidebar="newUser"
    :multiple="true"
    @change="onUserSelected"
  />
<!--   table -->
  <DataTable
      lazy
      :value="selectedUsers"
      data-key="id"
      scrollable
      paginator
      :rows="10"
      :total-records="selectedUsers.length"
      class="w-full"
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
    <Column
        :header="$t('actions')"
        style="width: 40px">
      <template #body="{ data }">
        <WMUnlinkButtonIconOnly @click="unlinkUser(data.id)" />
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
const searchUsers = async (query) => {
  let params = {
    per_page: 99999,
    search: query,
    state: 291,
  };

  let response = await getUsers(params);

  if(selectedUsers.value.length > 0 ){
    let usersFiltered = response.data.filter((userFromApi) => !isUserSelected(userFromApi));

    return {data: usersFiltered};
  }

  return response;
};

const onUserSelected = (newUser) => {
  if (selectedUsers.value.some((contact) => contact.id === newUser.value.id)) {
    return;
  }
  selectedUsers.value.push(newUser.value);
};

const isUserSelected = (user) => {
  return selectedUsers.value.some((selectedUser) => selectedUser.id === user.id);
}

const unlinkUser = (userId) => {
  selectedUsers.value = selectedUsers.value.filter((user) => {
    return user.id !== userId;
  });
}

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
