<template>
  <WMButton name="new" icon="new" @click="toggle">תחום שירות חדש</WMButton>

  <OverlayPanel
    ref="isOpen"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
  >
    <WMInputSearch
      name="service-areas"
      placeholder="חיפוש תחום שירות"
      :multiple="true"
      :modelValue="selectedServiceAreas"
      @update:modelValue="updateSelectedServiceAreas"
      theme="purple"
      class="custom-input-search__input"
      ref="inputSearch"
      :options="serviceAreas"
    />
    <Button
      :disabled="selectedServiceAreas == 0"
      class="custom-input-search__clear mt-4"
      @click="emit('addServiceAreas', selectedServiceAreas)"
    >
      הוספה
    </Button>
  </OverlayPanel>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useLayout } from "@/layout/composables/layout";
import { useOptionSetsStore } from "@/stores/optionSets";

const optionSetsStore = useOptionSetsStore();

const { layoutConfig } = useLayout();

const emit = defineEmits(["addServiceAreas"]);

const selectedServiceAreas = ref([]);
const serviceAreas = ref({});

const updateSelectedServiceAreas = (event) => {
  selectedServiceAreas.value = event;
};

const isOpen = ref();
const toggle = (event) => {
  isOpen.value.toggle(event);
};

onMounted(() => {
  optionSetsStore.getOptionSetValuesFromApi("service_area").then((data) => {
    serviceAreas.value = data;
  });
});
</script>

<style scoped lang="scss"></style>
