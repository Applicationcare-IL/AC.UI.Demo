<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="task-data flex flex-auto flex-column gap-5 mb-5">
      <h1 v-if="isSidebar" class="h1 mb-0">
        {{ $t("new", ["milestone.milestone"]) }}
        <Divider />
      </h1>
      <h2 class="h2 my-0">{{ $t("general-details") }}</h2>
      <div class="wm-form-row gap-5">
        <div class="wm-form-row flex-column align-items-start gap-5">
          <WMInput
            name="project"
            type="info"
            :label="$t('project.project') + ':'"
            :value="relatedProject.name"
          />

          <WMInput
            id="milestone-name"
            type="input-text"
            :label="$t('milestone.milestone-name') + ':'"
            name="milestone-name"
            required
          />

          <WMInput
            v-if="!type"
            name="type"
            type="input-select-button"
            :highlighted="true"
            :label="$t('milestone.milestone-type') + ':'"
            :options="milestoneTypes"
            :selected-option="milestoneTypes[1]"
            width="80"
            :option-set="true"
          />

          <WMInput
            name="plannedDate"
            type="date"
            :label="$t('milestone.planned-date') + ':'"
          />

          <WMInput
            name="baseDate"
            type="date"
            :label="$t('milestone.base-date') + ':'"
          />

          <WMInput
            name="actualDate"
            type="date"
            :label="$t('milestone.actual-date') + ':'"
          />

          <WMInput
            id="description"
            :label="$t('description') + ':'"
            type="text-area"
            name="description"
            width="full"
          />
        </div>
      </div>
      <Divider />
    </div>
    <div class="my-4"></div>
    <WMFormButtons
      v-if="isSidebar"
      @save-form="onSave()"
      @cancel-form="onCancel()"
    />
  </div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { inject, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const toast = useToast();
const route = useRoute();
const { createMilestone, parseMilestone } = useProjects();
const formUtilsStore = useFormUtilsStore();
const optionSetsStore = useOptionSetsStore();

// INJECT
const isFormDirty = inject("isFormDirty");
const closeSidebar = inject("closeSidebar");

// PROPS, EMITS
const props = defineProps({
  relatedProject: {
    type: Object,
    required: true,
  },
  type: String,
  isSidebar: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["newProjectMilestoneCreated"]);

// REFS
const milestoneTypes = ref([]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit, meta, resetForm } = useForm({
  validationSchema: formUtilsStore.getNewMilestoneFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  createMilestone(
    route.params.id,
    parseMilestone({ ...values, project_id: props.relatedProject.id })
  )
    .then(() => {
      toast.successAction("milestone", "created");

      emit("newProjectMilestoneCreated");
      resetForm({ values: values });

      isFormDirty.value = false;

      closeSidebar();
    })
    .catch((error) => {
      console.error(error);
      toast.error("milestone", "not-created");
    });
});

const onCancel = () => {
  closeSidebar();
};

// PROVIDE, EXPOSE
defineExpose({
  onSave,
  onCancel,
});

// WATCHERS
watch(
  () => meta.value,
  (value) => {
    isFormDirty.value = value.dirty;
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  optionSetsStore.getOptionSetValuesFromApi("milestone_type").then((data) => {
    milestoneTypes.value = data;
  });
});
</script>

<style scoped lang="scss"></style>
