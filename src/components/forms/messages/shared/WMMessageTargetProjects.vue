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
      :disabled="isProjectTypeEmpty"
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
      :disabled="isProjectAreaEmpty"
    />
  </div>
</template>

<script setup>
// IMPORTS
import { computed, onMounted, ref } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const optionSetsStore = useOptionSetsStore();

// INJECT

// PROPS, EMITS
const props = defineProps({
  message: {
    type: Object,
    default: () => ({}),
  },
});

// REFS
const projectTypes = ref([]);
const projectAreas = ref([]);
const projectDetails = ref([]);

const selectedProjectType = ref(false);
const selectedProjectArea = ref(false);
const selectedProjectDetail = ref(false);

// COMPUTED
const isProjectTypeEmpty = computed(() => !selectedProjectType.value);
const isProjectAreaEmpty = computed(() => !selectedProjectArea.value);

// COMPONENT METHODS AND LOGIC
const loadLazyData = () => {
  optionSetsStore
    .getOptionSetValuesFromApiRaw("project_type")
    .then((data) => (projectTypes.value = data));
};

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

const clearProjectAreasDropdown = () => {
  projectAreas.value = [];
  selectedProjectArea.value = null;
};

const clearProjectDetailsDropdown = () => {
  projectDetails.value = [];
  selectedProjectDetail.value = null;
};

const handleSelectedProjectTypeChange = (option) => {
  if (!option) {
    selectedProjectType.value = null;
    clearProjectAreasDropdown();
    clearProjectDetailsDropdown();
    return;
  }

  filterProjectAreasDropdown(option.value.id);
};

const handleSelectedProjectAreaChange = (option) => {
  if (!option) {
    selectedProjectArea.value = null;
    clearProjectDetailsDropdown();
    return;
  }
  filterProjectDetailsDropdown(option.value.id);
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  await loadLazyData();

  if (props.message) {
    selectedProjectType.value = props.message.project_type;
    selectedProjectArea.value = props.message.project_area;
    selectedProjectDetail.value = props.message.project_detail;
  }
});
</script>

<style scoped></style>
