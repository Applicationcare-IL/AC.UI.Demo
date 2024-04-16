<template>
  <WMSidebar
    :visible="isVisible"
    name="newService"
    @close-sidebar="closeSidebar"
    @open-sidebar="openSidebar"
  >
    <WMNewEntityFormHeader entity="service" name="newService" />
    <WMNewServiceForm
      :is-sidebar="true"
      :related-entity="selectedAssets[0]"
      :related-entity-id="selectedAssets[0]?.id"
      @close-sidebar="closeSidebar"
      @new-service-created="loadLazyData"
    />
  </WMSidebar>
  <h2 v-if="!hideTitle" class="h2">{{ $t("asset.asset") }}</h2>
  <div v-if="showHeaderOptions" class="flex flex-column gap-3 mb-3">
    <div class="flex flex-row justify-content-between">
      <div class="flex flex-row">
        <WMButton
          class="m-1 col-6"
          name="new"
          icon="new"
          icon-position="right"
          :disabled="selectedAssets?.length != 1"
          @click="toggleSidebarVisibility"
          >{{ t("new", ["service.service"]) }}</WMButton
        >

        <WMButton
          v-if="can(utilsStore.pluralEntity + '.export')"
          class="m-1 col-6"
          name="export-white"
          icon="export"
        >
          {{ $t("export") }}
        </WMButton>

        <Divider layout="vertical" />

        <WMDeactivateAssetButton
          entity="asset"
          @asset-deactivated="$emit('assetDeactivated')"
        />
      </div>

      <WMButton
        v-if="env.DEV"
        name="refresh"
        class="m-1 col-6"
        @click="loadLazyData"
        >Refresh
      </WMButton>
      <div class="flex flex-row align-items-center gap-3">
        <WMFilterButton
          :is-active="isFilterApplied || isFilterOpen"
          @click="openFilterSidebar"
        />

        <WMSidebar
          :visible="isFilterVisible"
          name="filterService"
          @close-sidebar="closeFilterSidebar"
          @open-sidebar="openFilterSidebar"
        >
          <WMFilterForm entity="asset" filter-form-name="asset" />
        </WMSidebar>

        <WMOwnerToggle entity="asset" />
      </div>
    </div>
    <div class="flex flex-row gap-3">
      <WMSearchBox entity="asset" />
    </div>
  </div>
  <DataTable
    v-model:selection="selectedAssets"
    lazy
    :row-class="rowClass"
    :value="assets"
    data-key="number"
    table-style="min-width: 50rem"
    scrollable
    paginator
    :rows="props.rows"
    :total-records="totalRecords"
    :class="`p-datatable-${tableClass}`"
    @page="onPage($event)"
    @update:selection="onSelectionChanged"
  >
    <Column
      v-if="multiselect"
      style="width: 40px"
      selection-mode="multiple"
    ></Column>
    <Column
      v-for="column in columns"
      :key="column.name"
      :field="column.name"
      :header="column.header ? $t(column.header) : $t(`service.${column.name}`)"
      :class="column.class"
    >
      <template v-if="column.type === 'detail'" #body="slotProps">
        <img src="/icons/eye.svg" alt="" class="vertical-align-middle" />
      </template>
      <template v-if="column.type === 'link'" #body="slotProps">
        <router-link
          :to="{
            name: 'serviceDetail',
            params: { id: slotProps.data.id },
          }"
          class="vertical-align-middle"
          >{{ slotProps.data[column.name].name }}</router-link
        >
      </template>
      <template v-if="column.type === 'sla'" #body="slotProps">
        <WMSLATag
          v-if="slotProps.data.sla"
          :sla="slotProps.data.sla"
          :days-for-closing="slotProps.data.days_for_closing"
          :state="slotProps.data.state.value"
        >
        </WMSLATag>
      </template>
      <template v-if="column.type === 'priority'" #body="slotProps">
        <div :class="priorityClass(slotProps.data)">
          {{ slotProps.data.is_active ? slotProps.data.priority : "-" }}
        </div>
      </template>
      <template v-if="column.type === 'translate'" #body="slotProps">
        {{ $t(slotProps.data[column.name]) }}
      </template>
      <template v-if="column.type === 'optionset'" #body="slotProps">
        <WMOptionSetValue :option-set="slotProps.data[column.name]" />
      </template>
      <template v-if="column.type === 'state'" #body="slotProps">
        <WMStateField :state="slotProps.data[column.name].value" />
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
//IMPORTS;
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { t } = useI18n();
const { can } = usePermissions();
const utilsStore = useUtilsStore();
const { getAssetsFromApi } = useAssets();
const { getPriorityClasses } = useListUtils();

// INJECT

// PROPS, EMITS
const props = defineProps({
  // services: Array,
  rows: {
    type: Number,
    default: 10,
  },
  columns: {
    type: Array,
    required: true,
  },
  multiselect: {
    type: Boolean,
    default: false,
  },
  relatedEntity: {
    type: String,
    default: null,
  },
  relatedEntityId: {
    type: String,
    default: null,
  },
  showHeaderOptions: {
    type: Boolean,
    default: true,
  },
  tableClass: {
    type: String,
    default: "",
  },
  hideTitle: {
    type: Boolean,
    default: false,
  },
});

// REFS
const assets = ref([]);
const selectedAssets = ref(null);
const isFilterOpen = ref(false);
const searchValue = ref("");
const lazyParams = ref({});
const totalRecords = ref(0);
const isVisible = ref(false);
const isFilterVisible = ref(false);

// COMPUTED
const isFilterApplied = computed(() => {
  if (!utilsStore.filters["asset"]) return 0;
  return Object.keys(utilsStore.filters["asset"]).length;
});

// COMPONENT METHODS
const loadLazyData = async () => {
  const filters = utilsStore.filters["asset"];
  const nextPage = lazyParams.value.page + 1;
  const searchValueParam = searchValue.value;
  const selectedRowsPerPageParam = props.rows;

  // Create a new URLSearchParams object by combining base filters and additional parameters
  const params = new URLSearchParams({
    ...filters,
    page: nextPage,
    per_page: selectedRowsPerPageParam,
    search: searchValueParam,
  });

  if (props.relatedEntity == "customer") {
    params.append("customer", props.relatedEntityId);
  }
  // if (props.relatedEntity == "contact") {
  //   params.append("contact", props.relatedEntityId);
  // }
  // if (props.relatedEntity == "asset") {
  //   params.append("asset", props.relatedEntityId);
  // }

  getAssetsFromApi(params).then((result) => {
    assets.value = result.data;
    totalRecords.value = result.totalRecords;
    console.log("assets", assets.value);
  });
};

const clearSelectedAssets = () => {
  selectedAssets.value = [];
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const rowClass = (data) => {
  return [{ inactive_row: !data.is_active }];
};

const priorityClass = (data) => {
  return getPriorityClasses(data);
};

const onSelectionChanged = () => {
  utilsStore.selectedElements["asset"] = selectedAssets.value;
};

function toggleSidebarVisibility() {
  isVisible.value = !isVisible.value;
}

function closeSidebar() {
  isVisible.value = false;
}

function openSidebar() {
  isVisible.value = true;
}

function closeFilterSidebar() {
  isFilterVisible.value = false;
}

function openFilterSidebar() {
  isFilterVisible.value = true;
}

// PROVIDE, EXPOSE

// WATCHERS
watchEffect(() => {
  loadLazyData();
});

watch(
  () => utilsStore.searchString["asset"],
  () => {
    searchValue.value = utilsStore.searchString["asset"];
    utilsStore.debounceAction(() => {
      loadLazyData();
    });
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  loadLazyData();
});

// Dev tools
const env = import.meta.env;
</script>
