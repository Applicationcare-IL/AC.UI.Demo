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
      :filters="reportPreviewTeamFilters"
    />
  </Sidebar>
</template>

<script setup>
// IMPORTS
import { ref, onMounted } from "vue";

import { useLayout } from "@/layout/composables/layout";
import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const optionSetsStore = useOptionSetsStore();
const { getPreviewProjectTeamColumns } = useListUtils();
const projectTeamColumns = ref(getPreviewProjectTeamColumns());
const { can } = usePermissions();
const { layoutConfig } = useLayout();

// INJECT

// PROPS, EMITS
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

// REFS
const visible = ref(false);
const reportPreviewTeamFilters = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)

const updateModelValue = (value) => {
  visible.value = value;
};

onMounted(async () => {
  // We need to filter by supplier role
  let supplierID = await optionSetsStore.getValueId("contact_project_role", "supplier");

  reportPreviewTeamFilters.value = {
    role: supplierID,
  };
});
</script>
