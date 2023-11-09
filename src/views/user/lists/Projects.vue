<template>
    <WMListSubHeader :filterLabels="filterLabels" :defaultOption="filterLabels[1]" entity="project" @new="displayNewForm">
    </WMListSubHeader>
    <Sidebar v-model:visible="isDetailsVisible" class="details-sidebar w-6" :showCloseIcon="false"
             :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''">
        <h2>{{ projectDetail.name }}</h2>
        <Divider />
        <!-- <WMCustomersTable :contact="projectDetail" :columns="customerColumns" :showControls="false" :rows="5" /> -->
    </Sidebar>
    <WMNewEntitySidebar name="newProject" entity="project" />
    <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
        <DataTable lazy v-model:selection="selectedProjects" :value="projects" dataKey="project_id"
                   v-model:expandedRows="expandedRows" tableStyle="min-width: 50rem" class="p-datatable-sm" paginator
                   scrollable scrollHeight="flex" :rows="rows" :first="0" ref="dt" :totalRecords="totalRecords"
                   :loading="loading" @page="onPage($event)" @update:selection="onSelectionChanged">
            <Column expander style="width: 45px"/>
            <Column style="width: 40px" selectionMode="multiple"></Column>
            <Column field="project_number" header="מס’ פרויקט" class="link-col">
                <template #body="slotProps">
                    <router-link :to="{ name: 'projectDetail', params: { 'id': slotProps.data.project_id } }"
                                 class="vertical-align-middle">{{ slotProps.data.project_number }}</router-link>
                </template>
            </Column>
            <Column field="project_name" header="שם פרויקט" />
            <Column field="city_data" header="מידע עירוני" />
            <Column field="address" header="כתובת" />
            <Column field="project_type" header="סוג פרויקט" />
            <Column field="project_area" header="תחום" />
            <Column field="project_detail" header="תת-תחום" />
            <Column field="open_tasks" header="משימות פתוחות" />
            <Column field="breached_tasks" header="משימות בחריגה" />
            <Column field="stage" header="שלב" />
            <Column field="status" header="סטטוס" />
            <template #expansion="slotProps">
                <DataTable :value="subProjects">
                    <Column style="width: 45px"></Column>
                    <Column style="width: 40px" selectionMode="multiple"></Column>
                    <Column field="project_number" class="link-col">
                        <template #body="slotProps">
                            <router-link :to="{ name: 'projectDetail', params: { 'id': slotProps.data.project_id } }"
                                         class="vertical-align-middle">{{ slotProps.data.project_number }}</router-link>
                        </template>
                    </Column>
                    <Column field="project_name" />
                    <Column field="city_data"  />
                    <Column field="address"  />
                    <Column field="project_type" />
                    <Column field="project_area"  />
                    <Column field="project_detail"  />
                    <Column field="open_tasks"  />
                    <Column field="breached_tasks"  />
                    <Column field="stage"  />
                    <Column field="status"  />
                </DataTable>
            </template>


            <!--<Column field="customer" header="לקוח" class="link-col">
                <template #body="slotProps">
                    <router-link :to="{ name: 'customerDetail', params: { 'id': slotProps.data.customer_id } }"
                                 class="vertical-align-middle">{{ slotProps.data.customer }}</router-link>
                </template>
            </Column>
            <Column field="telephone" header="טלפון נייד"></Column>
            <Column field="landline" header="טלפון נייח"></Column>
            <Column field="email" header="דוא”ל"></Column>
            <Column field="address" header="כתובת"></Column>
            <Column field="open_services" header="תהליכים פתוחים" class="numeric">
            </Column>
            <Column field="breached_services" header="תהליכים בחריגה" class="numeric">
                <template #body="slotProps">
                    <div :class="highlightCellClass(slotProps.data.breached_services)">
                        {{ slotProps.data.breached_services }}
                    </div>
                </template>
            </Column>
            <Column field="open_tasks" header="תהליכים בחריגה" class="numeric"></Column>
            <Column field="breached_tasks" header="משימות בחריגה" class="numeric">
                <template #body="slotProps">
                    <div :class="highlightCellClass(slotProps.data.breached_tasks)">
                        {{ slotProps.data.breached_tasks }}
                    </div>
                </template>
            </Column>
            <Column field="contact_id" header="מזהה"></Column>
            <Column field="status" header="סטטוס"></Column>
            <Column field="owner" header="אחראי"></Column> -->
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { ProjectsService } from '@/service/ProjectsService';
import { ContactsService } from '@/service/ContactsService';
import { ServicesService } from '@/service/ServicesService';
import { TasksService } from '@/service/TasksService';
import { useUtilsStore } from '@/stores/utils';
import { useFormUtilsStore } from '@/stores/formUtils';
import { useListUtilsStore } from '@/stores/listUtils';
import WMCustomersTable from '@/components/tables/WMCustomersTable.vue';
import WMListSubHeader from '@/components/layout/WMListSubHeader.vue';
import WMNewEntitySidebar from '@/components/layout/WMNewEntitySidebar.vue';
import { useLayout } from '@/layout/composables/layout';
const { layoutConfig } = useLayout();

onMounted(() => {
    utilsStore.entity = "project"

    loadLazyData();

    // ServicesService.getServicesMini().then((data) => (services.value = data));
    // TasksService.getTasksMini().then((data) => (tasks.value = data));
});

const formUtilsStore = useFormUtilsStore();
const listUtilsStore = useListUtilsStore();
const utilsStore = useUtilsStore();

//Pagination and table content
const totalRecords = ref(0);
const lazyParams = ref({});
const projects = ref();
const subProjects = ref();
const expandedRows = ref([]);
const services = ref();
const tasks = ref();
const loading = ref(false);
const dt = ref();

const loadLazyData = () => {
    loading.value = true;

    ProjectsService.getProjectList(
        // { page: lazyParams.value.page + 1, per_page: listUtilsStore.rows }
    )
        .then((result) => {
            console.log(result);
            projects.value = result.data;
            subProjects.value = result.data.slice(0, 5);
            totalRecords.value = result.totalRecords;
            loading.value = false;
        });
};

const onPage = (event) => {
    lazyParams.value = event;
    loadLazyData();
};

//Display sidebars
// const customerColumns = ref(listUtilsStore.getCustomerDetailColumns);
// const contactDetail = ref(null);
// const displayDetails = (data) => {
//     contactDetail.value = data;
//     isDetailsVisible.value = true;
// }

// const isDetailsVisible = ref(false);
// const displayNewForm = () => {
//     formUtilsStore.expandSidebar = 'newContact';
// }

//Move to Store
// const highlightCellClass = (data) => {
//     return [{ 'bg-red-100 text-red-600': data > 0 }];
// };

const filterLabels = [
    { name: 'כל הלקוחות', value: 2 },
    { name: 'הלקוחות שלי', value: 1 },
]

//Manage selected rows
const selectedProjects = ref([]);
utilsStore.resetElements();
const onSelectionChanged = () => {
    utilsStore.selectedElements['contact'] = selectedProjects.value;
};

//Number of rows per page
const rows = computed(() => {
    return listUtilsStore.rows;
});

watch(() => listUtilsStore.rows, () => {
    loadLazyData();
});

</script>

<style scoped lang="scss"></style>