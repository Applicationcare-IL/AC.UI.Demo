<template>
  <WMSidebar
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
              params: { id: projectId, milestoneId: slotProps.data.id },
            }"
            class="vertical-align-middle"
          >
            {{ slotProps.data.id }}
          </router-link>
        </template>
      </Column>
    </template>
  </DataTable>
  <!-- <pre>{{ milestones }}</pre> -->
</template>

<script setup>
import { formatDate } from "@vueuse/core";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  project: {
    type: Number,
    required: true,
  },
});

const { getMilestonesTableColumns } = useListUtils();

const selectedMilestones = ref([]);
const totalRecords = ref(0);
const milestones = ref([]);
const columns = ref(getMilestonesTableColumns());
const isVisible = ref(false);

const { getProjectMilestones } = useProjects();

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
  getProjectMilestones(props.project.id).then((response) => {
    milestones.value = response;
  });
};

fetchData();

const getColumHeader = (column) => {
  return column.header ? t(column.header) : t(`milestone.${column.name}`);
};
</script>
