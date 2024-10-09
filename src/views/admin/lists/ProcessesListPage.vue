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
    @new="toggleSidebarVisibility"
  >
    <template #top-left>
      <WMStateToggle entity="process" />
    </template>
  </WMListSubHeader>

  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <WMAdminProcessTable
      ref="adminProcessTable"
      :columns="columns"
      preview
      selectable
      @update:selection="onSelectionChanged"
    />
  </div>
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

// DEPENDENCIES

// INJECT

// PROPS, EMITS

// REFS
const options = [
  { value: "service", label: "Processes service" },
  {
    value: "sales",
    label: "Processes sales",
  },
  { value: "project", label: "Processes project" },
];

const selectedOption = ref();
const columns = [
  {
    name: "id",
    type: "link",
    field: "link_detail",
    header: "id",
  },
  {
    name: "name",
    type: "text",
    field: "name",
    header: "processes.service-name",
  },
  {
    name: "duracion",
    type: "text",
    field: "duration",
    header: "processes.duration",
  },
  {
    name: "number-of-stages",
    type: "text",
    field: "number_of_stages",
    header: "processes.number-of-stages",
  },
  {
    name: "default-team",
    type: "text",
    field: "default_team",
    header: "processes.default-team",
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

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
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
