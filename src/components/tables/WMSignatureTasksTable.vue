<template>
  <WMSidebar
    :visible="isVisible"
    name="newTask"
    :data="{ relatedEntity: relatedEntity, relatedEntityId: relatedEntityId }"
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

  <h2 v-if="!hideTitle" class="h2">{{ $t("task.tasks") }}</h2>
  <div v-if="showHeaderOptions" class="flex flex-column gap-3 mb-3">
    <div class="flex flex-row justify-content-between">
      <div class="flex flex-row gap-2">
        <WMNewButton :text="$t('new')" @click="toggleSidebarVisibility" />

        <Divider layout="vertical" />

        <WMAssignOwnerButton
          v-if="can('tasks.assign')"
          entity="task"
          @owner-assigned="
            loadLazyData();
            clearSelectedTasks();
          "
        />

        <WMButton
          :text="$t('buttons.sign')"
          type="secondary"
          :disabled="tasks.length === 0"
          @click="onSign"
        />
      </div>
      <div v-if="showFilters" class="flex flex-row align-items-center gap-3">
        <WMOwnerToggle entity="task" />
      </div>
    </div>
    <div class="flex flex-row gap-3">
      <WMSearchBox entity="task" />

      <WMFilterButton :is-active="isFilterOpen || isFilterApplied" @click="openFilterSidebar" />

      <WMSidebar
        :visible="isFilterVisible"
        name="filterTask"
        @close-sidebar="closeFilterSidebar"
        @open-sidebar="openFilterSidebar"
      >
        <WMFilterForm entity="task" filter-form-name="task" />
      </WMSidebar>
    </div>
  </div>

  <DataTable
    v-model:selection="selectedTasks"
    lazy
    :row-class="rowClass"
    :value="tasks"
    data-key="task_id"
    table-style="min-width: 50rem"
    scrollable
    paginator
    :rows="props.rows"
    :first="0"
    :total-records="totalRecords"
    :class="`p-datatable-${tableClass}`"
    @page="onPage($event)"
    @update:selection="onSelectionChanged"
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
            :to="{
              name: 'taskDetail',
              params: { id: slotProps.data.task_id },
            }"
            class="vertical-align-middle"
            >{{ slotProps.data.task_id }}</router-link
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
        <template v-if="column.type === 'text'">
          {{ slotProps.data[column.name] }}
        </template>
        <template v-if="column.type === 'currency'">
          <WMInputCurrency
            v-model="slotProps.data[column.name]"
            :read-only="true"
            :name="column.name"
          />
        </template>
        <template v-if="column.type === 'sign_button'">
          <WMSignTaskButton
            :signature-id="slotProps.data.id"
            :is-disabled="slotProps.data.has_signature"
            @task-signed="loadLazyData"
          />
        </template>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
// IMPORTS
import { onMounted, ref, watch, watchEffect } from "vue";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { can } = usePermissions();
const utilsStore = useUtilsStore();
const toast = useToast();
const { getSignatureTaskFromApi, generateSignaturesDocument } = useTasks();

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
  tableClass: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["documentSigned"]);

// REFS
const selectedTasks = ref([]);
const isFilterOpen = ref(false);
const isFilterApplied = ref(false);

const tasks = ref([]);
const totalRecords = ref(0);
const lazyParams = ref({});
const searchValue = ref("");

const isVisible = ref(false);
const isFilterVisible = ref(false);

// COMPUTED

// COMPONENT METHODS AND LOGIC

const loadLazyData = () => {
  const filters = utilsStore.filters["task"];
  const nextPage = lazyParams.value.page ? lazyParams.value.page + 1 : 1;
  const searchValueParam = searchValue.value;
  const selectedRowsPerPageParam = props.rows;

  // Create a new URLSearchParams object by combining base filters and additional parameters
  const params = new URLSearchParams({
    ...filters,
    page: nextPage,
    per_page: selectedRowsPerPageParam,
  });

  if (searchValueParam) {
    params.append("search", searchValueParam);
  }

  params.append("entity_type", props.relatedEntity);
  params.append("entity_id", props.relatedEntityId);

  getSignatureTaskFromApi(params).then((result) => {
    tasks.value = result.data;
    totalRecords.value = result.totalRecords;
  });
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
};

const onSign = () => {
  generateSignaturesDocument(utilsStore.selectedElements["project"][0].id)
    .then(() => {
      toast.success({ message: "Document Signed" });
      emit("documentSigned");
    })
    .catch((error) => {
      console.error(error);
      toast.error("Document not created");
    });
};

const toggleSidebarVisibility = () => {
  isVisible.value = !isVisible.value;
};

const closeSidebar = () => {
  isVisible.value = false;
};

const openSidebar = () => {
  isVisible.value = true;
};

const closeFilterSidebar = () => {
  isFilterVisible.value = false;
};

const openFilterSidebar = () => {
  isFilterVisible.value = true;
};

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

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  loadLazyData();
});
</script>
