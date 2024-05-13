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
      :related-entity="props.relatedEntity"
      :related-entity-id="props.relatedEntityId"
      @close-sidebar="closeSidebar"
      @new-service-created="loadLazyData"
    />
  </WMSidebar>
  <h2 v-if="!hideTitle" class="h2">{{ $t("service.service") }}</h2>
  <div v-if="showHeaderOptions" class="flex flex-column gap-3 mb-3">
    <div class="flex flex-row justify-content-between">
      <div class="flex flex-row gap-2">
        <WMButton
          v-if="!hideCreateButton"
          class="col-6"
          name="new"
          icon="new"
          icon-position="right"
          @click="toggleSidebarVisibility"
          >{{ t("new") }}</WMButton
        >

        <WMLinkServiceButton
          v-if="showLinkServiceButton"
          @new-service-linked="addNewServiceToTable"
        />

        <WMAssignOwnerButton
          v-if="can('services.assign')"
          entity="service"
          @owner-assigned="
            loadLazyData();
            clearSelectedServices();
          "
        />
      </div>
      <div class="flex flex-row align-items-center gap-3">
        <WMSidebar
          :visible="isFilterVisible"
          name="filterService"
          @close-sidebar="closeFilterSidebar"
          @open-sidebar="openFilterSidebar"
        >
          <WMFilterForm entity="service" filter-form-name="service" />
        </WMSidebar>

        <WMOwnerToggle entity="service" />
      </div>
    </div>
    <div class="flex flex-row gap-3">
      <WMSearchBox entity="service" />
      <WMFilterButton
        v-if="showFilters"
        :is-active="isFilterApplied || isFilterOpen"
        @click="openFilterSidebar"
      />
    </div>
  </div>
  <DataTable
    v-model:selection="selectedServices"
    lazy
    :row-class="rowClass"
    :value="services"
    data-key="service_number"
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
            params: { id: slotProps.data.service_number },
          }"
          class="vertical-align-middle"
          >{{ slotProps.data.service_number }}</router-link
        >
      </template>
      <template v-if="column.type === 'sla'" #body="slotProps">
        <WMSLATag
          v-if="slotProps.data.sla"
          :sla="slotProps.data.sla"
          :days-for-closing="slotProps.data.days_for_closing"
          :state="slotProps.data.state?.value"
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
      <template v-if="column.type === 'unlink'" #body="slotProps">
        <WMTempButton
          type="type-5"
          @click="handleUnlinkRelatedService(slotProps.data.id)"
        >
          <template #customIcon>
            <div class="flex" v-html="LinkOffIcon" />
          </template>
        </WMTempButton>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
// IMPORTS
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";

import LinkOffIcon from "/icons/link_off.svg?raw";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { t } = useI18n();
const { can } = usePermissions();
const dialog = useDialog();
const utilsStore = useUtilsStore();
const { getServicesFromApi, unlinkService } = useServices();
const { getPriorityClasses } = useListUtils();
const toast = useToast();

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
  hideCreateButton: {
    type: Boolean,
    default: false,
  },
  showFilters: {
    type: Boolean,
    default: true,
  },
  filters: {
    type: Object,
    default: null,
  },
  showLinkServiceButton: {
    type: Boolean,
    default: false,
  },
});

// REFS
const services = ref([]);
const selectedServices = ref(null);
const isFilterOpen = ref(false);
const searchValue = ref("");
const lazyParams = ref({});
const totalRecords = ref(0);
const isVisible = ref(false);
const isFilterVisible = ref(false);

// COMPUTED
const isFilterApplied = computed(() => {
  if (!utilsStore.filters["service"]) return 0;
  return Object.keys(utilsStore.filters["service"]).length;
});

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  const filters = { ...utilsStore.filters["service"], ...props.filters };
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
  if (props.relatedEntity == "contact") {
    params.append("contact", props.relatedEntityId);
  }
  if (props.relatedEntity == "asset") {
    params.append("asset", props.relatedEntityId);
  }
  if (props.relatedEntity == "service") {
    params.append("related_to", props.relatedEntityId);
  }

  getServicesFromApi(params).then((result) => {
    services.value = result.data;
    totalRecords.value = result.totalRecords;
  });
};

const clearSelectedServices = () => {
  selectedServices.value = [];
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const rowClass = (data) => {
  return [{ inactive_row: !data.is_active, is_new: data.is_new }];
};

const priorityClass = (data) => {
  return getPriorityClasses(data);
};

const onSelectionChanged = () => {
  utilsStore.selectedElements["service"] = selectedServices.value;
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

function addNewServiceToTable(newService) {
  services.value.unshift({ ...newService, is_new: true });

  setTimeout(() => {
    cleanNewServiceFlag();
  }, 5000);
}

function cleanNewServiceFlag() {
  services.value = services.value.map((service) => {
    return { ...service, is_new: false };
  });
}

const handleUnlinkRelatedService = async (serviceId) => {
  let result = await dialog.confirmUnlinkRelatedService();

  if (result) {
    unlinkService(serviceId, props.relatedEntityId).then(() => {
      loadLazyData();

      toast.info({
        message: t("service.toast-unlink-service-message"),
        title: t("service.toast-unlink-service-title"),
        life: 5000,
        group: "br",
      });
    });
  }
};

// PROVIDE, EXPOSE

// WATCHERS
watchEffect(() => {
  loadLazyData(); // listen to changes in the filters
});

watch(
  () => utilsStore.searchString["service"],
  () => {
    searchValue.value = utilsStore.searchString["service"];
    utilsStore.debounceAction(() => {
      loadLazyData();
    });
  }
);

watch(
  () => utilsStore.filters["service"],
  () => {
    loadLazyData();
  },
  { deep: true }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  loadLazyData();
});
</script>
