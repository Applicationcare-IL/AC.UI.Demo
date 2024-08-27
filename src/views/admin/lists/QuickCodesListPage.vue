<template>
  <WMListSubHeader
      entity="quickCode"
      :total-records="0"
      @new="toggleSidebarVisibility"
      :hasActionBuilder="false"
      :showCommunications="false"
  />

  <WMSidebar :visible="isVisible" name="newQuickCode" @close-sidebar="closeSidebar">
    <template v-if="can('quickCodes.create')">
      <WMNewEntityFormHeader entity="quickCode" name="newQuickCode" />
      <WMNewQuickCodeForm :is-sidebar="true" @close-sidebar="closeSidebar" />
    </template>
    <template v-else>
      <div class="m-5">
        {{ $t("permissions.you-dont-have-permission") }}
      </div>
    </template>
  </WMSidebar>

  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <WMAdminQuickCodesTable
        ref="adminQuickCodesTable"
        :columns="columns"
        preview
        selectable
        @update:selection="onSelectionChanged"
    />
  </div>
</template>

<script setup>
// IMPORTS
import { useUtilsStore } from "@/stores/utils";
import { onMounted, ref } from "vue";
import WMAdminQuickCodesTable from "@/components/tables/WMAdminQuickCodesTable.vue";

// DEPENDENCIES
const utilsStore = useUtilsStore();
const { can } = usePermissions();

// INJECT

// PROPS, EMITS

// REFS
const adminUserTable = ref();
const isVisible = ref(false);
const selectedUsers = ref([]);

const columns = [
  {
    name: "id",
    type: "link",
    field: "link_detail",
    header: "id",
    routeName: "",
  },
  {
    name: "quick-code-name",
    type: "text",
    field: "name",
    header: "employee.username",
  },
  {
    name: "team",
    type: "text",
    field: "",
    header: "team",
  },
  {
    name: "active",
    type: "state",
    field: "state",
    header: "state.state",
    width: "100px",
    class: "filled-td",
  },
  {
    name: "service-area",
    type: "text",
    field: "",
    header: "service area",
  },
  {
    name: "service-detail",
    type: "text",
    field: "",
    header: "service detail",
  },
  {
    name: "request-1",
    type: "text",
    field: "",
    header: "Request 1",
  },
  {
    name: "request-2",
    type: "text",
    field: "",
    header: "Request 2",
  },
  {
    name: "request-3",
    type: "text",
    field: "",
    header: "Request 3",
  },
];

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Quick Codes",
});

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
  utilsStore.entity = "quickCode";
});
</script>

<style scoped lang="scss"></style>
