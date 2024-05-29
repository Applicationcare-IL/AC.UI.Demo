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
        @new-budget-item-created="handleNewBudgetItemCreated"
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
          >{{ $t("new") }}</WMButton
        >
      </div>
    </div>
  </div>
  <DataTable
    v-model:selection="selectedBudgetItems"
    v-model:editingRows="editingRows"
    data-key="id"
    lazy
    :value="budgetItems"
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
    @row-edit-cancel="onRowEditCancel"
  >
    <Column v-if="multiselect" style="width: 40px" selection-mode="multiple" />
    <Column :row-editor="true" :frozen="true" align-frozen="right"></Column>

    <template v-for="column in columns">
      <Column
        v-if="column.type == 'budget-item-link'"
        :key="column.name"
        :field="column.name"
        :header="getColumHeader(column)"
        :class="column.class"
      >
        <template #body="slotProps">
          <router-link
            :to="{
              name: 'projectBudgetItemDetail',
              params: { id: projectId, budgetItemId: slotProps.data.id },
            }"
            class="vertical-align-middle"
          >
            {{ slotProps.data.title }}
          </router-link>
        </template>
      </Column>

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

      <Column
        v-if="column.type == 'currency'"
        :key="column.name"
        :field="column.field"
        :header="getColumHeader(column)"
        :class="column.class"
      >
        <template #body="slotProps">
          <WMInputCurrency
            v-model="slotProps.data[column.field]"
            :read-only="true"
            :name="column.name"
          />
        </template>
        <template v-if="column.editable" #editor="{ data }">
          <WMInputCurrency
            v-model="data[column.field]"
            :name="column.field"
            :read-only="false"
          />
        </template>
      </Column>

      <Column
        v-if="column.type == 'budget-item'"
        :key="column.name"
        :field="column.field"
        :header="getColumHeader(column)"
        :class="column.class"
      >
        <template v-if="column.editable" #editor="{ data, field }">
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
        v-if="column.type == 'customer'"
        :key="column.name"
        :field="column.field"
        :header="getColumHeader(column)"
        :class="column.class"
      >
        <template #editor="{ data, field }">
          <Dropdown
            v-model="data[field]"
            :options="customers"
            option-label="name"
            option-value="id"
            placeholder="Select a customer"
          >
            <template #option="slotProps">
              {{ slotProps.option.name }}
            </template>
          </Dropdown>
        </template>
        <template #body="slotProps">
          {{ getCustomerName(slotProps.data[column.field]) }}
        </template>
      </Column>

      <Column
        v-if="column.type == 'status'"
        :key="column.name"
        :field="column.field"
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
                :value="slotProps.option[optionLabelWithLang]"
                :severity="getStatusLabel(slotProps.option.value)"
              />
            </template>
          </Dropdown>
        </template>
        <template #body="slotProps">
          <Tag
            :value="
              getStatus(slotProps.data[column.field])[optionLabelWithLang]
            "
            :severity="getStatusLabel(slotProps.data[column.field])"
          />
        </template>
      </Column>

      <Column
        v-if="column.type == 'calendar'"
        :key="column.name"
        :field="column.field"
        :header="getColumHeader(column)"
        :class="column.class"
      >
        <template #editor="{ data, field }">
          <Calendar v-model="data[field]" show-icon />
        </template>
        <template #body="slotProps">
          {{ formatDate(new Date(slotProps.data[column.field]), "DD/MM/YY") }}
          <i class="pi pi-calendar"></i>
        </template>
      </Column>

      <Column
        v-if="column.type == 'terms-of-payment'"
        :key="column.name"
        :field="column.field"
        :header="getColumHeader(column)"
        :class="column.class"
      >
        <template #editor="{ data, field }">
          <Dropdown
            v-model="data[field]"
            :options="termsOfPayment"
            :option-label="optionLabelWithLang"
            option-value="id"
            placeholder="Select an option"
          >
            <template #option="slotProps">
              {{ slotProps.option[optionLabelWithLang] }}
            </template>
          </Dropdown>
        </template>
        <template #body="slotProps">
          {{
            getTermOfPayment(slotProps.data[column.field])[optionLabelWithLang]
          }}
        </template>
      </Column>
    </template>
  </DataTable>
</template>

<script setup>
// IMPORTS
import { onMounted, ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";

// DEPENDENCIES
const {
  getBudgetItems,
  getBudgetItem,
  updateBudgetItem,
  parseUpdateBudgetItem,
} = useProjects();
const { t } = useI18n();
const { getBudgetItemsTableColumns } = useListUtils();
const toast = useToast();

// INJECT

// PROPS, EMITS
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

const emit = defineEmits(["new-budget-item-created", "budget-item-changed"]);

// REFS
const selectedBudgetItems = ref([]);
const budgetItems = ref([]);
const totalRecords = ref(0);
const lazyParams = ref({});
const searchValue = ref("");
const columns = ref(getBudgetItemsTableColumns());
const editingRows = ref([]);
const isVisible = ref(false);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = () => {
  // const filters = utilsStore.filters["task"];
  const nextPage = lazyParams.value.page + 1;
  const searchValueParam = searchValue.value;
  const selectedRowsPerPageParam = 10;

  const params = new URLSearchParams({
    page: nextPage ? nextPage : 1,
    per_page: selectedRowsPerPageParam,
    search: searchValueParam,
    project: props.projectId,
  });

  getBudgetItems(params).then((response) => {
    budgetItems.value = response.budgetItems;
    totalRecords.value = response.totalRecords;
  });
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
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

const getColumHeader = (column) => {
  return column.header ? t(column.header) : t(`budget.${column.name}`);
};

const validateForm = (obj) => {
  const requiredFields = ["unexpected"];

  for (const field of requiredFields) {
    if (!obj.hasOwnProperty(field) || obj[field] === "") {
      return false;
    }
  }

  return true;
};

const onRowEditSave = (event) => {
  let { newData, index } = event;
  const budgetItemId = newData.id;

  if (!validateForm(newData)) {
    toast.error("Please fill all the required fields");
    editingRows.value = [...editingRows.value, newData]; // keep the rows in edit mode
    return;
  }

  updateBudgetItem(
    props.projectId,
    budgetItemId,
    parseUpdateBudgetItem(newData)
  ).then(() => {
    getBudgetItem(props.projectId, budgetItemId).then((response) => {
      budgetItems.value[index] = response;
      emit("budget-item-changed");
      toast.successAction("budget item", "updated");
    });
  });
};

const handleNewBudgetItemCreated = () => {
  loadLazyData();
  emit("new-budget-item-created");
};

// PROVIDE, EXPOSE

// WATCHERS

watchEffect(() => {
  loadLazyData();
});

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  loadLazyData();
});
</script>
