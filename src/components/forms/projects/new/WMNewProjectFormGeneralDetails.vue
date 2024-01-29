<template>
  <h1 class="h1 mb-0">{{ $t("new", ["project.project"]) }}</h1>
  <h2 class="h2 my-0">{{ $t("general-details") }}</h2>
  <div class="wm-form-row align-items-end gap-5">
    <div class="wm-form-row gap-5">
      <WMTeamOwnerFields />
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
        id="description"
        type="text-area"
        :label="$t('project.project_description') + ':'"
        name="project-description"
        :required="true"
      />
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss"></style>
