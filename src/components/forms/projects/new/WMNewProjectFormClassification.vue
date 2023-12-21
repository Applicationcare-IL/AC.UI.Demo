<template>
  <h2 class="h2 my-0">{{ $t("project.classification") }}</h2>

  <div class="wm-form-row align-items-end gap-5">
    <div class="wm-form-row gap-5">
      <WMInputSearch
        name="project_type"
        :highlighted="true"
        :required="true"
        :label="$t('project.project_type') + ':'"
        type="input-search"
        :options="projectTypes"
        width="152"
        :placeholder="$t('project.project_types_placeholder')"
        v-model="selectedProjectType"
        :optionSet="true"
      />

      <WMInputSearch
        name="project_area"
        :highlighted="true"
        :label="$t('project.project_area') + ':'"
        :options="projectAreas"
        width="152"
        :placeholder="$t('project.project_areas_placeholder')"
        v-model="selectedProjectArea"
        :optionSet="true"
        :disabled="isProjectTypeEmptyOrFalsy"
      />

      <WMInputSearch
        name="project_detail"
        :highlighted="true"
        :label="$t('project.project_detail') + ':'"
        :options="projectDetails"
        width="152"
        :placeholder="$t('project.project_details_placeholder')"
        v-model="selectedProjectDetail"
        :optionSet="true"
        :disabled="isProjectAreaEmtpyOrFalsy"
      />
    </div>
  </div>
  <WMNewProjectFormTenderInformation v-if="selectedProjectType === 'tender'" />
</template>

<script setup>
// TODO: combine the new and detail form classification sections to avoid duplicated code
import { ref, onMounted, watch, computed } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";

const optionSetsStore = useOptionSetsStore();

const selectedProjectType = ref(false);
const selectedProjectArea = ref(false);
const selectedProjectDetail = ref(false);

const projectTypes = ref([]);
const projectAreas = ref([]);
const projectDetails = ref([]);

const isProjectTypeEmptyOrFalsy = computed(() => {
  return !selectedProjectType.value;
});

const isProjectAreaEmtpyOrFalsy = computed(() => {
  return !selectedProjectArea.value;
});

onMounted(() => {
  optionSetsStore.getOptionSetValuesFromApiRaw("project_type").then((data) => {
    projectTypes.value = data;
  });
  optionSetsStore
    .getOptionSetValuesFromApiRaw("project_area")
    .then((data) => (projectAreas.value = data));
  optionSetsStore
    .getOptionSetValuesFromApiRaw("project_detail")
    .then((data) => (projectDetails.value = data));
});

const filterProjectAreasDropdown = (value) => {
  optionSetsStore
    .getOptionSetValuesFromApiRaw("project_area", value)
    .then((data) => {
      projectAreas.value = data;
    });
};

const clearProjectDetailsDropdown = () => {
  selectedProjectDetail.value = [];
};

const clearProjectAreasDropdown = () => {
  selectedProjectArea.value = [];
};

const filterProjectDetailsDropdown = (value) => {
  optionSetsStore
    .getOptionSetValuesFromApiRaw("project_detail", value)
    .then((data) => {
      projectDetails.value = data;
    });
};

watch(
  () => selectedProjectType.value,
  (newValue) => {
    if (!newValue) {
      clearProjectAreasDropdown();
      clearProjectDetailsDropdown();
      return;
    }

    filterProjectAreasDropdown(newValue.id);
  }
);

watch(
  () => selectedProjectArea.value,
  (newValue) => {
    if (!newValue) {
      clearProjectDetailsDropdown();
      return;
    }

    filterProjectDetailsDropdown(newValue.id);
  }
);
</script>

<style scoped lang="scss"></style>
