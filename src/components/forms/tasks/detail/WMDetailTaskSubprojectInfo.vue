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
                :value="task.task_type?.project_type[optionLabelWithLang]"
                width="180"
              />
              <WMInput
                name="project-area"
                type="info"
                :highlighted="true"
                :label="$t('project.project_area') + ':'"
                :value="task.task_type?.project_area[optionLabelWithLang]"
                width="180"
              />
              <WMInput
                name="project-detail"
                type="info"
                :highlighted="true"
                :label="$t('project.project_detail') + ':'"
                :value="task.task_type?.project_detail[optionLabelWithLang]"
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
const { optionLabelWithLang } = useLanguages();

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});
</script>
