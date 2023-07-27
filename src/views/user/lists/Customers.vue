<template>
    <WMListSubHeader :activeButtons="isAnyRowSelected" :filterLabels="filterLabels" :defaultOption="filterLabels[1]" entity="customer">
    </WMListSubHeader>
    <div class="table-container mt-5 mx-8 flex-auto overflow-auto">
        <DataTable v-model:selection="selectedCustomers" :value="customers" dataKey="id" tableStyle="min-width: 50rem"
                   class="p-datatable-sm" scrollable scrollHeight="flex" paginator :rows="15">
            <Column style="width: 35px">
                <template #body="slotProps">
                    <img src="/icons/eye.svg" alt="" class="vertical-align-middle">
                </template>
            </Column>
            <Column style="width: 40px" selectionMode="multiple"></Column>

            <Column field="telephone" header="מס’ לקוח">
                <template #body="slotProps">
                    <router-link to="/foo" class="vertical-align-middle">{{ slotProps.data.telephone }}</router-link>
                </template>
            </Column>

            <Column field="name" header="שם לקוח"></Column>
            <Column field="type" header="סוג"></Column>
            <Column field="selected_product" header="איש קשר ראשי">
                <template #body="slotProps">
                    <router-link to="/foo" class="vertical-align-middle">{{ slotProps.data.selected_product }}</router-link>
                </template>
            </Column>
            <Column field="status" header="סטטוס" ></Column>
            <Column field="address" header="כתובת"></Column>
            <Column field="open_processes" header="תהליכים פתוחים" class="numeric"></Column>
            <Column field="open_tasks" header="תהליכים בחריגה" class="numeric"></Column>
            <Column field="exception_tasks" header="משימות פתוחות" class="numeric"></Column>
            <Column field="rating" header="משימות בחריגה"></Column>
            <Column field="domain" header="דירוג"></Column>
            <Column field="status" header="תחום"></Column>
            <Column field="id" header="מזהה"></Column>
            <Column field="owner" header="אחראי"></Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { CustomerService } from '@/service/CustomerService';
import WMListSubHeader from '@/components/layout/WMListSubHeader.vue';

onMounted(() => {
    CustomerService.getCustomers().then((data) => (customers.value = data));
});

const customers = ref();
const selectedCustomers = ref([]);

const isAnyRowSelected = computed(() => {
    return selectedCustomers?.value.length > 0;
});

const metaKey = ref(true);

const value = ref(null);
const options = ref([
    { name: 'כל אנשי הקשר', value: 2 },
    { name: 'אנשי הקשר שלי', value: 1 },
]);

const searchValue = ref('');

const menuItems = [
    { label: 'Whatsapp', value: 'option1' },
    { label: 'SMS', value: 'option2' },
]

const filterLabels = [
    { name: 'כל הלקוחות', value: 2 },
    { name: 'הלקוחות שלי', value: 1 },
]


</script>

<style scoped lang="scss"></style>