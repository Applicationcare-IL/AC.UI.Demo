<template>
  <Sidebar
    v-model:visible="visible"
    class="details-sidebar w-6"
    :show-close-icon="false"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
    @update:model-value="updateModelValue"
  >
    <div class="flex justify-content-between align-items-center">
      <h2 class="h2 m-0">{{ $t("project.project_detail") }}</h2>
      <router-link
        :to="{
          name: 'projectDetail',
          params: { id: project.id },
        }"
        class="p-2"
      >
        <WMButton :text="$t('project.open-project')" type="primary" />
      </router-link>
    </div>

    <Divider />

    <h2 class="h2 m-0">{{ $t("milestone.milestones") }}</h2>
    <WMMilestonesTable :project="project" :create="false" />

    <h2 class="h2 m-0">{{ $t("team") }}</h2>
    <WMProjectTeamTable
      v-if="can('contacts.read')"
      :columns="projectTeamColumns"
      :project-id="project.id"
      :read-only="true"
    />

    <!-- <WMServicesTable
      v-if="can('services.read')"
      related-entity="contact"
      :related-entity-id="contact.id"
      :columns="servicePreviewTableColumns"
      :multiselect="false"
      :show-header-options="false"
      :rows="5"
      table-class="compact"
    />

    <WMTasksTable
      v-if="can('tasks.read')"
      related-entity="contact"
      :related-entity-id="contact.id"
      :columns="taskPreviewTableColumns"
      :multiselect="false"
      :show-header-options="false"
      :rows="5"
      table-class="compact"
    /> -->
  </Sidebar>
</template>

<script setup>
import { ref } from "vue";

import { useLayout } from "@/layout/composables/layout";

const { getPreviewProjectTeamColumns } = useListUtils();
const projectTeamColumns = ref(getPreviewProjectTeamColumns());

const { can } = usePermissions();

defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  project: {
    type: Object,
    default: () => {},
  },
});

const { layoutConfig } = useLayout();

const visible = ref(false);

const updateModelValue = (value) => {
  visible.value = value;
};

const { getCustomerPreviewColumns, getServicePreviewColumns, getTaskPreviewColumns } =
  useListUtils();

const customerPreviewTableColumns = ref(getCustomerPreviewColumns());
const servicePreviewTableColumns = ref(getServicePreviewColumns());
const taskPreviewTableColumns = ref(getTaskPreviewColumns());
</script>
