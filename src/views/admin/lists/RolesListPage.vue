<template>
  <WMListSubHeader
      entity="role"
      :total-records="0"
      @new="toggleSidebarVisibility"
      :showSearchBar="false"
      :showFilterButton="false"
      :hasActionBuilder="false"
      :showCommunications="false"
  >
  </WMListSubHeader>

  <WMSidebar :visible="isVisible" name="newRole" @close-sidebar="closeSidebar">
    <template v-if="can('role.create')">
      <WMNewEntityFormHeader entity="role" name="newRole" />
      <WMNewRoleForm :is-sidebar="true" @close-sidebar="closeSidebar" />
    </template>
    <template v-else>
      <div class="m-5">
        {{ $t("permissions.you-dont-have-permission") }}
      </div>
    </template>
  </WMSidebar>

  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <WMAdminRolesTable ref="adminRoleTable" @update:selection="onSelectionChanged" />
  </div>
</template>

<script setup>
// IMPORTS
import {onMounted, ref} from "vue";

import {useUtilsStore} from "@/stores/utils";

// DEPENDENCIES
const utilsStore = useUtilsStore();
const { can } = usePermissions();

// INJECT

// PROPS, EMITS

// REFS
const isVisible = ref(false);
const adminRoleTable = ref();
const selectedRoles = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Roles",
});

const onSelectionChanged = (newSelectedRoles) => {
  selectedRoles.value = newSelectedRoles;
};

const toggleSidebarVisibility = () => {
  isVisible.value = !isVisible.value;
}

const closeSidebar = () => {
  isVisible.value = false;
}

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  utilsStore.entity = "role";
});

</script>

<style scoped lang="scss"></style>
