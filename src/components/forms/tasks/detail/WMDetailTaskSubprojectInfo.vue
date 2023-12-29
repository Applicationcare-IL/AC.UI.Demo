<template>
  <div class="flex flex-row gap-5 flex-wrap">
    <div class="card-container flex-1">
      <Card>
        <template #title>
          {{ $t("project.subproject_information") }}
        </template>
        <template #content>
          <div class="flex flex-auto flex-column">
            <div class="wm-form-row gap-5">
              <WMInput
                name="project-type"
                type="info"
                :highlighted="true"
                :label="$t('project.project_type') + ':'"
                :value="projectTypeValue"
                width="180"
              />
              <WMInput
                name="project-area"
                type="info"
                :highlighted="true"
                :label="$t('project.project_area') + ':'"
                :value="projectAreaValue"
                width="180"
              />
              <WMInput
                name="project-detail"
                type="info"
                :highlighted="true"
                :label="$t('project.project_detail') + ':'"
                :value="projectDetailValue"
                width="180"
              />

              <WMInput
                name="contact"
                type="info-link"
                :highlighted="true"
                :label="$t('project.subproject_name') + ':'"
                :value="task.project_created.name"
                :to="'/projects/' + task.project_created.id"
                width="180"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const { optionLabelWithLang } = useLanguages();

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const projectTypeValue = computed(() => {
  if (!props.task.task_type?.project_type) {
    return null;
  }

  return props.task.task_type?.project_type[optionLabelWithLang];
});

const projectAreaValue = computed(() => {
  if (!props.task.task_type?.project_area) {
    return null;
  }

  return props.task.task_type?.project_area[optionLabelWithLang];
});

const projectDetailValue = computed(() => {
  if (!props.task.task_type?.project_detail) {
    return null;
  }

  return props.task.task_type?.project_detail[optionLabelWithLang];
});
</script>
