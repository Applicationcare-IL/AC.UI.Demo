<template>
  <WMAddServiceAreasButton @addServiceAreas="addServiceAreas" />

  <div class="my-5" v-for="serviceArea in serviceAreas" :key="serviceArea.id">
    <Accordion class="p-accordion--compact">
      <AccordionTab>
        <template #header>
          <span class="flex gap-2 w-full justify-between">
            <span class="font-bold white-space-nowrap ml-auto">
              <WMOptionSetValue :optionSet="serviceArea" />
            </span>

            <Button
              icon="pi pi-trash"
              label="הסרה"
              severity="secondary"
              @click="deleteServiceArea(serviceArea.id)"
            />
          </span>
        </template>
        WIP Table
        <!-- <WMCompetitionProcessTable :columns="competitionProcessColumns" /> -->
      </AccordionTab>
    </Accordion>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
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
  console.log("onmounted", props.project);
  if (props.project.service_areas) {
    serviceAreas.value = props.project.service_areas;
  }
});

// TODO: manage errors, toast, etc.
const addServiceAreas = (newServiceAreas) => {
  newServiceAreas.forEach((serviceArea) => {
    addServiceArea(props.project.project_id, { service_area: serviceArea.id });
  });

  serviceAreas.value.push(...newServiceAreas);
};

// TODO: manage errors, toast, etc.
const deleteServiceArea = (id) => {
  serviceAreas.value = serviceAreas.value.filter((item) => item.id !== id);

  removeServiceArea(props.project.project_id, { service_area: id });
};
</script>

<style scoped lang="scss"></style>
