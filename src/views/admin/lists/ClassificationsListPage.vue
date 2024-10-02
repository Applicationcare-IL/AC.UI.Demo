<template>
  <WMListSelector
    class="list-selector"
    entity="classification"
    :options="options"
    @update:selected-option="changeSelectedOption"
  />
  <WMListSubHeader
    entity="classification"
    :total-records="0"
    :show-communications="false"
    :has-action-builder="false"
    @new="toggleSidebarVisibility"
  >
    <template #top-left>
      <WMStateToggle entity="classification" />
    </template>
  </WMListSubHeader>

  <WMSidebar :visible="isVisible" name="newClassification" @close-sidebar="closeSidebar">
    <WMClassificationsNewServiceArea
      v-if="selectedOption === 'service'"
      @close-sidebar="closeSidebar"
    />

    <WMClassificationsNewTaskFamily
      v-if="selectedOption === 'task'"
      @close-sidebar="closeSidebar"
    />

    <WMClassificationsNewProjectType
      v-if="selectedOption === 'project'"
      @close-sidebar="closeSidebar"
    />
  </WMSidebar>

  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <WMAdminClassificationTable
      ref="adminMessageTable"
      :columns="selectedColumns"
      :entity-type="selectedOption"
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

// INJECT

// PROPS, EMITS

// REFS
const options = [
  { value: "service", label: "Service classifications" },
  { value: "task", label: "Task classifications" },
  { value: "project", label: "Project classifications" },
];

const selectedColumns = ref([]);
const columns = ref([]);

columns.value["service"] = [
  {
    name: "id",
    type: "link",
    field: "link_detail",
    header: "id",
  },
  {
    name: "status",
    type: "state",
    field: "state",
    header: "status",
    width: "100px",
    class: "filled-td",
  },
  {
    name: "service-area",
    type: "text",
    field: "service_area_name",
    header: "service-area",
  },
  {
    name: "service-detail",
    type: "text",
    field: "service_type_name",
    header: "service-detail",
  },
  {
    name: "request-1",
    type: "text",
    field: "service_request_1_name",
    header: "request-1",
  },
  {
    name: "request-2",
    type: "text",
    field: "service_request_2_name",
    header: "request-2",
  },
  {
    name: "request-3",
    type: "text",
    field: "service_request_3_name",
    header: "request-3",
  },
];

columns.value["task"] = [
  {
    name: "id",
    type: "link",
    field: "link_detail",
    header: "id",
  },
  {
    name: "status",
    type: "state",
    field: "state",
    header: "status",
    width: "100px",
    class: "filled-td",
  },
  {
    name: "task-family",
    type: "text",
    field: "task_family_name",
    header: "task.family",
  },
  {
    name: "task-type",
    type: "text",
    field: "task_type_name",
    header: "task.type",
  },
];

columns.value["project"] = [
  {
    name: "id",
    type: "link",
    field: "link_detail",
    header: "id",
  },
  {
    name: "status",
    type: "state",
    field: "state",
    header: "status",
    width: "100px",
    class: "filled-td",
  },
  {
    name: "project-area",
    type: "text",
    field: "project_type_name",
    header: "project.project_type",
  },
  {
    name: "project-area",
    type: "text",
    field: "project_area_name",
    header: "project.project_area",
  },
  {
    name: "project-detail",
    type: "text",
    field: "project_detail_name",
    header: "project.project_detail",
  },
];

const selectedOption = ref(options[0].value);
const adminClassificationTable = ref();
const isVisible = ref(false);

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Classifications",
});

const changeSelectedOption = (option) => {
  selectedColumns.value = columns.value[option.value];
  selectedOption.value = option.value;
};

const toggleSidebarVisibility = () => {
  isVisible.value = !isVisible.value;
};

const closeSidebar = () => {
  isVisible.value = false;
};

const handleNewClassificationCreated = () => {
  adminClassificationTable.value.loadLazyData();
};
// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  utilsStore.entity = "classification";

  selectedColumns.value = columns.value["service"];
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
