<template>
  <WMAddServiceAreasButton @add-service-areas="handleAddServiceArea" />
  <div v-for="serviceArea in serviceAreas" :key="serviceArea.id" class="my-5">
    <Accordion class="p-accordion--compact">
      <AccordionTab>
        <template #header>
          <span class="flex gap-1 w-full justify-between align-items-center">
            <span class="font-bold white-space-nowrap ml-auto">
              <WMOptionSetValue :option-set="serviceArea.service_area" />
            </span>

            <div class="flex gap-5 mx-2">
              <WMInput
                :value="formatDateFromAPI(serviceArea.expected_decision_date)"
                name="expected_decision_date"
                :label="$t('project.expected-decision-date') + ':'"
                type="date"
                :disabled="true"
                size="sm"
                :inline="true"
              />

              <WMInput
                :inline="true"
                :label="$t('due-date') + ':'"
                :value="formatDateFromAPI(serviceArea.due_date)"
                name="due_date"
                type="date"
                :disabled="true"
                size="sm"
              />
            </div>

            <Divider layout="vertical" />

            <WMButton
              :text="$t('buttons.remove')"
              type="type-3"
              size="small"
              class="mx-1"
              @click="deleteServiceArea(serviceArea.service_area.id)"
            >
              <template #customIcon>
                <div class="flex" v-html="DeleteIcon" />
              </template>
            </WMButton>
          </span>
        </template>

        <WMCompetitionProcessTable
          :columns="competitionProcessColumns"
          :service-area="serviceArea.service_area"
          :project-id="project.project_id"
        />
      </AccordionTab>
    </Accordion>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";

import { useI18n } from "vue-i18n";

import DeleteIcon from "/icons/delete.svg?raw";

const { formatDateFromAPI } = useDates();
const { getCompetitionProcessColumns } = useListUtils();
const { t } = useI18n();
const toast = useToast();

const { addServiceArea, removeServiceArea } = useProjects();

const competitionProcessColumns = ref(getCompetitionProcessColumns());

const serviceAreas = ref([]);

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

onMounted(() => {
  if (props.project.service_areas) {
    serviceAreas.value = props.project.service_areas;
  }
});

// TODO: manage errors, toast, etc.
// TODO: Create a promise.all to manage errors
const handleAddServiceArea = (data) => {
  let params = {
    service_area: data.service_area.id,
    expected_decision_date: data.expected_decision_date,
    due_date: data.due_date,
  };

  addServiceArea(props.project.project_id, params);

  serviceAreas.value.push({
    service_area: data.service_area,
    expected_decision_date: data.expected_decision_date,
    due_date: data.due_date,
  });

  toast.success({ title: t("project.toast-service-area-attached-title") });
};

// TODO: manage errors, toast, etc.
const deleteServiceArea = (id) => {
  serviceAreas.value = serviceAreas.value.filter((sa) => sa.service_area.id !== id);
  removeServiceArea(props.project.project_id, { service_area: id });
  toast.info({ title: t("project.toast-service-area-deattached-title") });
};
</script>

<style scoped lang="scss"></style>
