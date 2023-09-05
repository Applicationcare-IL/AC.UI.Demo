<template>
    <WMListSubHeader :activeButtons="isAnyRowSelected" :filterLabels="filterLabels" :defaultOption="filterLabels[1]"
                     entity="task">
    </WMListSubHeader>
    <div class="table-container mt-5 mx-8 flex-auto overflow-auto">
        <DataTable lazy v-model:selection="selectedTasks" :rowClass="rowClass" :value="tasks" dataKey="task_number"
                   tableStyle="min-width: 50rem" class="p-datatable-sm" scrollable scrollHeight="flex" paginator :rows="10"
                   :first="0" ref="dt" :totalRecords="totalRecords" :loading="loading" @page="onPage($event)">

            <Column style="width: 35px">
                <template #body="slotProps">
                    <img src="/icons/eye.svg" alt="" class="vertical-align-middle">
                </template>
            </Column>
            <Column style="width: 40px" selectionMode="multiple"></Column>
            <Column field="task_number" header="מס’ משימה">
                <template #body="slotProps">
                    <router-link :to="{ name: 'taskDetail', params: { 'id': slotProps.data.task_number } }"
                                 class="vertical-align-middle">{{ slotProps.data.task_number }}</router-link>
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
            <Column field="owner" header="אחראי">
                <template #body="slotProps">
                    <router-link to="/foo" class="vertical-align-middle">{{ slotProps.data.owner }}</router-link>
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
import WMListSubHeader from '@/components/layout/WMListSubHeader.vue';

onMounted(() => {
    loading.value = true;
    loadLazyData();
});

const loadLazyData = () => {
    TasksService.getTasksFromApi({ page: lazyParams.value.page + 1 }).then((data) => {
        console.log(data);
        tasks.value = data.tasks;
        totalRecords.value = data.totalRecords;
        loading.value = false;
    });
};

const onPage = (event) => {
    lazyParams.value = event;
    console.log(lazyParams)
    loadLazyData();
};

const dt = ref();
const loading = ref(false);
const totalRecords = ref(0);
const lazyParams = ref({});

const tasks = ref();
const selectedTasks = ref([]);

const isAnyRowSelected = computed(() => {
    return selectedTasks?.value.length > 0;
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

const menuItems = [
    { label: 'Whatsapp', value: 'option1' },
    { label: 'SMS', value: 'option2' },
]

const filterLabels = [
    { name: 'כל המשימות', value: 2 },
    { name: 'המשימות שלי', value: 1 },
]

</script>

<style scoped lang="scss"></style>                  