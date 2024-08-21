<template>
  <WMListSubHeader
    entity="message"
    :total-records="0"
    :show-search-bar="false"
    :show-communications="false"
    :show-filter-button="false"
    :has-action-builder="false"
    @new="toggleSidebarVisibility"
  >
  </WMListSubHeader>

  <WMSidebar :visible="isVisible" name="newMessage" @close-sidebar="closeSidebar">
    <template v-if="can('messages.create')">
      <WMNewEntityFormHeader entity="message" name="newMessage" />
      <WMNewMessageForm :is-sidebar="true" @close-sidebar="closeSidebar" />
    </template>
    <template v-else>
      <div class="m-5">
        {{ $t("permissions.you-dont-have-permission") }}
      </div>
    </template>
  </WMSidebar>

  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <WMAdminMessagesTable
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
import { onMounted, ref } from "vue";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const utilsStore = useUtilsStore();
const { can } = usePermissions();

// INJECT

// PROPS, EMITS

// REFS
const adminMessageTable = ref();
const isVisible = ref(false);

const columns = [
  {
    name: "id",
    type: "link",
    field: "link_detail",
    header: "id",
    routeName: "adminMessageDetail",
  },
  {
    name: "target",
    type: "target",
    field: "target",
    header: "message.target",
    width: "100px",
    class: "p-0 filled-td",
  },
  {
    name: "message-header",
    type: "text",
    field: "topic",
    header: "message.header",
  },
  {
    name: "message-content",
    type: "text",
    field: "message",
    header: "message.content",
  },
  {
    name: "rating",
    type: "important",
    field: "important",
    header: "message.rating",
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
];

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Messages",
});

const toggleSidebarVisibility = () => {
  isVisible.value = !isVisible.value;
};

const closeSidebar = () => {
  isVisible.value = false;
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  utilsStore.entity = "message";
});
</script>

<style scoped lang="scss"></style>
