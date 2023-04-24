<template>
    <div class="wm-subheader shadow-1 flex-none">
        <div class="flex flex-column gap-5">
            <div class="flex flex-row justify-content-between flex-wrap row-gap-4">
                <div class="flex flex-row flex-wrap">
                    <WMButton class="m-1 col-6" name="new" icon="new">חדש</WMButton>
                    <WMButton class="m-1 col-6" name="export-white" icon="export">ייצוא נתונים</WMButton>
                    <Divider layout="vertical" />
                    <WMButton class="m-1 col-6" name="assign-white" icon="assign" :disabled="!isAnyRowSelected">הקצה
                    </WMButton>
                    <WMButton class="m-1 col-6" name="done-white" icon="done" :disabled="!isAnyRowSelected">הקצה
                    </WMButton>
                    <WMButton class="m-1 col-6" name="phone-white" icon="phone" :disabled="!isAnyRowSelected">הקצה
                    </WMButton>
                    <WMButton class="m-1 col-6" name="mail-white" icon="mail" :disabled="!isAnyRowSelected">הקצה</WMButton>
                    <Divider layout="vertical" />
                    <WMButton class="m-1 col-6 " name="basic-secondary">כפתור  דינאמי </WMButton>
                </div>
                <div class="flex flex-row">
                    <WMButton class="m-1 col-6" name="filter" icon="filter">חדש</WMButton>
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
        <DataTable v-model:selection="selectedTasks" :rowClass="rowClass" :value="tasks" dataKey="task_number"
                   tableStyle="min-width: 50rem"
                   class="p-datatable-sm" scrollable scrollHeight="flex" paginator :rows="15">
            <Column style="width: 35px">
                <template #body="slotProps">
                    <img src="/icons/eye.svg" alt="" class="vertical-align-middle">
                </template>
            </Column>
            <Column style="width: 40px" selectionMode="multiple"></Column>
            <Column field="task_number" header="מס’ משימה">
                <template #body="slotProps">
                    <router-link to="/foo" class="vertical-align-middle">{{ slotProps.data.task_number }}</router-link>
                </template>
            </Column>
            <Column field="process_number" header="מס’ תהליך">
                <template #body="slotProps">
                    <router-link to="/foo" class="vertical-align-middle">{{ slotProps.data.process_number }}</router-link>
                </template>
            </Column>

            <Column field="task_type" header="סוג משימה"></Column>
            <Column field="family" header="משפחה"></Column>
            <Column field="contact" header="איש קשר">
                <template #body="slotProps">
                    <router-link to="/foo" class="vertical-align-middle">{{ slotProps.data.contact }}</router-link>
                </template>
            </Column>
            <Column field="status" header="סטטוס"></Column>
            <Column field="due_date" header="תאריך יעד"></Column>
            <Column field="SLA" header="SLA" class="sla">
                <template #body="slotProps">
                    <div :class="slaClass(slotProps.data)">
                        {{ slotProps.data.SLA }}
                    </div>
                </template>
            </Column>
            <Column field="in_charge" header="אחראי">
                <template #body="slotProps">
                    <router-link to="/foo" class="vertical-align-middle">{{ slotProps.data.in_charge }}</router-link>
                </template>
            </Column>
            <Column field="customer" header="לקוח">
                <template #body="slotProps">
                    <router-link to="/foo" class="vertical-align-middle">{{ slotProps.data.customer }}</router-link>
                </template>
            </Column>
            <Column field="call" header="נקרא"></Column>
            <Column field="open_date" header="נפתח"></Column>
            <Column field="close_date" header="נסגר"></Column>
            <Column field="last_change" header="שינוי אחרון"></Column>
            <Column field="remarks" header="הערות"></Column>

        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { TasksService } from '@/service/TasksService';

onMounted(() => {
    TasksService.getTasks().then((data) => (tasks.value = data));
});

const tasks = ref();
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

const rowClass = (data) => {
    console.log(data.is_open);
    return [{ 'inactive_row': !data.is_open }];
};

const slaClass = (data) => {
    return [
        
        {
            'bg-teal-200 text-teal-900': data.SLA === '10 ימים',
            'bg-yellow-100 text-gray-900': data.SLA === '2 ימים',
            'bg-red-100 text-red-600 ': data.SLA === '3 ימים',
            'text-teal-900': data.SLA === 'עמד ביעד',
            'text-red-600': data.SLA === 'הסתיים בחריגה',
        }
    ];
};

</script>

<style scoped lang="scss"></style>                  