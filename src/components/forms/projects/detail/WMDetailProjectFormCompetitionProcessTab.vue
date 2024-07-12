<template>
  <WMAddServiceAreasButton @add-service-areas="addServiceAreas" />

  <div v-for="serviceArea in serviceAreas" :key="serviceArea.id" class="my-5">
    <Accordion class="p-accordion--compact">
      <AccordionTab>
        <template #header>
          <span class="flex gap-2 w-full justify-between align-items-center">
            <span class="font-bold white-space-nowrap ml-auto">
              <WMOptionSetValue :option-set="serviceArea" />
            </span>

            <WMButton
              :text="$t('buttons.remove')"
              type="type-3"
              size="small"
              @click="deleteServiceArea(serviceArea.id)"
            >
              <template #customIcon>
                <div class="flex" v-html="DeleteIcon" />
              </template>
            </WMButton>
          </span>
        </template>

        <WMCompetitionProcessTable
          :columns="competitionProcessColumns"
          :service-area="serviceArea"
          :project-id="project.project_id"
        />
      </AccordionTab>
    </Accordion>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";

import DeleteIcon from "/icons/delete.svg?raw";

const { getCompetitionProcessColumns } = useListUtils();

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
// Create a promise.all to manage errors
const addServiceAreas = (data) => {
  data.newServiceAreas.forEach((serviceArea) => {
    addServiceArea(props.project.project_id, { service_area: serviceArea.id });
  });

  serviceAreas.value.push(...data.newServiceAreas);
};

// TODO: manage errors, toast, etc.
const deleteServiceArea = (id) => {
  serviceAreas.value = serviceAreas.value.filter((item) => item.id !== id);

  removeServiceArea(props.project.project_id, { service_area: id });
};
</script>

<style scoped lang="scss"></style>
