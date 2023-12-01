<template>
  <h1 class="h1 mb-0">{{ $t("new", ["project.project"]) }}</h1>
  <h2 class="h2 my-0">{{ $t("general-details") }}</h2>
  <div class="wm-form-row align-items-end gap-5">
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
  </div>
  <div class="wm-form-row align-items-end gap-5">
    <div class="wm-form-row gap-5">
      <WMInput
        name="project-name"
        :required="true"
        type="input-text"
        :label="$t('project.project_name') + ':'"
      />
    </div>
  </div>
  <div class="wm-form-row align-items-end gap-5">
    <div class="wm-form-row gap-5">
      <WMInput
        type="text-area"
        :label="$t('project.project_description') + ':'"
        id="description"
        name="project-description"
      />
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss"></style>
