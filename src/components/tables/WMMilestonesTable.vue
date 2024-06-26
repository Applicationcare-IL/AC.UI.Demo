<template>
  <WMSidebar
    v-if="create"
    :visible="isVisible"
    name="newMilestone"
    @close-sidebar="closeSidebar"
    @open-sidebar="openSidebar"
  >
    <template #default>
      <WMNewProjectMilestoneForm
        :related-project="project"
        :is-sidebar="true"
        @new-project-milestone-created="fetchData"
      />
    </template>
  </WMSidebar>
  <div class="flex flex-column gap-3 mb-3">
    <div class="flex flex-row justify-content-between">
      <div class="flex flex-row">

        <WMNewButton v-if="create" :text="$t('buttons.new')" @click="toggleSidebarVisibility" />

      </div>
      <WMTablePaginator
        :total-records="totalRecords"
        :current-page="currentPage"
        :current-offset="datatableOffset"
        @update:rows="handleNumberOfRowsPerPage"
      />
    </div>
  </div>

  <DataTable
    v-model:selection="selectedMilestones"
    data-key="id"
    lazy
    :value="milestones"
    table-style="min-width: 50rem"
    scrollable
    paginator
    :rows="rowsPerPage"
    :first="datatableOffset"
    :total-records="totalRecords"
    :class="`p-datatable-${tableClass}`"
    @page="onPage($event)"
    @update:first="datatableOffset = $event"
  >
    <Column v-if="multiselect" style="width: 40px" selection-mode="multiple" />

    <template v-for="column in columns">
      <Column
        v-if="column.type == 'text'"
        :key="column.name"
        :field="column.name"
        :header="getColumHeader(column)"
        :class="column.class"
      >
        <template #body="slotProps">
          {{ slotProps.data[column.field] }}
        </template>
        <template v-if="column.editable" #editor="{ data }">
          <InputText v-model="data[column.field]" />
        </template>
      </Column>

      <Column
        v-if="column.type == 'date'"
        :key="column.name"
        :field="column.name"
        :header="getColumHeader(column)"
        :class="column.class"
      >
        <template #body="slotProps">
          {{
            slotProps.data[column.field]
              ? formatDate(new Date(slotProps.data[column.field]), "DD/MM/YY")
              : ""
          }}
        </template>
      </Column>

      <Column
        v-if="column.type == 'milestone-link'"
        :key="column.name"
        :field="column.name"
        :header="getColumHeader(column)"
        :class="column.class"
      >
        <template #body="slotProps">
          <router-link
            :to="{
              name: 'projectMilestoneDetail',
              params: { id: project.id, milestoneId: slotProps.data.id },
            }"
            class="vertical-align-middle"
          >
            {{ slotProps.data.id }}
          </router-link>
        </template>
      </Column>

      <Column
        v-if="column.type == 'status'"
        :key="column.name"
        :field="column.field"
        :header="getColumHeader(column)"
        :class="column.class"
      >
        <template #body="slotProps">
          <Tag
            v-if="slotProps.data[column.field]"
            class="w-full"
            :value="slotProps.data[column.field][optionLabelWithLang]"
          />
        </template>
      </Column>
      <Column
        v-if="column.type == 'optionSet'"
        :key="column.name"
        :field="column.field"
        :header="getColumHeader(column)"
        :class="column.class"
      >
        <template #body="slotProps">
          <WMOptionSetValue :option-set="slotProps.data[column.field]" />
        </template>
      </Column>
    </template>
  </DataTable>
</template>

<script setup>
// IMPORTS
import { formatDate } from "@vueuse/core";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

// DEPENDENCIES
const { t } = useI18n();
const { optionLabelWithLang } = useLanguages();
const { getMilestonesTableColumns } = useListUtils();
const { getMilestones } = useProjects();

// INJECT

// PROPS, EMITS
const props = defineProps({
  project: {
    type: Number,
    required: true,
  },
  create: {
    type: Boolean,
    default: true,
  },
});

// REFS
const selectedMilestones = ref([]);
const totalRecords = ref(0);
const milestones = ref([]);
const columns = ref(getMilestonesTableColumns());
const isVisible = ref(false);

const rowsPerPage = ref(10);
const currentPage = ref(1);
const datatableOffset = ref(0);

// COMPUTED

// COMPONENT METHODS AND LOGIC
function toggleSidebarVisibility() {
  isVisible.value = !isVisible.value;
}

function closeSidebar() {
  isVisible.value = false;
}

function openSidebar() {
  isVisible.value = true;
}

const fetchData = () => {
  const params = new URLSearchParams({
    page: currentPage.value,
    per_page: rowsPerPage.value,
    project: props.project.id,
  });

  getMilestones(params).then((response) => {
    milestones.value = response.milestones;
    totalRecords.value = response.totalRecords;
  });
};

fetchData();

const getColumHeader = (column) => {
  return column.header ? t(column.header) : t(`milestone.${column.name}`);
};

// const getStatus = (id) => {
//   const status = milestones.value.find((item) => item.id === id);
//   return status ? status : "";
// };

const handleNumberOfRowsPerPage = (numberOfRowsPerPage) => {
  currentPage.value = 1;
  datatableOffset.value = 0;
  rowsPerPage.value = numberOfRowsPerPage;
  fetchData();
};

const onPage = (event) => {
  currentPage.value = event.page + 1;
  fetchData();
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
