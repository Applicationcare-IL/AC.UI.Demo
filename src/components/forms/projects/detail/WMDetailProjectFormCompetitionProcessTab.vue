<template>
  <WMDetailProjectFormAddServiceAreasButton
    @addServiceAreas="addServiceAreas"
  />

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
      </AccordionTab>
    </Accordion>
  </div>
</template>
<script setup>
import { ref } from "vue";

const serviceAreas = ref([]);

const addServiceAreas = (event) => {
  serviceAreas.value.push(...event);
};

const deleteServiceArea = (id) => {
  serviceAreas.value = serviceAreas.value.filter((item) => item.id !== id);
};
</script>

<style scoped lang="scss"></style>
