<template>
  <WMSidebar
    :visible="isVisible"
    @close-sidebar="closeSidebar"
    @open-sidebar="openSidebar"
    name="newTask"
  >
    <WMNewEntityFormHeader entity="task" name="newTask" />
    <WMNewTaskForm :isSidebar="true" @close-sidebar="closeSidebar" />
  </WMSidebar>

  <h2 v-if="!hideTitle" class="h2">{{ $t("task.tasks") }}</h2>
  <div class="flex flex-column gap-3 mb-3">
    <div class="flex flex-row justify-content-between">
      <div class="flex flex-row">
        <WMButton
          class="m-1 col-6"
          name="new"
          icon="new"
          icon-position="right"
          @click="toggleSidebarVisibility"
          >{{ t("new") }}</WMButton
        >
        <WMAssignOwnerButton entity="task" />
        <WMCompleteTasksButton entity="task"></WMCompleteTasksButton>
      </div>
      <div class="flex flex-row align-items-center gap-3">
        <WMButton
          name="filter"
          icon="filter"
          :open="isFilterOpen"
          :applied="isFilterApplied"
          >{{ t("filter") }}
        </WMButton>
        <SelectButton
          v-model="selectedOption"
          :options="options"
          optionLabel="name"
          class="flex flex-nowrap"
        />
      </div>
    </div>
    <div>
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText
          class="w-30rem"
          v-model="filters['global'].value"
          :placeholder="$t('search')"
        />
      </span>
    </div>
  </div>
  <DataTable
    v-model:filters="filters"
    v-model:selection="selectedTasks"
    :rowClass="rowClass"
    :value="tasks"
    dataKey="task_number"
    tableStyle="min-width: 50rem"
    scrollable
    paginator
    :rows="rows"
    @update:selection="onSelectionChanged"
  >
    <Column
      v-if="multiselect"
      style="width: 40px"
      selectionMode="multiple"
    ></Column>
    <Column
      v-for="column in columns"
      :key="column.name"
      :field="column.name"
      :header="column.header ? $t(column.header) : $t(`task.${column.name}`)"
      :class="column.class"
    >
      <template v-if="column.type === 'link'" #body="slotProps">
        <router-link
          :to="{
            name: 'taskDetail',
            params: { id: slotProps.data.task_number },
          }"
          class="vertical-align-middle"
          >{{ slotProps.data.task_number }}</router-link
        >
      </template>
      <template v-if="column.type === 'detail'">
        <img src="/icons/eye.svg" alt="" class="vertical-align-middle" />
      </template>
      <template v-if="column.type === 'sla'" #body="slotProps">
        <WMSLATag :sla="slotProps.data.sla">
          {{ slotProps.data.days_for_closing }} ימים
        </WMSLATag>
      </template>
      <template v-if="column.type === 'translate'" #body="slotProps">
        {{ $t(column.prefix + "." + slotProps.data[column.name]) }}
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { FilterMatchMode } from "primevue/api";

import { useUtilsStore } from "@/stores/utils";

const { t, locale } = useI18n();

const selectedTasks = ref([]);
const isFilterOpen = ref(false);
const isFilterApplied = ref(false);
const selectedOption = ref(1);

const utilsStore = useUtilsStore();
const i18n = useI18n();

const props = defineProps({
  tasks: Array,
  rows: {
    type: Number,
    default: 10,
  },
  columns: {
    type: Array,
    required: true,
  },
  multiselect: {
    type: Boolean,
    default: true,
  },
  hideTitle: {
    type: Boolean,
    default: false,
  },
});

const { getSelectFilterButtonValues } = useListUtils();

const options = ref();
options.value = getSelectFilterButtonValues("task.tasks", i18n);

watch(locale, () => {
  options.value = getSelectFilterButtonValues("task.tasks", i18n);
});

const rowClass = (data) => {
  return [{ inactive_row: !data.is_open }];
};

// const slaClass = (data) => {
// return getSlaConditionalStyle(data);
// };

const onSelectionChanged = () => {
  console.log(selectedTasks.value);
  utilsStore.selectedElements["task"] = selectedTasks.value;
};

// first sidebar
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

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  "country.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  representative: { value: null, matchMode: FilterMatchMode.IN },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  verified: { value: null, matchMode: FilterMatchMode.EQUALS },
});
</script>
