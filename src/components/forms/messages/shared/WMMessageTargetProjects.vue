<template>
  <div class="flex flex-column gap-3">
    <WMInputSearch
        v-model="selectedProjectType"
        name="project_type"
        :highlighted="true"
        :required="true"
        :label="$t('message.project-type') + ':'"
        :options="projectTypes"
        size="md"
        :placeholder="$t('message.select-project-type')"
        :option-set="true"
        @change="handleSelectedProjectTypeChange"
    />

    <WMInputSearch
        v-model="selectedProjectArea"
        name="project_area"
        :highlighted="true"
        :label="$t('message.project-area') + ':'"
        :options="projectAreas"
        size="md"
        :placeholder="$t('message.select-project-area')"
        :option-set="true"
        :disabled="isProjectAreaEmpty"
        @change="handleSelectedProjectAreaChange"
    />

    <WMInputSearch
        v-model="selectedProjectDetail"
        name="project_detail"
        :highlighted="true"
        :label="$t('message.project-detail') + ':'"
        :options="projectDetails"
        size="md"
        :placeholder="$t('message.select-project-detail')"
        :option-set="true"
        :disabled="isProjectDetailEmpty"
    />
  </div>
</template>

<script setup>
// IMPORTS
import {onMounted, ref} from "vue";

import {useOptionSetsStore} from "@/stores/optionSets";

// DEPENDENCIES
const optionSetsStore = useOptionSetsStore();

// INJECT

// PROPS, EMITS

// REFS
const projectTypes = ref([]);
const projectAreas = ref([]);
const projectDetails = ref([]);

const selectedProjectType = ref(false);
const selectedProjectArea = ref(false);
const selectedProjectDetail = ref(false);

const isProjectAreaEmpty = ref(true);
const isProjectDetailEmpty = ref(true);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = () => {
  optionSetsStore
      .getOptionSetValuesFromApiRaw("project_type")
      .then((data) => (projectTypes.value = data));
}

const filterProjectAreasDropdown = (value) => {
  optionSetsStore
      .getOptionSetValuesFromApiRaw("project_area", value)
      .then((data) => (projectAreas.value = data));
  isProjectAreaEmpty.value = false;
};

const filterProjectDetailsDropdown = (value) => {
  optionSetsStore
      .getOptionSetValuesFromApiRaw("project_detail", value)
      .then((data) => (projectDetails.value = data));
  isProjectDetailEmpty.value = false;
};

const clearProjectAreasDropdown = () => {
  projectAreas.value = []
  selectedProjectArea.value = null;
  isProjectAreaEmpty.value = true;
};

const clearProjectDetailsDropdown = () => {
  projectDetails.value = [];
  selectedProjectDetail.value = null;
  isProjectDetailEmpty.value = true;
};

const handleSelectedProjectTypeChange = (option) => {
  if (!option) {
    clearProjectAreasDropdown();
    clearProjectDetailsDropdown();
    return;
  }
  filterProjectAreasDropdown(option.value.id);
};

const handleSelectedProjectAreaChange = (option) => {
  if (!option) {
    clearProjectDetailsDropdown();
    return;
  }
  filterProjectDetailsDropdown(option.value.id);
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  loadLazyData();
});
</script>

<style scoped></style>
