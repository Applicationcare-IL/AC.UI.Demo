<template>
  <Card>
    <template #title> Execution information </template>
    <template #content>
      <div class="flex flex-auto flex-column gap-5">
        <div class="wm-form-row gap-5">
          <WMInput
            name="tbr-number"
            type="input-text"
            :label="'TBR no.'"
            :value="project?.firstName"
          />
          <WMInput
            name="request-number"
            validationMessage="Validation Message"
            type="input-text"
            :label="'Request no.'"
            :value="project?.lastName"
          />
        </div>
        <div class="wm-form-row gap-5">
          <WMInput
            name="architect"
            type="info-link"
            :highlighted="true"
            :label="'Architect:'"
            :value="`נופר דוד אדריכלים ומתכנני ערים בע`"
            :to="'/contact/' + 'test'"
          />
          <WMInput
            name="contractor"
            type="info-link"
            :highlighted="true"
            :label="'Contractor:'"
            :value="'אשל הנדסה הבע”מ'"
            :to="'/contact/' + 'test'"
          />
          <WMInput
            name="supervisor"
            type="info-link"
            :highlighted="true"
            :label="'Supervisor:'"
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
