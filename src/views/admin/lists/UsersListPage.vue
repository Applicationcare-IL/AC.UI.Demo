<template>
  <WMListSubHeader
    entity="employee"
    :total-records="0"
    @new="toggleSidebarVisibility"
    :showSearchBar="false"
    :showFilterButton="false"
    :hasActionBuilder="false"
  >
  </WMListSubHeader>

  <WMSidebar :visible="isVisible" name="newEmployee" @close-sidebar="closeSidebar">
    <template v-if="can('employees.create')">
      <WMNewEntityFormHeader entity="employee" name="newEmployee" />
      <!-- <WMNewContactForm :is-sidebar="true" @close-sidebar="closeSidebar" /> -->
    </template>
    <template v-else>
      <div class="m-5">
        {{ $t("permissions.you-dont-have-permission") }}
      </div>
    </template>
  </WMSidebar>

  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">TABLA</div>
</template>

<script setup>
// IMPORTS
import { onMounted, ref, watch, watchEffect } from "vue";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const utilsStore = useUtilsStore();
const { can } = usePermissions();

// INJECT

// PROPS, EMITS

// REFS
const isVisible = ref(false);

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Users",
});

function toggleSidebarVisibility() {
  isVisible.value = !isVisible.value;
}

function closeSidebar() {
  isVisible.value = false;
}

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  utilsStore.entity = "employee";
});
</script>

<style scoped lang="scss"></style>
