<template>
  <div class="filter-header flex flex-row justify-content-between p-4">
    <Button @click="applyFilters()">{{ $t("buttons.apply-filters") }}</Button>
    <div class="flex flex-column align-items-center">
      <div class="h3">
        {{ translatedTitle }}
      </div>
      <span v-if="numberOfAppliedFilters == 0">
        {{ $t("filters.no-filters-applied") }}
      </span>
      <span v-else>הופעלו {{ numberOfAppliedFilters }} סננים </span>
    </div>

    <Button link @click="clear">{{ $t("buttons.clear-all") }}</Button>
  </div>
  <Divider></Divider>
  <div class="filter-body p-4">
    <div>
      <WMFilterElement
        v-for="(filter, index) in filterElements"
        :key="index + forceRerender"
        ref="filterElementRefs"
        :placeholder="filter.placeholder"
        :label="filter.label"
        :type="filter.type"
        :entity="entity"
        :filter-name="filter.name"
        :option-set="filter.optionSet"
        :search-function="filter.searchFunction"
        :filter-data="filter"
        :applied-filters="appliedFilters"
        @update:filter="addFilter"
      />
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { computed, inject, ref } from "vue";
import { useI18n } from "vue-i18n";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { t } = useI18n();
const utilsStore = useUtilsStore();
const { filterList } = useFilters();

// INJECT
const closeSidebar = inject("closeSidebar");

// PROPS, EMITS
const { entity, filterFormName } = defineProps({
  entity: String,
  filterFormName: String,
});

// REFS
const filters = ref({});
const filterElementRefs = ref([]);
const filterElements = ref(filterList[filterFormName]);
const forceRerender = ref(0);

// COMPUTED
const translatedTitle = computed(() => {
  return t(`filters.${entity}-title`);
});

const appliedFilters = computed(() => {
  return utilsStore.filters[entity];
});

const numberOfAppliedFilters = computed(() => {
  if (!utilsStore.filters[entity]) return 0;
  return Object.keys(utilsStore.filters[entity]).length;
});

// COMPONENT METHODS
const applyFilters = () => {
  utilsStore.filters[entity] = { ...filters.value };
  closeSidebar();
};

const addFilter = (filter) => {
  if (typeof filters.value === "undefined") {
    filters.value = {};
  }

  if (filter.value == null) {
    delete filters.value[filter.name];
  }

  filters.value[filter.name] = filter.value;
};

const forceRerenderFilterElements = () => {
  forceRerender.value++;
};

const clear = () => {
  filterElementRefs.value.forEach((filterElement) => {
    filterElement.clear();
  });

  filters.value = {};

  delete utilsStore.filters[entity];

  forceRerenderFilterElements();
};

filters.value = utilsStore.filters[entity];

// EXPOSE
// WATCHERS
// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
