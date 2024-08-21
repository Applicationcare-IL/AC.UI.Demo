<template>
  <div class="flex flex-column gap-3">

    <WMInputSearch
        v-model="selectedProjectType"
        name="project_type"
        :highlighted="true"
        :required="true"
        :label="$t('message.project-type') + ':'"
        type="input-search"
        :options="projectTypes"
        size="md"
        :placeholder="$t('message.select-project-type')"
        :option-set="true"
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
        :disabled="isProjectTypeEmptyOrFalsy"
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
        :disabled="isProjectAreaEmtpyOrFalsy"
    />

  </div>
</template>

<script setup>
// IMPORTS
import {computed, onMounted, ref, watch} from "vue";

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
  optionSetsStore.getOptionSetValuesFromApiRaw("project_area", value).then((data) => {
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
  optionSetsStore.getOptionSetValuesFromApiRaw("project_detail", value).then((data) => {
    projectDetails.value = data;
  });
};

// PROVIDE, EXPOSE

// WATCHERS
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

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
