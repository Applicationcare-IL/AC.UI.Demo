<template>
  <h2 class="h2 my-0">{{ $t("classification") }}</h2>

  <div class="wm-form-row align-items-end gap-5">
    <div class="wm-form-row gap-5">
      <WMInputSearch
        name="project_type"
        :highlighted="true"
        :required="true"
        :label="'project type' + ':'"
        type="input-search"
        :options="projectTypes"
        width="152"
        :placeholder="'project-types'"
        v-model="selectedProjectType"
      />

      <WMInputSearch
        name="project_area"
        :highlighted="true"
        :required="true"
        :label="'project area' + ':'"
        :options="projectAreas"
        width="152"
        :placeholder="$t('select', ['classification-2'])"
        v-model="selectedProjectArea"
      />

      <WMInputSearch
        name="project_detail"
        :highlighted="true"
        :required="true"
        :label="'project details' + ':'"
        :options="projectDetails"
        width="152"
        :placeholder="$t('select', ['classification-3'])"
        v-model="selectedProjectDetail"
      />
    </div>
  </div>
  <WMNewProjectFormTenderInformation v-if="selectedProjectType === 'tender'" />
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";

const optionSetsStore = useOptionSetsStore();

const selectedProjectType = ref(false);
const selectedProjectArea = ref();
const selectedProjectDetail = ref();

const projectTypes = ref([]);
const projectAreas = ref([]);
const projectDetails = ref([]);

onMounted(() => {
  optionSetsStore.getOptionSetValuesFromApi("project_type").then((data) => {
    projectTypes.value = data;
  });
  optionSetsStore
    .getOptionSetValuesFromApi("project_area")
    .then((data) => (projectAreas.value = data));
  optionSetsStore
    .getOptionSetValuesFromApiRaw("project_detail")
    .then((data) => (projectDetails.value = data));
});

const handleProjectTypeInputChange = (value) => {
  if (!value) {
    selectedProjectType.value = false;

    return;
  }

  selectedProjectType.value = value.value;
  filterProjectAreasDropdown(value.id);
};

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
