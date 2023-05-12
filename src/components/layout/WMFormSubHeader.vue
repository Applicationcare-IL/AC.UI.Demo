<template>
    <div class="wm-subheader shadow-1 flex-none">
        <div class="flex flex-column gap-5">
            <div class="flex flex-row justify-content-between flex-wrap row-gap-4">
                <div class="flex flex-row flex-wrap gap-4">
                    <WMButton @click="formStore.submit" name="save" icon="save" type="specialSave" iconPosition="left"
                    >שמירה</WMButton>
                    <WMButton name="cancel" icon="cancel" iconPosition="left">ביטול</WMButton>
                </div>
                <div class="flex flex-row align-items-center gap-3">
                    Fullscreen
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { useFormUtilsStore } from '@/stores/formUtils';
import {computed} from 'vue';

 const formStore = useFormUtilsStore();

const props = defineProps({
    actveButtons: Boolean,
    filterLabels: Array,
    defaultOption: Object,
    entity: String,
});

const hasErrors = computed(() => {
    return Object.keys(formStore.formErrors).length > 0;
});



</script>