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
        <WMButton
          v-if="create"
          class="m-1 col-6"
          name="new"
          icon="new"
          icon-position="right"
          @click="toggleSidebarVisibility"
        >
          {{ $t("buttons.new") }}
        </WMButton>
      </div>
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
    :rows="10"
    :first="0"
    :total-records="totalRecords"
    :class="`p-datatable-${tableClass}`"
    @page="onPage($event)"
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
          {{ formatDate(new Date(slotProps.data[column.field]), "DD/MM/YY") }}
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
  const params = {
    project: props.project.id,
  };

  getMilestones(params).then((response) => {
    milestones.value = response;
  });
};

fetchData();

const getColumHeader = (column) => {
  return column.header ? t(column.header) : t(`milestone.${column.name}`);
};

const getStatus = (id) => {
  const status = milestones.value.find((item) => item.id === id);
  return status ? status : "";
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
