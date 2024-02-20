<template>
  <WMSidebar
    :visible="isVisible"
    name="newBudgetItem"
    :data="{ relatedEntity: relatedEntity, relatedEntityId: relatedEntityId }"
    @close-sidebar="closeSidebar"
    @open-sidebar="openSidebar"
  >
    <template #default>
      <WMNewBudgetItemForm
        :related-budget="relatedBudget"
        :is-sidebar="true"
        @new-budget-item-created="loadLazyData"
      />
    </template>
  </WMSidebar>
  <div class="flex flex-column gap-3 mb-3">
    <div class="flex flex-row justify-content-between">
      <div class="flex flex-row">
        <WMButton
          class="m-1 col-6"
          name="new"
          icon="new"
          icon-position="right"
          @click="toggleSidebarVisibility"
          >{{ t("new") }}</WMButton
        >
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
    v-model:selection="selectedBudgetItems"
    lazy
    :value="budgetItems"
    data-key="task_number"
    table-style="min-width: 50rem"
    scrollable
    paginator
    :rows="10"
    :first="0"
    :total-records="totalRecords"
    :class="`p-datatable-${tableClass}`"
    @page="onPage($event)"
  >
    <!-- <Column>
      <template #body="slotProps">
        <WMButton
          name="edit"
          icon="edit"
          icon-position="right"
          @click="openSidebarEditBudgetItemSidebar"
        />
      </template>
    </Column> -->
    <Column v-if="multiselect" style="width: 40px" selection-mode="multiple" />
    <Column
      v-for="column in columns"
      :key="column.name"
      :field="column.name"
      :header="column.header ? $t(column.header) : $t(`budget.${column.name}`)"
      :class="column.class"
    >
      <template #body="slotProps">
        <template v-if="column.type === 'budget-item-link'">
          <router-link
            :to="{
              name: 'projectBudgetItemDetail',
              params: { id: projectId, budgetId: slotProps.data.id },
            }"
            class="vertical-align-middle"
          >
            {{ slotProps.data.name }}
          </router-link>
        </template>
        <template v-if="column.type === 'currency'">
          <WMInputCurrency
            v-model="slotProps.data[column.field]"
            class="flex align-items-center justify-content-between"
            :read-only="true"
            name="currency"
          />
        </template>
        <template v-if="column.type === 'balance'">
          <WMHighlightedBalanceBlock
            size="small"
            :quantity="slotProps.data[column.field]"
            label=""
          />
        </template>
        <template v-if="column.type === 'text'">
          {{ slotProps.data[column.field] }}
        </template>
      </template>
    </Column>
  </DataTable>

  <!-- <WMSidebar
    :visible="editBudgetItemSidebarVisibility"
    name="editBudgetItemSidebar"
    @close-sidebar="closeSidebarEditBudgetItemSidebar"
    @open-sidebar="openSidebarEditBudgetItemSidebar"
  >
    <template #default="slotProps">
      <WMNewBudgetItemForm />
    </template>
  </WMSidebar> -->
</template>

<script setup>
import { onMounted, ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";

const { getBudgetItems } = useProjects();
const { t } = useI18n();

const editBudgetItemSidebarVisibility = ref(false);

function closeSidebarEditBudgetItemSidebar() {
  editBudgetItemSidebarVisibility.value = false;
}

function openSidebarEditBudgetItemSidebar() {
  editBudgetItemSidebarVisibility.value = true;
}

const { getBudgetItemsTableColumns } = useListUtils();

const props = defineProps({
  projectId: {
    type: Number,
    required: true,
  },
  relatedBudget: {
    type: Object,
    required: true,
  },
});

const selectedBudgetItems = ref([]);
// const isFilterOpen = ref(false);
// const isFilterApplied = ref(false);

const budgetItems = ref([]);
const totalRecords = ref(0);
const lazyParams = ref({});
const searchValue = ref("");
const columns = ref(getBudgetItemsTableColumns());

onMounted(() => {
  loadLazyData();
});

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

  // params.append("entity_type", props.relatedEntity);
  // params.append("entity_id", props.relatedEntityId);

  getBudgetItems(props.projectId, params).then((response) => {
    budgetItems.value = response.budgetItems;
    totalRecords.value = response.totalRecords;
  });
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

// // first sidebar
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
