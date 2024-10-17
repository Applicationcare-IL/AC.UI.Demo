<template>
  <WMListSelector
    class="list-selector"
    entity="processes"
    :options="options"
    @update:selected-option="changeSelectedOption"
  />
  <WMListSubHeader
    entity="process"
    :total-records="0"
    :show-communications="false"
    :has-action-builder="false"
    :show-filter-button="false"
    @new="redirectToNewProcessPage"
  >
    <template #top-left>
      <WMStateToggle entity="process" />
    </template>
  </WMListSubHeader>

  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <WMAdminProcessServiceTable
      v-show="selectedOption === 'service'"
      ref="adminProcessTable"
      :columns="columnsService"
      preview
      selectable
      @update:selection="onSelectionChanged"
    />
    <WMAdminProcessSaleTable
      v-show="selectedOption === 'sale'"
      ref="adminProcessTable"
      :columns="columnsSale"
      preview
      selectable
      @update:selection="onSelectionChanged"
    />
    <WMAdminProcessProjectTable
      v-show="selectedOption === 'project'"
      ref="adminProcessTable"
      :columns="columnsProject"
      preview
      selectable
      @update:selection="onSelectionChanged"
    />
  </div>
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const utilsStore = useUtilsStore();
const router = useRouter();

// INJECT

// PROPS, EMITS

// REFS
const options = [
  { value: "service", label: "Processes service" },
  {
    value: "sale",
    label: "Processes sale",
  },
  { value: "project", label: "Processes project" },
];

const selectedOption = ref(options[0].value);

const columnsService = [
  {
    name: "id",
    type: "link",
    field: "link_detail",
    header: "id",
    routeName: "adminProcessDetail",
  },
  {
    name: "name",
    type: "text",
    field: "name",
    header: "process.service-process-name",
  },
  {
    name: "duracion",
    type: "text",
    field: "duration",
    header: "process.duration",
  },
  {
    name: "number-of-stages",
    type: "text",
    field: "number_of_stages",
    header: "process.number-of-stages",
  },
  {
    name: "default-team",
    type: "text",
    field: "default_team",
    header: "process.default-team",
  },
  {
    name: "status",
    type: "state",
    field: "state",
    header: "status",
    width: "100px",
    class: "filled-td",
  },
];

const columnsSale = [
  {
    name: "id",
    type: "link",
    field: "link_detail",
    header: "id",
    routeName: "adminProcessDetail",
  },
  {
    name: "name",
    type: "text",
    field: "name",
    header: "process.sale-process-name",
  },
  {
    name: "duracion",
    type: "text",
    field: "duration",
    header: "process.duration",
  },
  {
    name: "number-of-stages",
    type: "text",
    field: "number_of_stages",
    header: "process.number-of-stages",
  },
  {
    name: "default-team",
    type: "text",
    field: "default_team",
    header: "process.default-team",
  },
  {
    name: "status",
    type: "state",
    field: "state",
    header: "status",
    width: "100px",
    class: "filled-td",
  },
];

const columnsProject = [
  {
    name: "id",
    type: "link",
    field: "link_detail",
    header: "id",
    routeName: "adminProcessDetail",
  },
  {
    name: "name",
    type: "text",
    field: "name",
    header: "process.project-process-name",
  },
  {
    name: "duracion",
    type: "text",
    field: "duration",
    header: "process.duration",
  },
  {
    name: "number-of-stages",
    type: "text",
    field: "number_of_stages",
    header: "process.number-of-stages",
  },
  {
    name: "default-team",
    type: "text",
    field: "default_team",
    header: "process.default-team",
  },
  {
    name: "status",
    type: "state",
    field: "state",
    header: "status",
    width: "100px",
    class: "filled-td",
  },
];

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Processes",
});

const changeSelectedOption = (option) => {
  selectedOption.value = option.value;
};

const redirectToNewProcessPage = () => {
  router.push({
    name: "newProcess",
    force: true,
    params: { entity: selectedOption.value },
  });
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  utilsStore.entity = "process";
});
</script>

<style scoped lang="scss">
.list-selector {
  position: relative;
  z-index: 2;

  &::after {
    content: "";
    display: block;
    width: 100%;
    height: 10px;
    background: white;
    position: absolute;
    left: 0;
    bottom: -5px;
  }
}
</style>
