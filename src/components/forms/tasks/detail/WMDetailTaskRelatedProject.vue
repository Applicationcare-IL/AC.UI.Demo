<template>
  <div class="card-container top-info-card flex-1">
    <Card v-if="project">
      <template #title>
        <div class="flex flex-row justify-content-between">
          פרויקט: {{ project.project_name }}
          <router-link
            :to="{
              name: 'projectDetail',
              params: { id: project.project_id },
            }"
            target="_blank"
          >
            <Button>פתח פרויקט</Button>
          </router-link>
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
              :value="project.project_id"
            />
            <WMInput
              name="project-owner"
              type="info"
              :highlighted="true"
              :label="$t('owner')"
              :value="project.owner?.name"
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
const { project } = defineProps({
  project: {
    type: Object,
    required: true,
  },
});
</script>
