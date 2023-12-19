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
            :value="project?.firstName"
          />
          <WMInput
            name="request-number"
            validationMessage="Validation Message"
            type="input-text"
            :label="$t('project.request_no') + ':'"
            :value="project?.lastName"
          />
        </div>
        <div class="wm-form-row gap-5">
          <WMInput
            name="architect"
            type="info-link"
            :highlighted="true"
            :label="$t('project.architect') + ':'"
            :value="`נופר דוד אדריכלים ומתכנני ערים בע`"
            :to="'/contact/' + 'test'"
          />
          <WMInput
            name="contractor"
            type="info-link"
            :highlighted="true"
            :label="$t('project.contractor') + ':'"
            :value="'אשל הנדסה הבע”מ'"
            :to="'/contact/' + 'test'"
          />
          <WMInput
            name="supervisor"
            type="info-link"
            :highlighted="true"
            :label="$t('project.supervisor') + ':'"
            :value="'אנך הנדסה הבע”מ'"
            :to="'/contact/' + 'test'"
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
