<template>
  <div class="card-container top-info-card flex-1">
    <Card v-if="project">
      <template #title>
        <div class="flex flex-row justify-content-between">
          {{ $t("project.project") + ":" }} {{ project.project_name }}
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
              :value="project.owner"
            />
          </div>
          <div class="wm-form-row align-items-start gap-5">
            <WMInput
              name="project-type"
              type="info"
              :highlighted="true"
              :label="$t('project.project_type') + ':'"
              :value="projectType"
            />
            <WMInput
              name="project-area"
              type="info"
              :highlighted="true"
              :label="$t('project.project_area') + ':'"
              :value="projectArea"
            />
            <WMInput
              name="project-detail"
              type="info"
              :highlighted="true"
              :label="$t('project.project_detail') + ':'"
              :value="projectDetail"
            />
          </div>
          <div class="wm-form-row align-items-start gap-5">
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
          <!-- <WMLocationButton /> -->
        </div>
      </template>
    </Card>
    <Card v-else>
      <div>Loading Service</div>
    </Card>
  </div>
</template>

<script setup>
import { computed } from "vue";

const { optionLabelWithLang } = useLanguages();

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

const projectType = computed(() => {
  if (!props.project.project_type) return;
  return props.project.project_type[optionLabelWithLang.value];
});

const projectArea = computed(() => {
  if (!props.project.project_area) return;
  return props.project.project_area[optionLabelWithLang.value];
});

const projectDetail = computed(() => {
  if (!props.project.project_detail) return;
  return props.project.project_detail[optionLabelWithLang.value];
});
</script>
