<template>
  <Card>
    <template #title> {{ $t("project.classification") }} </template>
    <template #content>
      <div class="wm-form-row gap-5">
        <WMInputSearch
          v-model="selectedProjectType"
          name="project_type"
          :highlighted="true"
          :required="true"
          :label="$t('project.project_type') + ':'"
          type="input-search"
          width="152"
          :options="projectTypes"
          :placeholder="$t('project.project_types_placeholder')"
          :option-set="true"
          :disabled="isDisabled"
        />

        <WMInputSearch
          v-model="selectedProjectArea"
          name="project_area"
          :highlighted="true"
          :label="$t('project.project_area') + ':'"
          width="152"
          :options="projectAreas"
          :placeholder="$t('project.project_areas_placeholder')"
          :option-set="true"
          :disabled="isDisabled"
          @change="filterProjectDetailsDropdown($event.value.id)"
        />

        <WMInputSearch
          v-model="selectedProjectDetail"
          name="project_detail"
          :highlighted="true"
          :label="$t('project.project_detail') + ':'"
          width="152"
          :options="projectDetails"
          :placeholder="$t('project.project_details_placeholder')"
          :option-set="true"
          :disabled="isDisabled"
        />
      </div>
    </template>
  </Card>
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
  project: {
    type: Object,
    required: true,
  },
});

// REFS
const projectTypes = ref([]);
const projectAreas = ref([]);
const projectDetails = ref([]);

const selectedProjectType = ref();
const selectedProjectArea = ref();
const selectedProjectDetail = ref();

// COMPUTED
const isDisabled = computed(() => {
  return props.project.status.value === "pending_configuration" ? false : true;
});

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  optionSetsStore.getOptionSetValuesFromApiRaw("project_type").then((data) => {
    projectTypes.value = data;

    selectedProjectType.value = data.find((item) => {
      return item.value === props.project.project_type.value;
    });
  });

  optionSetsStore.getOptionSetValuesFromApiRaw("project_area").then((data) => {
    projectAreas.value = data;

    selectedProjectArea.value = data.find((item) => {
      return item.value === props.project.project_area?.value;
    });
  });

  optionSetsStore.getOptionSetValuesFromApiRaw("project_detail").then((data) => {
    projectDetails.value = data;

    selectedProjectDetail.value = data.find((item) => {
      return item.value === props.project.project_detail?.value;
    });
  });
});
</script>

<style scoped lang="scss"></style>
