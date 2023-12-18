<template>
  <Card>
    <template #title> Classification </template>
    <template #content>
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
          @change="filterProjectDetailsDropdown($event.value.id)"
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
    </template>
  </Card>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

const optionSetsStore = useOptionSetsStore();

const projectTypes = ref([]);
const projectAreas = ref([]);
const projectDetails = ref([]);

const selectedProjectType = ref();
const selectedProjectArea = ref();
const selectedProjectDetail = ref();

onMounted(() => {
  optionSetsStore.getOptionSetValuesFromApi("project_type").then((data) => {
    projectTypes.value = data;
    selectedProjectType.value = data.find((item) => {
      return item.value === props.project.project_type;
    });
  });
  optionSetsStore.getOptionSetValuesFromApi("project_area").then((data) => {
    projectAreas.value = data;

    selectedProjectArea.value = data.find((item) => {
      return item.value === props.project.project_area;
    });
  });
  optionSetsStore
    .getOptionSetValuesFromApiRaw("project_detail")
    .then((data) => {
      projectDetails.value = data;

      selectedProjectDetail.value = data.find((item) => {
        return item.value === props.project.project_detail;
      });
    });
});

const emit = defineEmits(["projectTypeUpdate"]);

const filterProjectAreasDropdown = (value) => {
  optionSetsStore
    .getOptionSetValuesFromApiRaw("project_area", value)
    .then((data) => {
      projectAreas.value = data;
    });
};

const filterProjectDetailsDropdown = (value) => {
  console.log("filterProjectDetailsDropdown");

  optionSetsStore
    .getOptionSetValuesFromApiRaw("project_detail", value)
    .then((data) => {
      projectDetails.value = data;
    });
};

const clearProjectDetailsDropdown = () => {
  selectedProjectDetail.value = [];
};

const clearProjectAreasDropdown = () => {
  selectedProjectArea.value = [];
};

watch(
  () => selectedProjectType.value,
  (newValue) => {
    if (!newValue) {
      clearProjectAreasDropdown();
      clearProjectDetailsDropdown();
      emit("projectTypeUpdate", false);
      return;
    }

    emit("projectTypeUpdate", newValue.value);
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
