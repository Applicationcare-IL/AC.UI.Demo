<template>
    <div class="wm-subheader shadow-1 flex-none">
        <div class="flex flex-column gap-5">
            <div class="flex flex-row justify-content-between flex-wrap row-gap-4">
                <div class="flex flex-row flex-wrap">
                    <WMButton class="m-1 col-6" name="new" icon="new" >חדש</WMButton>
                    <WMButton class="m-1 col-6" name="export-white" icon="export">ייצוא נתונים</WMButton>
                    <Divider layout="vertical" />
                    <WMButton class="m-1 col-6" name="assign-white" icon="assign" :disabled="!isAnyRowSelected">הקצה</WMButton>
                    <WMButton class="m-1 col-6" name="assign-white" icon="assign" :disabled="!isAnyRowSelected">הקצה</WMButton>
                    <WMButton class="m-1 col-6" name="phone-white" icon="phone" :disabled="!isAnyRowSelected">הקצה</WMButton>
                    <WMButton class="m-1 col-6" name="mail-white" icon="mail" :disabled="!isAnyRowSelected">הקצה</WMButton>
                    <Divider layout="vertical" />
                    <WMButton class="m-1 col-6 " name="basic-secondary">כפתור </WMButton>
                </div>
                <div class="flex flex-row">
                    <WMButton class="m-1 col-6" name="filter-white" icon="filter">חדש</WMButton>
                    <SelectButton v-model="value" :options="options" optionLabel="name" class="flex flex-nowrap" />
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
        <DataTable v-model:selection="selectedContacts" :value="contacts" dataKey="contact_id" tableStyle="min-width: 50rem"
                   class="p-datatable-sm" scrollable scrollHeight="flex">
            <Column style="width: 35px">
                <template #body="slotProps">
                        <img src="/icons/eye.svg" alt="" class="vertical-align-middle">
                </template> 
            </Column>
            <Column style="width: 40px" selectionMode="multiple" ></Column>
            <Column field="contact" header="איש קשר">
                <template #body="slotProps">
                    <router-link to="/foo" class="vertical-align-middle">{{ slotProps.data.contact }}</router-link>
                </template>
            </Column>
            <Column field="customer" header="לקוח">
                <template #body="slotProps">
                    <router-link to="/foo" class="vertical-align-middle">{{ slotProps.data.customer }}</router-link>
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
            <Column field="in_charge" header="אחראי"></Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { ContactsService } from '@/service/ContactsService';

onMounted(() => {
    ContactsService.getContacts().then((data) => (contacts.value = data));
});

const contacts = ref();
const selectedContacts = ref([]);

const isAnyRowSelected = computed(() => {
  return selectedContacts?.value.length > 0;
});

const metaKey = ref(true);

const value = ref(null);
const options = ref([
    { name: 'כל אנשי הקשר', value: 2 },
    { name: 'אנשי הקשר שלי', value: 1 },
]);

const searchValue = ref('');

const highlightCellClass = (data) => {
    return [{'bg-red-100 text-red-600': data > 0}];
};

</script>

<style scoped lang="scss">


</style>