<template>
  <WMListSubHeader
      entity="message"
      :total-records="0"
      @new="toggleSidebarVisibility"
      :showSearchBar="false"
      :showCommunications="false"
      :showFilterButton="false"
      :hasActionBuilder="false"
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
    type: "text",
    field: "",
    header: "message.target",
  },
  {
    name: "message-header",
    type: "text",
    field: "",
    header: "message.header",
  },
  {
    name: "message-content",
    type: "text",
    field: "",
    header: "message.content",
  },
  {
    name: "rating",
    type: "chips",
    field: "",
    header: "message.rating",
  },
  {
    name: "status",
    type: "state",
    field: "",
    header: "status",
  },
  {
    name: "start-date",
    type: "text",
    field: "start_date",
    header: "start-date",
  },
  {
    name: "end-date",
    type: "text",
    field: "end_date",
    header: "end-date",
  },

];

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Messages",
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
  utilsStore.entity = "message";
});
</script>

<style scoped lang="scss"></style>
