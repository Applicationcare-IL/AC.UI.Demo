<template>
    <div class="flex flex-row flex-wrap gap-4">
        <ConfirmDialog :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"></ConfirmDialog>
        <WMButton @click="formStore.save" name="save" icon="save" type="specialSave" iconPosition="left">שמירה
        </WMButton>
        <WMButton @click="formStore.cancel" name="cancel" icon="cancel" iconPosition="left">ביטול</WMButton>
    </div>
</template>


<script setup>

import { useFormUtilsStore } from '@/stores/formUtils';
import { useLayout } from '@/layout/composables/layout';

const { layoutConfig } = useLayout();

const formStore = useFormUtilsStore();

const props = defineProps({
    activeButtons: Boolean,
    filterLabels: Array,
    defaultOption: Object,
    entity: String,
});

</script>