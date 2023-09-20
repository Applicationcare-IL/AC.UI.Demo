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
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLayout } from '@/layout/composables/layout';

const { layoutConfig } = useLayout();

const router = useRouter();
const formStore = useFormUtilsStore();

const props = defineProps({
    activeButtons: Boolean,
    filterLabels: Array,
    defaultOption: Object,
    entity: String,
});

const hasErrors = computed(() => {
    return Object.keys(formStore.formErrors).length > 0;
});

</script>