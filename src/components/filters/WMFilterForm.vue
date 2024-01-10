<template>
  <div class="filter-header flex flex-row justify-content-between p-4">
    <Button @click="applyFilter">{{ $t("buttons.apply-filters") }}</Button>
    <div class="flex flex-column align-items-center">
      <div class="h3">
        {{ translatedTitle }}
      </div>
      <span v-if="appliedFilters == 0">
        {{ $t("filters.no-filters-applied") }}
      </span>
      <span v-else>הופעלו {{ appliedFilters }} סננים </span>
    </div>

    <Button @click="clear" link>{{ $t("buttons.clear-all") }}</Button>
  </div>
  <Divider></Divider>
  <div class="filter-body p-4">
    <div>
      <WMFilterElement
        v-for="filter in filterElements"
        :placeholder="filter.placeholder"
        :label="filter.label"
        ref="filterElementRefs"
        :type="filter.type"
        :entity="entity"
        :filterName="filter.name"
        :optionSet="filter.optionSet"
        :searchFunction="filter.searchFunction"
        @update:filter="addFilter"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUtilsStore } from "@/stores/utils";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const { entity, filterFormName } = defineProps({
  entity: String,
  filterFormName: String,
});

const translatedTitle = computed(() => {
  return t(`filters.${entity}-title`);
});

const utilsStore = useUtilsStore();

const filters = ref({});

const appliedFilters = computed(() => {
  if (!utilsStore.filters[entity]) return 0;
  return Object.keys(utilsStore.filters[entity]).length;
});

const filterElementRefs = ref([]);

const addFilter = (filter) => {
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
