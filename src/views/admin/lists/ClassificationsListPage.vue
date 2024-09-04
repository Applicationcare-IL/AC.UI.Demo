<template>
  <WMListSelector
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
      <WMStateToggle entity="classification"/>
    </template>
  </WMListSubHeader>
  <span v-if="selectedOption === 'service'">Opcion service</span>
  <span v-if="selectedOption === 'task'">Opcion sales</span>
  <span v-if="selectedOption === 'project'">Opcion project</span>

  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <WMAdminClassificationTable
        ref="adminMessageTable"
        :columns="columns"
        preview
        selectable
        @update:selection="onSelectionChanged"
    />
  </div>

</template>

<script setup>
// IMPORTS
import {onMounted, ref} from "vue";

import {useUtilsStore} from "@/stores/utils";

// DEPENDENCIES
const utilsStore = useUtilsStore();
const {can} = usePermissions();

// INJECT

// PROPS, EMITS

// REFS
const options = [
  {value: 'service', label: 'Service classifications'},
  {value: 'task', label: 'Task classifications'},
  {value: 'project', label: 'Project classifications'},
]

const columns = ref([]);
const culumns2 = ref([]);

culumns2.value['service'] = [
  {
    name: "id",
    type: "link",
    field: "link_detail",
    header: "id",
    routeName: "adminMessageDetail",
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
    field: "service_area",
    header: "service-area",
  },
  {
    name: "service-detail",
    type: "text",
    field: "service_detail",
    header: "service-detail",
  },
  {
    name: "request-1",
    type: "text",
    field: "request_1",
    header: "request-1",
  },
  {
    name: "request-2",
    type: "text",
    field: "request_2",
    header: "request-2",
  },
  {
    name: "request-3",
    type: "text",
    field: "request_3",
    header: "request-3",
  },
];

culumns2.value['task'] = [
  {
    name: "id",
    type: "link",
    field: "link_detail",
    header: "id",
    routeName: "adminMessageDetail",
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
    type: "link",
    field: "",
    header: "task-family",
  },
  {
    name: "task-type",
    type: "link",
    field: "",
    header: "task-type",
  },
];

culumns2.value['project'] = [
  {
    name: "id",
    type: "link",
    field: "link_detail",
    header: "id",
    routeName: "adminMessageDetail",
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
    type: "link",
    field: "",
    header: "service-area",
  },
  {
    name: "project-area",
    type: "link",
    field: "",
    header: "service-area",
  },
  {
    name: "project-detail",
    type: "link",
    field: "",
    header: "project-detail",
  },
];

const selectedOption = ref();
const adminClassificationTable = ref();
const isVisible = ref(false);

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Classifications",
});

const changeSelectedOption = (option) => {
  columns.value = culumns2.value[option.value];
}

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

  columns.value = culumns2.value['service'];
});
</script>

<style scoped lang="scss"></style>
