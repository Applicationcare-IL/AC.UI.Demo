<template>
  <Dialog
    v-model:visible="modelValue"
    modal
    :closable="false"
    header="Pending configuration"
    class="overflow-hidden"
    :style="{ minWidth: '40vw' }"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
  >
    <div class="flex flex-column gap-4">
      <div v-if="!project.project_type" class="flex flex-column gap-2 mb-3">
        <WMDetailProjectFormClassification
          :project="project"
          @project-type-update="handleProjectTypeUpdate"
        />
      </div>

      <!-- v-if="project.project_type.value === CONTRACTOR_PROJECT_ID" -->
      <div class="flex-1 card-container">
        <WMDetailProjectFormContractorSection :project="project" />
      </div>

      <div class="flex gap-2 mt-5 justify-content-end">
        <WMSaveButton type="save" :is-active="false" @click="onSave" />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
// IMPORTS
import { useField, useForm } from "vee-validate";
import { onMounted } from "vue";

import { CONTRACTOR_PROJECT_ID } from "@/constants";
import { useLayout } from "@/layout/composables/layout";
import { useFormUtilsStore } from "@/stores/formUtils";

// DEPENDENCIES
const { layoutConfig } = useLayout();
const formUtilsStore = useFormUtilsStore();
const { updateProjectConfig, parseUpdateProjectConfig } = useProjects();
const toast = useToast();

// INJECT

// PROPS, EMITS
const props = defineProps({
  project: Object,
});

const emit = defineEmits(["configUpdated"]);

// REFS

const modelValue = defineModel();

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit } = useForm({
  validationSchema: formUtilsStore.getProjectDetailPendingConfigFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  updateProjectConfig(props.project.id, parseUpdateProjectConfig(values))
    .then(() => {
      emit("configUpdated");
    })
    .catch((error) => {
      console.error(error);
      toast.error("project", "not-updated");
    });
});

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  // If project is not defined, we need to validate the project type
  // We use this field to trigger the validation conditionally
  useField("validateProjectType", undefined, {
    initialValue: !props.project.project_type ? true : false,
  });
});
</script>
