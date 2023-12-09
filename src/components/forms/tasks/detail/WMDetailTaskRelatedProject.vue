<template>
  <div class="card-container top-info-card flex-1">
    <!-- <WMProjectPreviewSidebar
      :project="project"
      v-model:visible="isProjectPreviewVisible"
    /> -->
    <Card v-if="project">
      <template #title>
        <div class="flex flex-row justify-content-between">
          פרויקט: {{ project.name }}
          <Button @click="isProjectPreviewVisible = true">פתח פרויקט</Button>
        </div>
      </template>
      <template #content>
        <div class="flex flex-auto flex-column gap-5" v-if="project">
          <div class="wm-form-row gap-5">
            <WMInput
              name="id"
              type="info"
              :highlighted="true"
              :label="$t('id')"
              value="0000501"
            />
            <WMInput
              name="owner"
              type="info"
              :highlighted="true"
              :label="$t('owner')"
              :value="project.owner.name"
            />
          </div>
          <div class="wm-form-row gap-5">
            <WMInput
              name="project-type"
              type="info"
              :highlighted="true"
              label="סוג פרויקט:"
              value="בנייה ציבורית"
            />
            <WMInput
              name="project-area"
              type="info"
              :highlighted="true"
              label="תחום:"
              value="חינוך"
            />
            <WMInput
              name="project-detail"
              type="info"
              :highlighted="true"
              label="תת-תחום:"
              value="גן ילדים"
            />
          </div>
          <div class="wm-form-row gap-5">
            <WMInput
              name="architect"
              type="info-link"
              :highlighted="true"
              label="אדריכל:"
              value='נופר דוד אדריכלים ומתכנני ערים בע"מ'
              :to="'/contact/' + project.contact_id"
            />
            <WMInput
              name="contractor"
              type="info-link"
              :highlighted="true"
              label="קבלן:"
              value="אשל הנדסה הבע”מ"
              :to="'/contact/' + project.contact_id"
            />
            <WMInput
              name="supervisor"
              type="info-link"
              :highlighted="true"
              label="מפקח:"
              value="אנך הנדסה בע”מ"
              :to="'/contact/' + project.contact_id"
            />
          </div>
          <WMLocationButton />
        </div>
      </template>
    </Card>
    <Card v-else>
      <div>Loading Service</div>
    </Card>
  </div>
</template>

<script setup>
import { ref } from "vue";

const { project } = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

const isProjectPreviewVisible = ref(false);
</script>
