<template>
  <pre>budgetItems: {{ budgetItems }}</pre>

  <pre>payments: {{ payments }}</pre>
  <div class="flex flex-column gap-3 mb-3">
    <div class="flex flex-row justify-content-between">
      <div class="flex flex-row">
        <WMButton
          class="m-1 col-6"
          name="new"
          icon="new"
          icon-position="right"
          :disabled="budgetItems.length < 1"
          @click="handleNewPayment"
        >
          {{ t("new") }}
        </WMButton>
      </div>
      <!-- <div v-if="showFilters" class="flex flex-row align-items-center gap-3">
        <WMButton
          name="filter"
          icon="filter"
          :open="isFilterOpen"
          :applied="isFilterApplied"
          @click="openFilterSidebar"
          >{{ t("filter") }}
        </WMButton>

        <WMSidebar
          :visible="isFilterVisible"
          name="filterTask"
          @close-sidebar="closeFilterSidebar"
          @open-sidebar="openFilterSidebar"
        >
          <WMFilterForm entity="task" filter-form-name="task" />
        </WMSidebar>
        <WMOwnerToggle entity="task" />
      </div> -->
    </div>
    <div class="flex flex-row gap-3">
      <!-- <WMSearchBox entity="task" /> -->
    </div>
  </div>
  <DataTable
    v-model:selection="selectedPayments"
    v-model:editingRows="editingRows"
    lazy
    :value="payments"
    data-key="id"
    table-style="min-width: 50rem"
    scrollable
    paginator
    :rows="10"
    :first="0"
    :total-records="totalRecords"
    :class="`p-datatable-${tableClass}`"
    edit-mode="row"
    @page="onPage($event)"
    @row-edit-save="onRowEditSave"
  >
    <Column v-if="multiselect" style="width: 40px" selection-mode="multiple" />

    <Column :row-editor="true" :frozen="true" align-frozen="right"></Column>

    <template v-for="column in columns">
      <!-- <Column
      v-for="column in columns"
      :key="column.name"
      :field="column.name"
      :header="column.header ? $t(column.header) : $t(`budget.${column.name}`)"
      :class="column.class"
    > -->

      <Column
        v-if="column.type == 'text'"
        :key="column.name"
        :field="column.name"
        :header="getColumHeader(column)"
        :class="column.class"
      >
        <template #body="slotProps">
          {{ slotProps.data[column.field] }}
        </template>
        <template v-if="column.editable" #editor="{ data }">
          <InputText v-model="data[column.field]" />
        </template>
      </Column>

      <!-- <Column
        v-if="column.type == 'organization-link'"
        :key="column.name"
        :field="column.name"
        :header="getColumHeader(column)"
        :class="column.class"
      >
        <template #body="slotProps">
          <router-link
            :to="{
              name: 'projectBudgetDetail',
              params: {
                id: projectId,
              },
            }"
            target="_blank"
          >
            Link
          </router-link>
        </template>
      </Column> -->

      <Column
        v-if="column.type == 'currency'"
        :key="column.name"
        :field="column.name"
        :header="getColumHeader(column)"
        :class="column.class"
      >
        <template #body="{ data, field }">
          <WMInputCurrency v-model="data[field]" :read-only="true" />
        </template>
        <template #editor="{ data, field }">
          <WMInputCurrency v-model="data[field]" :read-only="false" />
        </template>
      </Column>

      <Column
        v-if="column.type == 'dropdown'"
        :key="column.name"
        :field="column.name"
        :header="getColumHeader(column)"
        :class="column.class"
      >
        <template #editor="{ data }">
          <Dropdown
            v-model="data[field]"
            :options="paymentStatuses"
            :option-label="optionLabelWithLang"
            option-value="value"
            placeholder="Select"
          >
            <template #option="slotProps">
              {{ slotProps.option.value }}
            </template>
          </Dropdown>
        </template>
        <template #body="slotProps">
          {{ slotProps.data[column.field] }}
        </template>
      </Column>

      <Column
        v-if="column.type == 'budget-item'"
        :key="column.name"
        :field="column.field"
        :header="getColumHeader(column)"
        :class="column.class"
      >
        <template #editor="{ data, field }">
          <Dropdown
            v-model="data[field]"
            :options="budgetItems"
            option-label="name"
            option-value="id"
            placeholder="Select a budget item"
          >
            <template #option="slotProps">
              {{ slotProps.option.name }}
            </template>
          </Dropdown>
        </template>
        <template #body="slotProps">
          {{ getBudgetItemName(slotProps.data[column.field]) }}
        </template>
      </Column>

      <Column
        v-if="column.type == 'status'"
        :key="column.name"
        field="payment_status_id"
        :header="getColumHeader(column)"
        :class="column.class"
      >
        <template #editor="{ data, field }">
          <Dropdown
            v-model="data[field]"
            :options="paymentStatuses"
            :option-label="optionLabelWithLang"
            option-value="id"
            placeholder="Select a Status"
          >
            <template #option="slotProps">
              <Tag
                :value="slotProps.option.value"
                :severity="getStatusLabel(slotProps.option.value)"
              />
            </template>
          </Dropdown>
        </template>
        <template #body="slotProps">
          <Tag
            :value="slotProps.data[column.field]"
            :severity="getStatusLabel(slotProps.data[column.field])"
          />
        </template>
      </Column>
    </template>

    <!-- <Column
      v-for="column in columns"
      :key="column.name"
      :field="column.name"
      :header="column.header ? $t(column.header) : $t(`budget.${column.name}`)"
      :class="column.class"
    >
      <template v-if="column.type === 'text'">
        {{ slotProps.data[column.field] }}
      </template>
      
    </Column> -->
  </DataTable>
</template>

<script setup>
import { onMounted, ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";

import { useOptionSetsStore } from "@/stores/optionSets";

const { getProjectPayments, getBudgetItems } = useProjects();
const { getPaymentsColumns } = useListUtils();

const { t } = useI18n();

// DEPENDENCIES
const optionSetsStore = useOptionSetsStore();
const { optionLabelWithLang } = useLanguages();

const paymentStatuses = ref([]);

optionSetsStore.getOptionSetValuesFromApi("payment_status").then((data) => {
  paymentStatuses.value = data;
});

const getColumHeader = (column) => {
  return column.header ? t(column.header) : t(`payments.${column.name}`);
};

const props = defineProps({
  projectId: {
    type: Number,
    required: true,
  },
});

const getBudgetItemName = (id) => {
  const budgetItem = budgetItems.value.find((item) => item.id === id);
  return budgetItem ? budgetItem.name : "";
};

const selectedPayments = ref([]);
// const isFilterOpen = ref(false);
// const isFilterApplied = ref(false);

const getStatusLabel = (status) => {
  console.log("status", status);
  switch (status) {
    case "INSTOCK":
      return "success";

    case "LOWSTOCK":
      return "warning";

    case "OUTOFSTOCK":
      return "danger";

    default:
      return null;
  }
};

const payments = ref([]);
const totalRecords = ref(0);
const lazyParams = ref({});
const searchValue = ref("");
const columns = ref(getPaymentsColumns());
const editingRows = ref([]);

onMounted(() => {
  loadLazyData();
});

const handleNewPayment = () => {
  console.log("new payment");
};

const budgetItems = ref([]);

const loadLazyData = () => {
  // const filters = utilsStore.filters["task"];
  const nextPage = lazyParams.value.page + 1;
  const searchValueParam = searchValue.value;
  const selectedRowsPerPageParam = 10;

  // Create a new URLSearchParams object by combining base filters and additional parameters
  const params = new URLSearchParams({
    // ...filters,
    page: nextPage ? nextPage : 1,
    per_page: selectedRowsPerPageParam,
    search: searchValueParam,
  });

  getProjectPayments(props.projectId, params).then((response) => {
    payments.value = [response.payments];
    totalRecords.value = response.totalRecords;
  });

  getBudgetItems(props.projectId).then((response) => {
    budgetItems.value = response.budgetItems;
  });
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const onRowEditSave = (event) => {
  let { newData, index } = event;

  payments.value[index] = newData;
};

// // first sidebar
// const isVisible = ref(false);

// function toggleSidebarVisibility() {
//   isVisible.value = !isVisible.value;
// }

// function closeSidebar() {
//   isVisible.value = false;
// }

// function openSidebar() {
//   isVisible.value = true;
// }

// const isFilterVisible = ref(false);

// function closeFilterSidebar() {
//   isFilterVisible.value = false;
// }

// function openFilterSidebar() {
//   isFilterVisible.value = true;
// }

watchEffect(() => {
  loadLazyData();
});
</script>
