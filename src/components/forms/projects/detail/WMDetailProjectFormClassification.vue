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
          @change="handleProjectTypeInputChange($event.value)"
          :modelValue="project.project_type"
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
          :modelValue="project.project_area"
        />

        <WMInputSearch
          name="project_detail"
          :highlighted="true"
          :required="true"
          :label="'project details' + ':'"
          :options="projectDetails"
          width="152"
          :placeholder="$t('select', ['classification-3'])"
          :modelValue="project.project_detail"
        />
      </div>
    </template>
  </Card>
</template>
<script setup>
import { ref, onMounted } from "vue";

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

const emit = defineEmits(["projectTypeUpdate"]);

const handleProjectTypeInputChange = (value) => {
  if (!value) {
    emit("projectTypeUpdate", false);

    return;
  }

  emit("projectTypeUpdate", value.value);
  filterProjectAreasDropdown(value.id);
};

const filterProjectAreasDropdown = (value) => {
  optionSetsStore
    .getOptionSetValuesFromApiRaw("project_area", value)
    .then((data) => {
      projectAreas.value = data;
    });
};

const filterProjectDetailsDropdown = (value) => {
  optionSetsStore
    .getOptionSetValuesFromApiRaw("project_detail", value)
    .then((data) => {
      projectDetails.value = data;
    });
};
</script>

<style scoped lang="scss"></style>
