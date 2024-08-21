<template>
  <div class="flex flex-column gap-3">
    <WMInputSearch
        v-model="selectedProjectType"
        name="project_type_id"
        :highlighted="true"
        :required="true"
        :label="$t('message.project-type') + ':'"
        type="input-search"
        :options="projectTypes"
        size="md"
        :placeholder="$t('message.select-project-type')"
        :option-set="true"
        @change="handleSelectedProjectTypeChange"
    />

    <WMInputSearch
        v-model="selectedProjectArea"
        name="project_area_id"
        :highlighted="true"
        :label="$t('message.project-area') + ':'"
        :options="projectAreas"
        size="md"
        :placeholder="$t('message.select-project-area')"
        :option-set="true"
        :disabled="isProjectTypeEmptyOrFalsy"
        @change="handleSelectedProjectAreaChange"
    />

    <WMInputSearch
        v-model="selectedProjectDetail"
        name="project_detail_id"
        :highlighted="true"
        :label="$t('message.project-detail') + ':'"
        :options="projectDetails"
        size="md"
        :placeholder="$t('message.select-project-detail')"
        :option-set="true"
        :disabled="isProjectAreaEmtpyOrFalsy"
    />
  </div>
</template>

<script setup>
// IMPORTS
import {computed, onMounted, ref} from "vue";

import {useOptionSetsStore} from "@/stores/optionSets";

// DEPENDENCIES
const optionSetsStore = useOptionSetsStore();

// INJECT

// PROPS, EMITS

// REFS
const selectedProjectType = ref(false);
const selectedProjectArea = ref(false);
const selectedProjectDetail = ref(false);

const projectTypes = ref([]);
const projectAreas = ref([]);
const projectDetails = ref([]);

// COMPUTED
const isProjectTypeEmptyOrFalsy = computed(() => {
  return !selectedProjectType.value;
});

const isProjectAreaEmtpyOrFalsy = computed(() => {
  return !selectedProjectArea.value;
});

// COMPONENT METHODS AND LOGIC
const loadLazyData = () => {
  optionSetsStore
      .getOptionSetValuesFromApiRaw("project_type")
      .then((data) => (projectTypes.value = data));
  optionSetsStore
      .getOptionSetValuesFromApiRaw("project_area")
      .then((data) => (projectAreas.value = data));
  optionSetsStore
      .getOptionSetValuesFromApiRaw("project_detail")
      .then((data) => (projectDetails.value = data));
}

const filterProjectAreasDropdown = (value) => {
  optionSetsStore
      .getOptionSetValuesFromApiRaw("project_area", value)
      .then((data) => (projectAreas.value = data));
};

const filterProjectDetailsDropdown = (value) => {
  optionSetsStore
      .getOptionSetValuesFromApiRaw("project_detail", value)
      .then((data) => (projectDetails.value = data));
};

const clearProjectDetailsDropdown = () => {
  selectedProjectDetail.value = [];
};

const clearProjectAreasDropdown = () => {
  selectedProjectArea.value = [];
};

const handleSelectedProjectTypeChange = (option) => {
  if (!option) {
    clearProjectAreasDropdown();
    clearProjectDetailsDropdown();
    return;
  }
  filterProjectAreasDropdown(option.id);
};

const handleSelectedProjectAreaChange = (option) => {
  if (!option) {
    clearProjectDetailsDropdown();
    return;
  }
  filterProjectDetailsDropdown(option.id);
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  loadLazyData();
});
</script>

<style scoped></style>
