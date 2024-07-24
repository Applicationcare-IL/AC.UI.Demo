<template>
  <WMListSubHeader
    entity="employee"
    :total-records="0"
    :show-communications="false"
    :show-search-bar="false"
    :show-filter-button="false"
    :has-action-builder="false"
    @new="toggleSidebarVisibility"
  >
    <template #custom-buttons>
      <WMButton :text="'Activate'" type="type-5" @click="handleActivateUsers">
        <template #customIcon>
          <div class="flex" v-html="ActivateUserIcon" />
        </template>
      </WMButton>
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
    <WMAdminUserTable ref="adminUserTable" />
  </div>
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";

import ActivateUserIcon from "/icons/activate_user.svg?raw";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const utilsStore = useUtilsStore();
const { can } = usePermissions();

// INJECT

// PROPS, EMITS

// REFS
const adminUserTable = ref();
const isVisible = ref(false);

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

const handleActivateUsers = () => {
  alert("activate users");
  // adminUserTable.value.activateUsers();
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  utilsStore.entity = "employee";
});
</script>

<style scoped lang="scss"></style>
