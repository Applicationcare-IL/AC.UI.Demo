<template>
  <WMListSubHeader
    v-if="permissions.services.read"
    entity="asset"
    :total-records="totalRecords"
    @new="toggleSidebarVisibility"
    @refresh-table="
      loadLazyData();
      clearSelectedAssets();
    "
  >
  </WMListSubHeader>

  <WMSidebar
    :visible="isVisible"
    name="newService"
    @close-sidebar="closeSidebar"
    @open-sidebar="openSidebar"
  >
    <template v-if="can('services.create')">
      <WMNewEntityFormHeader entity="service" name="newService" />
      <WMNewServiceForm :is-sidebar="true" @close-sidebar="closeSidebar" />
    </template>
    <template v-else>
      <div class="m-5">
        {{ $t("permissions.you-dont-have-permission") }}
      </div>
    </template>
  </WMSidebar>

  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <DataTable
      v-if="permissions.services.read"
      ref="dt"
      v-model:selection="selectedAssets"
      lazy
      :value="assets"
      data-key="id"
      table-style="min-width: 50rem"
      class="p-datatable-sm"
      paginator
      scrollable
      scroll-height="flex"
      :rows="selectedRowsPerPage"
      :first="0"
      :total-records="totalRecords"
      :loading="loading"
      @page="onPage($event)"
      @update:selection="onSelectionChanged"
    >
      <Column style="width: 40px" selection-mode="multiple"></Column>
      <Column field="asset" :header="$t('asset.asset')" class="link-col">
        <template #body="slotProps">
          <router-link
            v-if="slotProps.data.id"
            :to="{
              name: 'assetDetail',
              params: { id: slotProps.data.id },
            }"
            class="vertical-align-middle"
            >{{ slotProps.data.number }}</router-link
          >
        </template>
      </Column>
      <Column field="type.name" :header="$t('asset.asset-type')">
        <template #body="slotProps">
          <WMOptionSetValue :option-set="slotProps.data.type" />
        </template>
      </Column>
      <Column field="owner" :header="$t('customer.customer')" class="link-col">
        <template #body="slotProps">
          <router-link
            v-if="slotProps.data.owner?.id"
            :to="{
              name: 'customerDetail',
              params: { id: slotProps.data.owner?.id },
            }"
            class="vertical-align-middle"
          >
            {{ slotProps.data.owner.name }}
          </router-link>
        </template>
      </Column>
      <Column field="owner" :header="$t('customer.customer')" class="link-col">
        <template #body="slotProps">
          <router-link
            v-if="slotProps.data.payer?.id"
            :to="{
              name: 'customerDetail',
              params: { id: slotProps.data.payer?.id },
            }"
            class="vertical-align-middle"
          >
            {{ slotProps.data.payer.name }}
          </router-link>
        </template>
      </Column>
      <Column field="owner" :header="$t('customer.customer')" class="link-col">
        <template #body="slotProps">
          <router-link
            v-if="slotProps.data.consumer?.id"
            :to="{
              name: 'customerDetail',
              params: { id: slotProps.data.consumer?.id },
            }"
            class="vertical-align-middle"
          >
            {{ slotProps.data.consumer.name }}
          </router-link>
        </template>
      </Column>
      <Column field="usage_start_date" :header="$t('asset.usage_start_date')"></Column>
      <Column
        field="status"
        :header="$t('project.status')"
        class="p-0 filled-td"
        style="width: 30px"
      >
        <template #body="slotProps">
          <div
            :class="statusClass(slotProps.data.state.value)"
            class="status-label h-full w-full"
          >
            <WMOptionSetValue :option-set="slotProps.data.state" />
          </div>
        </template>
      </Column>
      <Column field="address" :header="$t('location.address')" style="width: 30px">
        <template #body="slotProps">
          <div class="overflow-x-auto">
            {{ formatAddress(slotProps.data.location) }}
          </div>
        </template>
      </Column>
      <Column
        field="open_services"
        :header="$t('asset.open-services')"
        class="numeric"
      ></Column>
      <Column
        field="breached_services"
        :header="$t('asset.breached-services')"
        class="numeric"
      >
        <template #body="slotProps">
          <div :class="highlightCellClass(slotProps.data.breached_services)">
            {{ slotProps.data.breached_services }}
          </div>
        </template>
      </Column>
      <Column
        field="open_tasks"
        :header="$t('asset.open-tasks')"
        class="numeric"
      ></Column>
      <Column field="breached_tasks" :header="$t('asset.breached-tasks')" class="numeric">
        <template #body="slotProps">
          <div :class="highlightCellClass(slotProps.data.breached_tasks)">
            {{ slotProps.data.breached_tasks }}
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, watchEffect } from "vue";

const { can } = usePermissions();

import { useFormUtilsStore } from "@/stores/formUtils";
import { usePermissionsStore } from "@/stores/permissionsStore";
import { useUtilsStore } from "@/stores/utils";

useHead({
  title: "Assets",
});

const permissionsStore = usePermissionsStore();
const permissions = permissionsStore.permissions;
const { formatAddress, formatCityData } = useUtils();

const { selectedRowsPerPage, getStatusConditionalStyle } = useListUtils();

const { getAssetsFromApi, setSelectedAssets, resetSelectedAssets } = useAssets();

onMounted(() => {
  utilsStore.entity = "asset";

  loadLazyData();
  resetSelectedAssets();
});

const utilsStore = useUtilsStore();

//Pagination and table content
const totalRecords = ref(0);
const lazyParams = ref({});
const assets = ref();
const loading = ref(false);
const dt = ref();
const searchValue = ref("");

const loadLazyData = () => {
  loading.value = true;

  const filters = utilsStore.filters["asset"];
  const nextPage = lazyParams.value.page + 1;
  const searchValueParam = searchValue.value;
  const selectedRowsPerPageParam = selectedRowsPerPage.value;

  // Create a new URLSearchParams object by combining base filters and additional parameters
  const params = new URLSearchParams({
    ...filters,
    page: nextPage,
    per_page: selectedRowsPerPageParam,
    search: searchValueParam,
  });

  getAssetsFromApi(params).then((result) => {
    assets.value = result.data;
    totalRecords.value = result.totalRecords;
    loading.value = false;
  });
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const clearSelectedAssets = () => {
  selectedAssets.value = [];
  onSelectionChanged();
};

//Display sidebars
const isVisible = ref(false);

function toggleSidebarVisibility() {
  isVisible.value = !isVisible.value;
}

function closeSidebar() {
  isVisible.value = false;
}

function openSidebar() {
  isVisible.value = true;
}

//Move to Store
const highlightCellClass = (data) => {
  return [{ "bg-red-100 text-red-600": data > 0 }];
};

const statusClass = (data) => {
  return getStatusConditionalStyle(data);
};

//Manage selected rows
const selectedAssets = ref([]);
utilsStore.resetElements();

const onSelectionChanged = () => {
  setSelectedAssets(selectedAssets.value);

  utilsStore.selectedElements["asset"] = selectedAssets.value;
};

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
</script>

<style scoped lang="scss"></style>
