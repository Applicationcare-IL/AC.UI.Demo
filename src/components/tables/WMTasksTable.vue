<template>
  <!-- HEADER -->
  <h2 v-if="!hideTitle" class="h2">{{ $t("task.tasks") }}</h2>
  <div v-if="showHeaderOptions" class="flex flex-column gap-3 mb-3">
    <div class="flex flex-row justify-content-between">
      <div class="flex flex-row gap-2">
        <WMButton
          name="new"
          icon="new"
          icon-position="right"
          @click="toggleSidebarVisibility"
          >{{ t("new") }}
        </WMButton>

        <WMSidebar
          :visible="isVisible"
          name="newTask"
          :data="{
            relatedEntity: relatedEntity,
            relatedEntityId: relatedEntityId,
          }"
          @close-sidebar="closeSidebar"
          @open-sidebar="openSidebar"
        >
          <template #default="slotProps">
            <WMNewTaskForm
              :is-sidebar="true"
              :related-entity="slotProps.props.data.relatedEntity"
              :related-entity-id="slotProps.props.data.relatedEntityId"
              @new-task-created="loadLazyData"
            />
          </template>
        </WMSidebar>

        <WMAssignOwnerButton
          v-if="can('tasks.assign')"
          entity="task"
          @owner-assigned="
            loadLazyData();
            clearSelectedTasks();
          "
        />
        <WMCompleteTasksButton
          entity="task"
          @task-completed="
            loadLazyData();
            clearSelectedTasks();
            emit('taskCompleted');
          "
        />
      </div>
      <div v-if="showFilters" class="flex flex-row align-items-center gap-3">
        <WMOwnerToggle entity="task" />
      </div>
    </div>
    <div class="flex flex-row justify-content-between">
      <div class="flex flex-row gap-3">
        <WMSearchBox entity="task" />
        <WMFilterButton
          v-if="showFilter"
          :is-active="isFilterApplied || isFilterVisible"
          @click="openFilterSidebar"
        />

        <WMSidebar
          :visible="isFilterVisible"
          name="filterTask"
          @close-sidebar="closeFilterSidebar"
          @open-sidebar="openFilterSidebar"
        >
          <WMFilterForm entity="task" filter-form-name="task" />
        </WMSidebar>
      </div>
      <WMTablePaginator
        v-if="showPaginationOptions"
        :total-records="totalRecords"
        :current-page="currentPage"
        :current-offset="datatableOffset"
        @update:rows="handleNumberOfRowsPerPage"
      />
    </div>
  </div>

  <!-- TABLE -->
  <DataTable
    v-model:selection="selectedTasks"
    lazy
    :row-class="rowClass"
    :value="tasks"
    data-key="task_number"
    table-style="min-width: 50rem"
    scrollable
    :paginator="showPagination"
    :rows="rowsPerPage"
    :first="datatableOffset"
    :total-records="totalRecords"
    :class="`p-datatable-${tableClass}`"
    @page="onPage($event)"
    @update:selection="onSelectionChanged"
    @update:first="datatableOffset = $event"
  >
    <Column v-if="multiselect" style="width: 40px" selection-mode="multiple" />
    <Column
      v-for="column in columns"
      :key="column.name"
      :field="column.name"
      :header="column.header ? $t(column.header) : $t(`task.${column.name}`)"
      :class="column.class"
    >
      <template #body="slotProps">
        <template v-if="column.type === 'link'">
          <router-link
            v-if="
              slotProps.data.task_family?.value === 'subproject' &&
              slotProps.data.project_created
            "
            :to="{
              name: 'projectDetail',
              params: { id: slotProps.data.project_created.id },
            }"
            class="vertical-align-middle"
            >{{ slotProps.data.task_number }}</router-link
          >
          <router-link
            v-else
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
        <template v-if="column.type === 'sla'">
          <WMSLATag
            v-if="slotProps.data.sla"
            :sla="slotProps.data.sla.sla"
            :days-for-closing="slotProps.data.days_for_closing"
            :state="slotProps.data.state.value"
          />
        </template>
        <template v-if="column.type === 'translate'">
          {{ $t(column.prefix + "." + slotProps.data[column.name]) }}
        </template>
        <template v-if="column.type === 'optionset'">
          <WMOptionSetValue :option-set="slotProps.data[column.name]" />
        </template>
        <template v-if="column.type === 'task_family'">
          <div class="flex justify-content-between align-items-center">
            <WMOptionSetValue :option-set="slotProps.data.task_family" />
            <img
              v-if="
                slotProps.data.task_family?.value === 'subproject' &&
                slotProps.data.project_created
              "
              src="/icons/format_list_bulleted.svg"
              class="vertical-align-middle"
            />
          </div>
        </template>
        <template v-if="column.type === 'related_entity'">
          <Column field="related_entity" :header="$t('task.related_entity')">
            <template #body="slotProps">
              <router-link
                :to="{
                  name: slotProps.data.related_entity?.type + 'Detail',
                  params: { id: slotProps.data.related_entity?.id },
                }"
                class="vertical-align-middle"
              >
                {{ slotProps.data.related_entity?.name }}
              </router-link>
            </template>
          </Column>
        </template>
        <template v-if="column.type === 'contact'">
          <router-link
            v-if="slotProps.data.contact != null"
            :to="{
              name: 'contactDetail',
              params: { id: slotProps.data.contact.id },
            }"
            class="vertical-align-middle"
            >{{ slotProps.data.contact.name }}
            {{ slotProps.data.contact.surname }}</router-link
          >
        </template>
        <template v-if="column.type === 'text'">
          {{ getValueOf(slotProps.data, column.name) }}
        </template>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
// IMPORTS
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { t } = useI18n();
const { getValueOf } = useUtils();
const { can } = usePermissions();
const utilsStore = useUtilsStore();
const { getTasksFromApi } = useTasks();

// INJECT

// PROPS, EMITS
const props = defineProps({
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
  relatedEntity: {
    type: String,
    default: null,
  },
  relatedEntityId: {
    type: String,
    default: null,
  },
  showHeaderOptions: {
    type: Boolean,
    default: true,
  },
  showFilters: {
    type: Boolean,
    default: true,
  },
  showFilter: {
    type: Boolean,
    default: true,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  showPaginationOptions: {
    type: Boolean,
    default: true,
  },
  tableClass: {
    type: String,
    default: "",
  },
  filters: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["taskCompleted"]);

// REFS
const selectedTasks = ref([]);
const tasks = ref([]);
const totalRecords = ref(0);
const lazyParams = ref({});
const searchValue = ref("");
const currentPage = ref(1);
const rowsPerPage = ref(props.rows);
const datatableOffset = ref(0);

const isVisible = ref(false);
const isFilterVisible = ref(false);

// COMPUTED
const isFilterApplied = computed(() => {
  if (!utilsStore.filters["service"]) return 0;
  return Object.keys(utilsStore.filters["service"]).length;
});

// COMPONENT METHODS AND LOGIC
const loadLazyData = () => {
  const filters = { ...utilsStore.filters["task"], ...props.filters };
  currentPage.value = lazyParams.value.page ? lazyParams.value.page + 1 : 1;
  const searchValueParam = searchValue.value;
  const selectedRowsPerPageParam = rowsPerPage.value;

  // Create a new URLSearchParams object by combining base filters and additional parameters
  const params = new URLSearchParams({
    ...filters,
    page: currentPage.value,
    per_page: selectedRowsPerPageParam,
    search: searchValueParam,
    order_by: "stage_id",
  });

  if (props.relatedEntity == "contact") {
    params.append("contact_id", props.relatedEntityId);
  } else if (props.relatedEntity == "customer") {
    params.append("customer_id", props.relatedEntityId);
  } else if (props.relatedEntity && props.relatedEntityId) {
    params.append("entity_type", props.relatedEntity);
    params.append("entity_id", props.relatedEntityId);
  }

  getTasksFromApi(params).then((result) => {
    tasks.value = result.data;
    totalRecords.value = result.totalRecords;
  });
};

const handleNumberOfRowsPerPage = (numberOfRowsPerPage) => {
  currentPage.value = 1;
  datatableOffset.value = 0;
  rowsPerPage.value = numberOfRowsPerPage;
  loadLazyData();
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const rowClass = (data) => {
  return [{ inactive_row: !data.is_open }];
};

const onSelectionChanged = () => {
  utilsStore.selectedElements["task"] = selectedTasks.value;
};

const clearSelectedTasks = () => {
  selectedTasks.value = [];
  utilsStore.selectedElements["task"] = [];
};

function toggleSidebarVisibility() {
  isVisible.value = !isVisible.value;
}

function closeSidebar() {
  isVisible.value = false;
}

function openSidebar() {
  isVisible.value = true;
}

function closeFilterSidebar() {
  isFilterVisible.value = false;
}

function openFilterSidebar() {
  isFilterVisible.value = true;
}

// PROVIDE, EXPOSE

// WATCHERS
watchEffect(() => {
  loadLazyData();
});

watch(
  () => utilsStore.searchString["task"],
  () => {
    searchValue.value = utilsStore.searchString["task"];
    utilsStore.debounceAction(() => {
      loadLazyData();
    });
  }
);

watch(
  () => utilsStore.filters["task"],
  () => {
    loadLazyData();
  },
  { deep: true }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  loadLazyData();
});
</script>
