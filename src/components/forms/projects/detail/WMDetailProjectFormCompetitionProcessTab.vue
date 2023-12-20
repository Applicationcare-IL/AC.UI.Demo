<template>
  <WMAddServiceAreasButton @addServiceAreas="addServiceAreas" />

  <div class="my-5" v-for="serviceArea in serviceAreas" :key="serviceArea.id">
    <Accordion class="p-accordion--compact">
      <AccordionTab>
        <template #header>
          <span class="flex gap-2 w-full justify-between">
            <span class="font-bold white-space-nowrap ml-auto">
              {{ serviceArea.label }}
            </span>

            <Button
              icon="pi pi-trash"
              label="הסרה"
              severity="secondary"
              @click="deleteServiceArea(serviceArea.id)"
            />
          </span>
        </template>

        <WMCompetitionProcessTable :columns="competitionProcessColumns" />
      </AccordionTab>
    </Accordion>
  </div>
</template>
<script setup>
import { ref } from "vue";
const { getCompetitionProcessColumns } = useListUtils();

const competitionProcessColumns = ref(getCompetitionProcessColumns());

const serviceAreas = ref([
  {
    value: "SPI",
    id: 911,
    name: "SPI",
    label: "SPI",
    value_he: "שיפור פני העיר",
    value_en: "SPI",
  },
]);

const addServiceAreas = (event) => {
  serviceAreas.value.push(...event);
};

const deleteServiceArea = (id) => {
  serviceAreas.value = serviceAreas.value.filter((item) => item.id !== id);
};
</script>

<style scoped lang="scss"></style>
