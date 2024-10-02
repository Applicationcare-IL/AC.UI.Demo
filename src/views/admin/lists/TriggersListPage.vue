<template>
  <WMListSubHeader
    entity="trigger"
    :total-records="0"
    :show-communications="false"
    :has-action-builder="false"
    @new="redirectToNewTriggerPage"
  >
    <template #top-left>
      <WMStateToggle entity="trigger" />
    </template>
  </WMListSubHeader>

  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <WMAdminTriggersTable
      ref="adminTriggerTable"
      :columns="columns"
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
const adminTriggerTable = ref();

const columns = [
  {
    name: "id",
    type: "link",
    field: "link_detail",
    header: "id",
    routeName: "adminTriggerDetail",
  },
  {
    name: "trigger-name",
    type: "text",
    field: "",
    header: "trigger.name",
  },
  {
    name: "description",
    type: "text",
    field: "",
    header: "description",
  },
  {
    name: "entity",
    type: "text",
    field: "",
    header: "entity",
  },
  {
    name: "entity-type",
    type: "text",
    field: "",
    header: "trigger.event-type",
  },
  {
    name: "run",
    type: "text",
    field: "",
    header: "trigger.run-once",
  },
  {
    name: "action-trigger",
    type: "text",
    field: "",
    header: "trigger.actions-in-trigger",
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

const redirectToNewTriggerPage = () => {
  router.push({
    name: "newTrigger",
    force: true,
  });
};

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Triggers",
});

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  utilsStore.entity = "trigger";
});
</script>

<style scoped lang="scss"></style>
