<template>
    <div class="wm-subheader shadow-1 flex-none">
        <div class="flex flex-column gap-5">
            <div class="flex flex-row justify-content-between flex-wrap row-gap-4">
                <div class="flex flex-row flex-wrap gap-2 align-items-center">
                    <WMButton @click="formStore.save" name="save" icon="save" type="specialSave" iconPosition="left">
                        {{ $t('save') }}</WMButton>
                    <Divider layout="vertical" />
                    <WMButton class="m-1 col-6" name="assign-white" icon="assign">הקצה
                    </WMButton>
                    <WMButtonMenu class="m-1" mode="light" :menuItems="menuItems">הודעה
                    </WMButtonMenu>
                    <WMButton class="m-1 col-6" name="phone-white" icon="phone">הקצה
                    </WMButton>
                    <WMButton class="m-1 col-6" name="mail-white" icon="mail">הקצה</WMButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { useFormUtilsStore } from '@/stores/formUtils';
import { computed } from 'vue';

const formStore = useFormUtilsStore();

const menuItems = [
    { label: 'Whatsapp', value: 'option1' },
    { label: 'SMS', value: 'option2' },
]

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