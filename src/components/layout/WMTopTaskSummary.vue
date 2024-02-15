<template>
  <div class="flex mx-4 gap-2">
    <div>
      <div class="class px-3 flex align-items-center" @click="toggleReminders">
        <span>תזכורות</span>
        <span class="bg-yellow-500 px-2 py-1 mx-1 border-round-lg text-white">
          {{ reminders?.totalRecords || 0 }}
        </span>
      </div>
      <OverlayPanel
        ref="isRemindersOpen"
        :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
      >
        <Button class="my-2 text-white">
          <router-link to="/tasks" class="text-white">{{
            $t("task.all-reminders")
          }}</router-link>
        </Button>
        <WMTasksTable
          :columns="taskSummaryColumns"
          :hide-title="true"
          :show-header-options="false"
          :show-pagination="false"
          :rows="5"
          :multiselect="false"
          :filters="reminderFilters"
        />
      </OverlayPanel>
    </div>

    <div>
      <div class="class px-3 flex align-items-center" @click="toggleFollowUps">
        <span>מעקבים</span>
        <span class="bg-yellow-500 px-2 py-1 mx-1 border-round-lg text-white">
          {{ followUps?.totalRecords || 0 }}
        </span>
      </div>
      <OverlayPanel
        ref="isFollowUpOpen"
        :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
      >
        <Button class="my-2">
          <router-link to="/tasks" class="text-white">{{
            $t("task.all-follow-ups")
          }}</router-link>
        </Button>
        <WMTasksTable
          :columns="taskSummaryColumns"
          :hide-title="true"
          :show-header-options="false"
          :show-pagination="false"
          :rows="5"
          :multiselect="false"
          :filters="followUpFilters"
        />
      </OverlayPanel>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

import { useLayout } from "@/layout/composables/layout";
import { useOptionSetsStore } from "@/stores/optionSets";

const { layoutConfig } = useLayout();

const { getTasksFromApi } = useTasks();

const optionSetsStore = useOptionSetsStore();

onMounted(() => {
  fillTasksCounters();
});

const taskTypes = ref(optionSetsStore.taskTypes);
const reminderIds = ref();
const followUpIds = ref();
const reminders = ref();
const followUps = ref();
const reminderFilters = ref();
const followUpFilters = ref();

const { getTaskSummaryColumns } = useListUtils();

const taskSummaryColumns = ref(getTaskSummaryColumns());

const fillTasksCounters = () => {
  const activeStateId = optionSetsStore.optionSets["state"].find(
    (state) => state.value === "active"
  )["id"];

  reminderIds.value = taskTypes.value
    .filter((type) => {
      return type.internal_type === "reminder";
    })
    .map((type) => type.id);

  reminderFilters.value = {
    task_type: [...reminderIds.value],
    state: activeStateId,
    order_by: "due_date",
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
</script>
