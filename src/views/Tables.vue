<template>
  <div class="wm-subheader shadow-1 flex-none">
    <div class="flex flex-column gap-5">
      <div class="flex flex-row justify-content-between flex-wrap row-gap-4">
        <div class="flex flex-row flex-wrap">
          <WMButton class="m-1 col-6" name="new" icon="new">חדש</WMButton>
          <WMButton class="m-1 col-6" name="export-white" icon="export"
            >ייצוא נתונים</WMButton
          >
          <Divider layout="vertical" />
          <WMButton
            class="m-1 col-6"
            name="assign-white"
            icon="assign"
            :disabled="!isAnyRowSelected"
            >הקצה</WMButton
          >
          <WMButton
            class="m-1 col-6"
            name="assign-white"
            icon="assign"
            :disabled="!isAnyRowSelected"
            >הקצה</WMButton
          >
          <WMButton
            class="m-1 col-6"
            name="phone-white"
            icon="phone"
            :disabled="!isAnyRowSelected"
            >הקצה</WMButton
          >
          <WMButton
            class="m-1 col-6"
            name="mail-white"
            icon="mail"
            :disabled="!isAnyRowSelected"
            >הקצה</WMButton
          >
          <Divider layout="vertical" />
          <WMButton class="m-1 col-6" name="basic-secondary">כפתור </WMButton>
        </div>
        <div class="flex flex-row">
          <WMButton class="m-1 col-6" name="filter-white" icon="filter">חדש</WMButton>
          <SelectButton
            v-model="value"
            :options="options"
            optionLabel="name"
            class="flex flex-nowrap"
          />
        </div>
      </div>
      <div class="">
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText class="w-30rem" v-model="searchValue" placeholder="Search" />
        </span>
      </div>
    </div>
  </div>
  <div class="table-container mt-5 mx-8 flex-auto overflow-auto">
    <DataTable
      v-model:selection="selectedCustomers"
      :value="customers"
      dataKey="id"
      tableStyle="min-width: 50rem"
      class="p-datatable-sm"
      scrollable
      scrollHeight="flex"
    >
      <Column style="width: 35px">
        <template #body="slotProps">
          <img src="/icons/eye.svg" alt="" class="vertical-align-middle" />
        </template>
      </Column>
      <Column style="width: 40px" selectionMode="multiple"></Column>
      <Column field="telephone" header="מס’ לקוח"></Column>
      <Column field="name" :header="$t('customer_name')" />
      <Column field="type" header="סוג"></Column>
      <Column field="selected_product" header="איש קשר ראשי"></Column>
      <Column field="status" header="סטטוס"></Column>
      <Column field="address" header="כתובת"></Column>
      <Column field="open_processes" header="תהליכים פתוחים"></Column>
      <Column field="open_tasks" header="תהליכים בחריגה"></Column>
      <Column field="exception_tasks" header="משימות פתוחות"></Column>
      <Column field="rating" header="משימות בחריגה"></Column>
      <Column field="domain" header="דירוג"></Column>
      <Column field="status" header="תחום"></Column>
      <Column field="id" header="מזהה"></Column>
      <Column field="owner" header="אחראי"></Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

onMounted(() => {});

const customers = ref();
const selectedCustomers = ref([]);

const isAnyRowSelected = computed(() => {
  return selectedCustomers?.value.length > 0;
});

const isAnySelected = ref(false);
const metaKey = ref(true);

const value = ref(null);
const options = ref([
  { name: "כל אנשי הקשר", value: 2 },
  { name: "אנשי הקשר שלי", value: 1 },
]);

const searchValue = ref("");
</script>

<style scoped lang="scss"></style>
