<template>
  <div class="filter-header flex flex-row justify-content-between p-4">
    <WMTempButton
      :text="$t('buttons.apply-filters')"
      type="primary"
      @click="applyFilters()"
    />
    <div class="flex flex-column align-items-center">
      <div class="h3">
        {{ translatedTitle }}
      </div>
      <span v-if="numberOfAppliedFilters == 0">
        {{ $t("filters.no-filters-applied") }}
      </span>
      <span v-else>
        {{ $t("filters.filters-applied") + ": " + numberOfAppliedFilters }}</span
      >
    </div>

    <WMTempButton :text="$t('buttons.clear-all')" type="clear mx-0 px-0" @click="clear" />
  </div>

  <Divider></Divider>
  <div class="filter-body p-4">
    <div>
      <WMFilterElement
        v-for="(filter, index) in filterElements"
        :key="index"
        ref="filterElementRefs"
        :placeholder="filter.placeholder"
        :label="filter.label"
        :type="filter.type"
        :entity="entity"
        :filter-name="filter.name"
        :option-set="filter.optionSet"
        :options="filter.options"
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

// COMPONENT METHODS AND LOGIC
const applyFilters = () => {
  utilsStore.filters[entity] = { ...filters.value };

  if (checkIfFiltersArrayKeysAreEmpty()) {
    clear();
  }

  closeSidebar();
};

const checkIfFiltersArrayKeysAreEmpty = () => {
  return Object.keys(filters.value).every((key) => {
    if (Array.isArray(filters.value[key])) {
      return filters.value[key].length === 0;
    }
  });
};

const addFilter = (filter) => {
  if (typeof filters.value === "undefined") {
    filters.value = {};
    return;
  }

  if (filter.value === null) {
    delete filters.value[filter.name];
    return;
  }

  filters.value[filter.name] = filter.value;
};

const clear = () => {
  console.log("clearing filters");

  filterElementRefs.value.forEach((filterElement) => {
    filterElement.clear();
  });

  filters.value = {};

  delete utilsStore.filters[entity];
};

// fill the filters with the current filters to keep the "active" states
if (utilsStore.filters[entity]) {
  filters.value = JSON.parse(JSON.stringify(utilsStore.filters[entity]));
}

// EXPOSE
// WATCHERS
// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
