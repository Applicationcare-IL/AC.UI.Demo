<template>
  <Card>
    <template #title> {{ $t("project.classification") }} </template>
    <template #content>
      <div class="wm-form-row gap-5">
        <WMInputSearch
          name="project_type"
          :highlighted="true"
          :required="true"
          :label="$t('project.project_type') + ':'"
          type="input-search"
          width="152"
          :placeholder="$t('project.project_types_placeholder')"
          v-model="selectedProjectType"
          :option-set="true"
          :disabled="true"
        />

        <WMInputSearch
          name="project_area"
          :highlighted="true"
          :label="$t('project.project_area') + ':'"
          width="152"
          :placeholder="$t('project.project_areas_placeholder')"
          @change="filterProjectDetailsDropdown($event.value.id)"
          v-model="selectedProjectArea"
          :option-set="true"
          :disabled="true"
        />

        <WMInputSearch
          name="project_detail"
          :highlighted="true"
          :label="$t('project.project_detail') + ':'"
          width="152"
          :placeholder="$t('project.project_details_placeholder')"
          v-model="selectedProjectDetail"
          :option-set="true"
          :disabled="true"
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

const selectedProjectType = ref();
const selectedProjectArea = ref();
const selectedProjectDetail = ref();

onMounted(() => {
  optionSetsStore.getOptionSetValuesFromApiRaw("project_type").then((data) => {
    selectedProjectType.value = data.find((item) => {
      return item.value === props.project.project_type.value;
    });
  });

  optionSetsStore.getOptionSetValuesFromApiRaw("project_area").then((data) => {
    selectedProjectArea.value = data.find((item) => {
      return item.value === props.project.project_area?.value;
    });
  });

  optionSetsStore
    .getOptionSetValuesFromApiRaw("project_detail")
    .then((data) => {
      selectedProjectDetail.value = data.find((item) => {
        return item.value === props.project.project_detail?.value;
      });
    });
});
</script>

<style scoped lang="scss"></style>
