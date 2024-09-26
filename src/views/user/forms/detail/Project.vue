<template>
  <WMDetailFormSubHeader
    entity="project"
    :form-key="formKey"
    @save-form="saveForm()"
    @refresh-table="refreshProject"
  >
    <template #bottom-left>
      <WMMessagesButton :id="route.params.id" entity="project" />
      <WMCancelButton
        v-if="can('projects.cancel')"
        :is-disabled="!isProjectCancellable"
        @click="handleCancelProject"
      />
    </template>
  </WMDetailFormSubHeader>
  <WMDetailProjectForm ref="detailProjectForm" :form-key="formKey" />
</template>

<script setup>
// IMPORTS
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const utilsStore = useUtilsStore();
const dialog = useDialog();
const toast = useToast();
const route = useRoute();

const { can } = usePermissions();
const { cancelProject } = useProjects();
const { t } = useI18n();

// INJECT

// PROPS, EMITS

// REFS
const selectedProject = ref(null);
const formKey = ref("projectDetailForm");
const detailProjectForm = ref(null);

// COMPUTED
const isProjectCancellable = computed(() => {
  return (
    selectedProject.value &&
    selectedProject.value.status.value !== "canceled" &&
    selectedProject.value.status.value !== "completed" &&
    selectedProject.value.status.value !== "closed"
  );
});

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Project Detail",
});

const handleCancelProject = async () => {
  if (selectedProject.value && !isProjectCancellable.value) return;

  let response = await dialog.confirmCancelProject();

  if (response) {
    cancelProject(selectedProject.value.id).then(() => {
      refreshProject();
    });

    toast.info({
      message: t("project.toast-project-cancelled-message"),
      title: t("project.toast-project-cancelled-title"),
      life: 5000,
      group: "br",
    });
  }
};

const saveForm = () => {
  detailProjectForm.value.onSave();
};

const refreshProject = () => {
  detailProjectForm.value.fetchData();
};

// PROVIDE, EXPOSE

// WATCHERS
watch(
  () => utilsStore.selectedElements["project"],
  (value) => {
    selectedProject.value = value[0];
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
