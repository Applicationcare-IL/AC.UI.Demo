<template>
  <WMListSubHeader
    entity="employee"
    :total-records="0"
    :show-communications="false"
    :has-action-builder="false"
    @new="toggleSidebarVisibility"
  >
    <template #custom-buttons>
      <WMActivateAdminUsersButton
        :selected-users="selectedUsers"
        @activate-user="handleActivateUser"
      />
    </template>
  </WMListSubHeader>

  <WMSidebar :visible="isVisible" name="newUser" @close-sidebar="closeSidebar">
    <template v-if="can('employees.create')">
      <WMNewEntityFormHeader entity="employee" name="newUser" />
      <WMNewUserForm
        :is-sidebar="true"
        @close-sidebar="closeSidebar"
        @new-user-created="handleNewUserCreated"
      />
    </template>
    <template v-else>
      <div class="m-5">
        {{ $t("permissions.you-dont-have-permission") }}
      </div>
    </template>
  </WMSidebar>

  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <WMAdminUserTable ref="adminUserTable" @update:selection="onSelectionChanged" />
  </div>
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const utilsStore = useUtilsStore();
const { can } = usePermissions();

// INJECT

// PROPS, EMITS

// REFS
const adminUserTable = ref();
const isVisible = ref(false);
const selectedUsers = ref([]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Users",
});

const toggleSidebarVisibility = () => {
  isVisible.value = !isVisible.value;
};

const closeSidebar = () => {
  isVisible.value = false;
};

const handleNewUserCreated = () => {
  adminUserTable.value.loadLazyData();
};

const onSelectionChanged = (newSelectedUsers) => {
  selectedUsers.value = newSelectedUsers;
};

const handleActivateUser = () => {
  adminUserTable.value.loadLazyData();
  adminUserTable.value.cleanSelectedUsers();
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  utilsStore.entity = "employee";
});
</script>

<style scoped lang="scss"></style>
