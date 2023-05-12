<template>
    <div class="wm-subheader shadow-1 flex-none">
        <div class="flex flex-column gap-5">
            <div class="flex flex-row justify-content-between flex-wrap row-gap-4">
                <div class="flex flex-row flex-wrap">
                    <WMButton class="m-1 col-6" name="new" icon="new" @click="$router.push('new-' + props.entity)">חדש</WMButton>
                    <WMButton class="m-1 col-6" name="export-white" icon="export">ייצוא נתונים</WMButton>
                    <Divider layout="vertical" />
                    <WMButton class="m-1 col-6" name="assign-white" icon="assign" :disabled="!actveButtons">הקצה
                    </WMButton>
                    <WMButtonMenu class="m-1" mode="light" :menuItems="menuItems" :disabled="!actveButtons">הודעה
                    </WMButtonMenu>
                    <WMButton class="m-1 col-6" name="phone-white" icon="phone" :disabled="!actveButtons">הקצה
                    </WMButton>
                    <WMButton class="m-1 col-6" name="mail-white" icon="mail" :disabled="!actveButtons">הקצה</WMButton>
                    <Divider layout="vertical" />
                    <WMButton class="m-1 col-6 " name="basic-secondary">כפתור </WMButton>
                </div>
                <div class="flex flex-row align-items-center gap-3">
                    <WMButton name="filter" icon="filter" :open="isFilterOpen" :applied="isFilterApplied">הקצה
                    </WMButton>
                    <SelectButton v-model="selectedOption" :options="filterLabels" optionLabel="name" class="flex flex-nowrap" />
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
</template>

<script setup>

import { ref } from 'vue';
const menuItems = [
    { label: 'Whatsapp', value: 'option1' },
    { label: 'SMS', value: 'option2' },
]

const searchValue = ref('');

const props = defineProps({
    activeButtons: Boolean,
    filterLabels: Array,
    defaultOption: Object,
    entity: String,
});
const value = ref();

const isFilterOpen = ref(false);
const isFilterApplied = ref(false);
const selectedOption = props.defaultOption;



</script>