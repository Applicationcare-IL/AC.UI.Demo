<template>
  <Card>
    <template #title> General information </template>
    <template #content>
      <div class="flex flex-auto flex-column gap-5">
        <div class="wm-form-row gap-5">
          <WMInput
            name="owner"
            type="info"
            :highlighted="true"
            :label="$t('owner') + ':'"
            value="שרוליק כהן"
          />
          <WMInput
            name="id"
            type="info"
            :highlighted="true"
            :label="$t('team') + ':'"
            value="שיפור פני העיר"
          />
        </div>
        <div class="wm-form-row gap-5">
          <WMInput
            name="project-name"
            :required="true"
            type="input-text"
            :label="$t('project.project_name') + ':'"
            :value="project.project_name"
          />
        </div>
        <div class="wm-form-row gap-5">
          <WMInput
            type="text-area"
            :label="$t('project.project_description') + ':'"
            id="description"
            name="project-description"
            :value="project.project_description"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped lang="scss"></style>
