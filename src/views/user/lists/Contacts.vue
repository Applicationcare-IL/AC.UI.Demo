<template>
    <WMListSubHeader :activeButtons="isAnyRowSelected" :filterLabels="filterLabels" :defaultOption="filterLabels[1]" entity="contact">
    </WMListSubHeader>
    <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
        <DataTable v-model:selection="selectedContacts" :value="contacts" dataKey="contact_id" tableStyle="min-width: 50rem"
                   class="p-datatable-sm" scrollable scrollHeight="flex">
            <Column style="width: 35px">
                <template #body="slotProps">
                    <img src="/icons/eye.svg" alt="" class="vertical-align-middle">
                </template>
            </Column>
            <Column style="width: 40px" selectionMode="multiple"></Column>
            <Column field="contact" header="איש קשר">
                <template #body="slotProps">
                    <router-link :to="{name:'contactDetail', params : {'id': slotProps.data.contact_id}}" class="vertical-align-middle">{{ slotProps.data.contact }}</router-link>
                </template>
            </Column>
            <Column field="customer" header="לקוח">
                <template #body="slotProps">
                    <router-link :to="{name:'customerDetail', params : {'id': slotProps.data.customer_id}}" class="vertical-align-middle">{{ slotProps.data.customer }}</router-link>
                </template>
            </Column>
            <Column field="telephone" header="טלפון נייד"></Column>
            <Column field="landline" header="טלפון נייח"></Column>
            <Column field="email" header="דוא”ל"></Column>
            <Column field="address" header="כתובת"></Column>
            <Column field="open_processes" header="תהליכים פתוחים" class="numeric">
            </Column>
            <Column field="exception_processes" header="תהליכים בחריגה" class="numeric">
                <template #body="slotProps">
                    <div :class="highlightCellClass(slotProps.data.exception_processes)">
                        {{ slotProps.data.exception_processes }}
                    </div>
                </template>
            </Column>
            <Column field="open_tasks" header="תהליכים בחריגה" class="numeric"></Column>
            <Column field="exception_tasks" header="משימות בחריגה" class="numeric">
                <template #body="slotProps">
                    <div :class="highlightCellClass(slotProps.data.exception_tasks)">
                        {{ slotProps.data.exception_tasks }}
                    </div>
                </template>
            </Column>
            <Column field="contact_id" header="מזהה"></Column>
            <Column field="status" header="סטטוס"></Column>
            <Column field="owner" header="אחראי"></Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { ContactsService } from '@/service/ContactsService';
import WMListSubHeader from '@/components/layout/WMListSubHeader.vue';

onMounted(() => {
    ContactsService.getContacts().then((data) => (contacts.value = data));
});

const contacts = ref();
const selectedContacts = ref([]);

const isAnyRowSelected = computed(() => {
    return selectedContacts?.value.length > 0;
});

const metaKey = ref(true);


const highlightCellClass = (data) => {
    return [{ 'bg-red-100 text-red-600': data > 0 }];
};

const filterLabels = [
    { name: 'כל אנשי הקשר', value: 2 },
    { name: 'אנשי הקשר שלי', value: 1 },
]

</script>

<style scoped lang="scss"></style>