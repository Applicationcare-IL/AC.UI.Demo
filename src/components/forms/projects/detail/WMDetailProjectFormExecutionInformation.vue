<template>
  <Card>
    <template #title> {{ $t("project.execution_information") }} </template>
    <template #content>
      <div class="flex flex-auto flex-column gap-5">
        <div class="wm-form-row gap-5">
          <WMInput
            name="tbr-number"
            type="input-text"
            :label="$t('project.tbr_no') + ':'"
            :value="project?.tbr_number"
          />
          <WMInput
            name="request-number"
            type="input-text"
            :label="$t('project.request_no') + ':'"
            :value="project?.request_number"
          />
        </div>
        <div class="wm-form-row gap-5">
          <WMInput
            name="architect"
            type="info-link"
            :highlighted="true"
            :label="$t('project.architect') + ':'"
            :value="project.architect?.name"
            :to="'/customer/' + project.architect?.id"
          />
          <WMInput
            name="contractor"
            type="info-link"
            :highlighted="true"
            :label="$t('project.contractor') + ':'"
            :value="project.contractor?.name"
            :to="'/customer/' + project.contractor?.id"
          />
          <WMInput
            name="supervisor"
            type="info-link"
            :highlighted="true"
            :label="$t('project.supervisor') + ':'"
            :value="project.supervisor?.name"
            :to="'/customer/' + project.supervisor?.id"
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
