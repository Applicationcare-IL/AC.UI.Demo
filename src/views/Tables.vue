
<template>
    <div class="wm-subheader shadow-1">
        <div class="flex flex-column gap-5">
            <div class="flex flex-row justify-content-between">
                <div class="flex flex-row">
                    <WMButton class="m-1 col-6" name="new" icon="new">חדש</WMButton>
                    <WMButton class="m-1 col-6" name="export-white" icon="export">ייצוא נתונים</WMButton>
                    <Divider layout="vertical" />
                    <WMButton class="m-1 col-6" name="assign-white" icon="assign">הקצה</WMButton>
                    <WMButton class="m-1 col-6" name="assign-white" icon="assign">הקצה</WMButton>
                    <WMButton class="m-1 col-6" name="phone-white" icon="phone">הקצה</WMButton>
                    <WMButton class="m-1 col-6" name="mail-white" icon="mail">הקצה</WMButton>
                    <Divider layout="vertical" />
                    <WMButton class="m-1 col-6 " name="basic-secondary" >כפתור </WMButton>
                </div>
                <div class="flex flex-row">
                    <WMButton class="m-1 col-6" name="filter-white" icon="filter">חדש</WMButton>
                    
                        <SelectButton v-model="value" :options="options" optionLabel="name" class="flex-nowrap" />
                    
                </div>

            </div>
            <div class="">
                <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText class="w-30rem" v-model="value1" placeholder="Search" />
                </span>

            </div>
        </div>
    </div>
    <div class="table-container mt-5 mx-8">
        <DataTable v-model:selection="selectedCustomer" :value="customers" dataKey="id" tableStyle="min-width: 50rem"
                   class="p-datatable-sm">
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column field="telephone" header="מס’ לקוח"></Column>
            <Column field="name" header="שם לקוח"></Column>
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
            <Column field="in_charge" header="אחראי"></Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { CustomerService } from '@/service/CustomerService';

onMounted(() => {
    CustomerService.getCustomers().then((data) => (customers.value = data));
});

const customers = ref();
const selectedCustomer = ref();
const metaKey = ref(true);

const value = ref(null);
const options = ref([
                 { name: 'כל אנשי הקשר', value: 2 },
                { name: 'אנשי הקשר שלי', value: 1 },
            ]);

</script>

<style scoped lang="scss">

.wm-subheader {
    padding: 18px 48px;
}
:deep(.p-datatable) {
    direction: rtl;
}

:deep(th),
:deep(td) {
    white-space: nowrap;
}

:deep(.p-datatable-wrapper) {
    border-radius: 14px;
}

:deep(.p-datatable .p-datatable-tbody > tr.p-highlight) {
    background: #2196F3;
    color: #ffffff;
}

:deep(.p-datatable .p-datatable-tbody > tr.p-highlight > td) {
    background: #2196F3;
    color: #ffffff;
    ;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
    background-color: #F5F5F5;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
    border: solid 2px white;
    // background-color: #F5F5F5;
    padding: 12px;
    text-align: right;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
    border: solid 2px white;
    background-color: #E9EEF2;
    padding: 7px 12px;
    font-size: 16px;
    ;
}

// Code to allow the table to have round borders.
// TODO: for LTR the borders are scrambled. Should have some conditional styles for this

:deep(.p-datatable .p-datatable-thead > tr> th) {
    border-top: none;
}

:deep(.p-datatable .p-datatable-tbody tr > td:last-child) {
    border-left: none;
}

:deep(.p-datatable .p-datatable-thead > tr > th:last-child) {
    border-left: none;
}


:deep(.p-datatable .p-datatable-tbody tr > td:first-child) {
    border-right: none;
}

:deep(.p-datatable .p-datatable-thead > tr > th:first-child) {
    border-right: none;
}


:deep(.p-buttonset .p-button:first-of-type){
    border-radius: 0 20px 20px 0;
}
:deep(.p-buttonset .p-button:last-of-type){
    border-radius:  20px 0 0 20px ;
}

:deep(.p-buttonset .p-button.p-highlight){
    background-color: var(--blue-50);
    font-weight: 700;
    color: var(--blue-300);
}

:deep(.p-buttonset .p-button){
    color: var(--blue-300);
    border-color:  var(--blue-300);
}

</style>