<template>
  <div class="filter-header flex flex-row justify-content-between p-4">
    <Button @click="applyFilter"> החל סינון </Button>
    <div class="flex flex-column align-items-center">
      <h3>סינון אנשי קשר</h3>
      <span v-if="appliedFilters == 0">לא הופעלו סננים</span>
      <span>{{ appliedFilters }}</span>
    </div>
    <Button @click="clear">נקה הכל</Button>
  </div>
  <Divider></Divider>
  <div class="filter-body p-4">
    <div>
      <WMFilterElement
        v-for="filter in filterElements"
        ref="filterElementRefs"
        :type="filter.type"
        :entity="entity"
        :filterName="filter.name"
        :optionSet="filter.optionSet"
        @update:filter="addFilter"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUtilsStore } from "@/stores/utils";

const { entity, filterFormName } = defineProps({
  entity: String,
  filterFormName: String,
});

const utilsStore = useUtilsStore();

const filters = ref({});

const appliedFilters = computed(() => {
  if (!utilsStore.filters[entity]) return 0;
  return Object.keys(utilsStore.filters[entity]).length;
});

const filterElementRefs = ref([]);

const addFilter = (filter) => {
  console.log(filter.value);
  if (filter.value == null) delete filters.value[filter.name];
  else filters.value[filter.name] = filter.value;
};

const applyFilter = () => {
  utilsStore.filters[entity] = { ...filters.value };
};

const { filterList } = useFilters();
const filterElements = ref(filterList[filterFormName]);

const clear = () => {
  filterElementRefs.value.forEach((filterElement) => {
    filterElement.clear();
  });
  filters.value = {};
  delete utilsStore.filters[entity];
};
</script>
