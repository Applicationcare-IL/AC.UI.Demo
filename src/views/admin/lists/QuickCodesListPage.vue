<template>
  <WMListSubHeader
      entity="quickCode"
      :total-records="0"
      @new="toggleSidebarVisibility"
      :hasActionBuilder="false"
      :showCommunications="false"
  >
    <template #top-left>
      <WMStateToggle entity="quickCode"/>
    </template>
  </WMListSubHeader>

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
import { onMounted, ref } from "vue";

import WMAdminQuickCodesTable from "@/components/tables/WMAdminQuickCodesTable.vue";
import {useUtilsStore} from "@/stores/utils";

// DEPENDENCIES
const utilsStore = useUtilsStore();
const { can } = usePermissions();

// INJECT

// PROPS, EMITS

// REFS
const adminQuickCodesTable = ref();
const isVisible = ref(false);

const columns = [
  {
    name: "id",
    type: "link",
    field: "link_detail",
    header: "id",
    routeName: "adminQuickCodeDetail",
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
    header: "team.team",
  },
  {
    name: "active",
    type: "state",
    field: "state_id",
    header: "state.state",
    width: "100px",
    class: "filled-td",
  },
  {
    name: "service-area",
    type: "text",
    field: "",
    header: "service.service-area",
  },
  {
    name: "service-detail",
    type: "text",
    field: "",
    header: "message.service-detail",
  },
  {
    name: "request-1",
    type: "text",
    field: "request_1_name",
    header: "Request 1",
  },
  {
    name: "request-2",
    type: "text",
    field: "request_2_name",
    header: "Request 2",
  },
  {
    name: "request-3",
    type: "text",
    field: "request_3_name",
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
