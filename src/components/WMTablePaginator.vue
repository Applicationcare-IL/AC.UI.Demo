<template>
  <div class="flex gap-2 align-items-center">
    {{ $t("entries-per-page") }}:
    <Dropdown
      v-model="rowsPerPage"
      :options="rowsPerPageOptions"
      class="small-dropdown"
      @change="onRowsUpdate"
    />
  </div>
  <Divider layout="vertical" />
  <Paginator
    class="wm-table-paginator"
    :rows="rowsPerPage"
    :total-records="totalRecords"
    :rows-per-page-options="rowsPerPageOptions"
    template="CurrentPageReport"
    :current-page-report-template="currentPageReportTemplate"
  />
</template>

<script setup>
// IMPORTS
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

// DEPENDENCIES
const { locale } = useI18n();

const { selectedRowsPerPage } = useListUtils();

// INJECT

// PROPS, EMITS
const props = defineProps({
  rows: {
    type: Number,
    default: 10,
  },
  totalRecords: {
    type: Number,
    default: 0,
  },
});

// REFS
const rowsPerPage = ref(props.rows);
const rowsPerPageOptions = ref([10, 15, 25, 50, 100]);

// COMPUTED
const currentPageReportTemplate = computed(() => {
  if (locale.value === "en") {
    return "Showing {first} to {last} of {totalRecords}";
  }

  return "מציג {first}-{last} מתוך {totalRecords}";
});

// COMPONENT METHODS AND LOGIC
const onRowsUpdate = (event) => {
  rowsPerPage.value = event.value;
  selectedRowsPerPage.value = event.value;
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss">
.small-dropdown {
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  :deep(.p-dropdown-trigger) {
    padding: 0 0.5rem;
  }
}

.wm-table-paginator :deep(.p-paginator),
.wm-table-paginator :deep(.p-paginator-content),
.wm-table-paginator :deep(.p-paginator-current) {
  padding: 0;
}
</style>
