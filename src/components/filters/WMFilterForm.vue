<template>
  <div class="filter-header flex flex-row justify-content-between p-4">
    <Button @click="applyFilter"> החל סינון </Button>
    <div class="flex flex-column align-items-center">
      <h3>סינון אנשי קשר</h3>
      <span>לא הופעלו סננים</span>
    </div>
    <Button>נקה הכל</Button>
  </div>
  <Divider></Divider>
  <div class="filter-body p-4">
    <div v-for="filter in filterElements">
      <WMFilterElement
        :type="filter.type"
        :entity="entity"
        :filterName="filter.name"
        :optionSet="filter.optionSet"
        @update:filter="addFilter"
      />
      <Divider></Divider>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUtilsStore } from "@/stores/utils";

const { entity, filterFormName } = defineProps({
  entity: String,
  filterFormName: String,
});

const utilsStore = useUtilsStore();

const filters = ref({});

const addFilter = (filter) => {
  console.log("filter", filter);
  filters.value[filter.name] = filter.value;
};

const applyFilter = () => {
  utilsStore.filters[entity] = { ...filters.value };
};

const { filterList } = useFilters();

console.log("filterList", filterList);

const filterElements = ref(filterList[filterFormName]);
</script>
