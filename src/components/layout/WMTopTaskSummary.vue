<template>
  <div class="flex mx-4 gap-2">
    <div>
      <div
        class="class px-3 flex gap-1 align-items-center justify-content-center"
        @click="toggleReminders"
      >
        <span class="font-bold">תזכורות</span>
        <span
          class="bg-blue-100 font-bold px-2 py-1 mx-1 border-round-lg text-blue-700 flex"
        >
          {{ reminders?.totalRecords || 0 }}
        </span>
      </div>
      <OverlayPanel
        ref="isRemindersOpen"
        :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
      >

        <WMNewButton v-if="can('tasks.create')" :text="$t('buttons.new')" @click="toggleSidebarVisibility" />

        <WMTasksTable
          :columns="taskSummaryColumns"
          :hide-title="true"
          :show-header-options="false"
          :show-pagination="false"
          :rows="15"
          :multiselect="false"
          :filters="reminderFilters"
        />
      </OverlayPanel>
    </div>

    <div>
      <div
        class="class px-3 flex gap-1 align-items-center justify-content-center"
        @click="toggleFollowUps"
      >
        <span class="font-bold">מעקבים</span>
        <span
          class="bg-blue-100 font-bold px-2 py-1 mx-1 border-round-lg text-blue-700"
        >
          {{ followUps?.totalRecords || 0 }}
        </span>
      </div>
      <OverlayPanel
        ref="isFollowUpOpen"
        :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
      >

        <WMNewButton v-if="can('tasks.create')" :text="$t('buttons.new')" @click="toggleSidebarVisibility" />

        <WMTasksTable
          :columns="taskSummaryColumns"
          :hide-title="true"
          :show-header-options="false"
          :show-pagination="false"
          :rows="15"
          :multiselect="false"
          :filters="followUpFilters"
        />
      </OverlayPanel>
    </div>
  </div>
  <WMSidebar
    :visible="isVisible"
    name="WMTopTaskSummary.newTask"
    @close-sidebar="closeSidebar"
    @open-sidebar="openSidebar"
  >
    <WMNewTaskForm :is-sidebar="true" @new-task-created="closeSidebar" />
  </WMSidebar>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { watch } from "vue";
import { useRoute } from "vue-router";

import { useLayout } from "@/layout/composables/layout";
import { useOptionSetsStore } from "@/stores/optionSets";

const { layoutConfig } = useLayout();

const { getTasksFromApi, getTaskTypes } = useTasks();

const optionSetsStore = useOptionSetsStore();

const { can } = usePermissions();

const route = useRoute();

onMounted(() => {
  fillTasksCounters();
});

//Refresh on every route change
watch(
  () => route.fullPath,
  async () => {
    fillTasksCounters();
  }
);

const taskTypes = ref();
const reminderIds = ref();
const followUpIds = ref();
const reminders = ref();
const followUps = ref();
const reminderFilters = ref();
const followUpFilters = ref();

const { getTaskSummaryColumns } = useListUtils();

const taskSummaryColumns = ref(getTaskSummaryColumns());
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();

const fillTasksCounters = async () => {
  const activeStateId = await optionSetsStore.getValueId("state", "active");
  taskTypes.value = await getTaskTypes();

  reminderIds.value = taskTypes.value
    .filter((type) => {
      return type.internal_type === "reminder";
    })
    .map((type) => type.id);

  reminderFilters.value = {
    task_type: [...reminderIds.value],
    state: activeStateId,
    order_by: "due_date",
    employee: authStore.user.id,
  };

  const reminderParams = new URLSearchParams({
    ...reminderFilters.value,
    per_page: 5,
  });

  getTasksFromApi(reminderParams).then((res) => (reminders.value = res));

  followUpIds.value = taskTypes.value
    .filter((type) => {
      return type.internal_type === "follow_up";
    })
    .map((type) => type.id);

  followUpFilters.value = {
    task_type: [...followUpIds.value],
    state: activeStateId,
    order_by: "due_date",
    employee: authStore.user.id,
  };

  const followUpParams = new URLSearchParams({
    ...followUpFilters.value,
    per_page: 5,
  });

  getTasksFromApi(followUpParams).then((res) => (followUps.value = res));
};

const isRemindersOpen = ref();

const toggleReminders = (event) => {
  isRemindersOpen.value.toggle(event);
};

const isFollowUpOpen = ref();

const toggleFollowUps = (event) => {
  isFollowUpOpen.value.toggle(event);
};

//Display sidebars
const isVisible = ref(false);

function toggleSidebarVisibility() {
  isVisible.value = !isVisible.value;
}

function closeSidebar() {
  isVisible.value = false;
}

function openSidebar() {
  isVisible.value = true;
}
</script>
