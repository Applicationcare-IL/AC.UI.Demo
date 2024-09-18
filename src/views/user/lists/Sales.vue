<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <WMListSubHeader
    entity="sale"
    :total-records="0"
    :show-communications="true"
    :has-action-builder="false"
    @new="toggleSidebarVisibility"
  >
    <template #top-left>
      <WMStateToggle entity="sale" />
    </template>
  </WMListSubHeader>

  <WMSidebar :visible="isVisible" name="newsale" @close-sidebar="closeSidebar">
    <template v-if="can('sales.create')">
      sidebar
      <!-- <WMNewEntityFormHeader entity="sale" name="newsale" />
        <WMNewsaleForm
            :is-sidebar="true"
            @close-sidebar="closeSidebar"
            @new-sale-created="handleNewSaleCreated"
        />
      </template>
      <template v-else>
        <div class="m-5">
          {{ $t("permissions.you-dont-have-permission") }}
        </div> -->
    </template>
  </WMSidebar>

  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <WMSalesTable
      ref="salesTable"
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

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const utilsStore = useUtilsStore();
const { can } = usePermissions();

// INJECT

// PROPS, EMITS

// REFS
const salesTable = ref();
const isVisible = ref(false);

const columns = [
  {
    name: "id",
    type: "link",
    field: "link_detail",
    header: "id",
    routeName: "adminSaleDetail",
  },
  {
    name: "contact",
    type: "link",
    field: "",
    header: "contact",
    routeName: "",
  },
  {
    name: "customer",
    type: "link",
    field: "",
    header: "customer",
    routeName: "",
  },
  {
    name: "sale-type",
    type: "text",
    field: "",
    header: "sale-type",
  },
  {
    name: "sale-source",
    type: "text",
    field: "",
    header: "sale-source",
  },
  {
    name: "tender",
    type: "checkbox",
    field: "",
    header: "tender",
  },
  {
    name: "initiator",
    type: "link",
    field: "",
    header: "initiator",
    routeName: "",
  },
  {
    name: "start-date",
    type: "date",
    field: "start_date",
    header: "start-date",
  },
  {
    name: "end-date",
    type: "date",
    field: "end_date",
    header: "end-date",
  },
  {
    name: "sla",
    type: "sla",
    field: "",
    header: "sla",
  },
  {
    name: "stage-in-sale",
    type: "text",
    field: "",
    header: "stage-in-sale",
  },
  {
    name: "owner",
    type: "text",
    field: "",
    header: "owner",
  },
  {
    name: "waiting-for-customers",
    type: "checkbox",
    field: "",
    header: "waiting-for-customers",
  },
  {
    name: "open-tasks",
    type: "tasks",
    field: "",
    header: "open-tasks",
  },
  {
    name: "breached-tasks",
    type: "tasks",
    field: "",
    header: "breached-tasks",
  },
  {
    name: "deal-price-base",
    type: "currency",
    field: "",
    header: "deal-price-base",
  },
  {
    name: "total-discount",
    type: "currency",
    field: "",
    header: "total-discount",
  },
  {
    name: "deal-price-final",
    type: "currency",
    field: "",
    header: "deal-price-final",
  },
  {
    name: "budget",
    type: "currency",
    field: "",
    header: "budget",
  },
  {
    name: "last-change",
    type: "date",
    field: "last_change_date",
    header: "last-change",
  },
];

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Sales",
});

const toggleSidebarVisibility = () => {
  isVisible.value = !isVisible.value;
};

const closeSidebar = () => {
  isVisible.value = false;
};

// const handleNewSaleCreated = () => {
//   salesTable.value.loadLazyData();
// };

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  utilsStore.entity = "sale";
});
</script>

<style scoped lang="scss"></style>
