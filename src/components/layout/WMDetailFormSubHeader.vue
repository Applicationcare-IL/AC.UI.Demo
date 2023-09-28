<template>
    <div class="wm-subheader shadow-1 flex-none">
        <div class="flex flex-column gap-5">
            <div class="flex flex-row justify-content-between flex-wrap row-gap-4">
                <div class="flex flex-row flex-wrap gap-2 align-items-center">
                    <WMButton @click="formStore.save" name="save" icon="save" type="specialSave" iconPosition="left">
                        {{ $t('save') }}</WMButton>
                    <Divider layout="vertical" />
                    <WMAssignButton :entity="utilsStore.entity"/>
                    <WMButtonMenu class="m-1" mode="light" :menuItems="menuItems" disabled>הודעה
                    </WMButtonMenu>
                    <WMButton class="m-1 col-6" name="phone-white" icon="phone" disabled>הקצה
                    </WMButton>
                    <WMButton class="m-1 col-6" name="mail-white" icon="mail" disabled>הקצה</WMButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { useFormUtilsStore } from '@/stores/formUtils';
import { useUtilsStore } from '@/stores/utils';
import WMAssignButton from '@/components/buttons/WMAssignButton.vue';


const formStore = useFormUtilsStore();
const utilsStore = useUtilsStore();

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
</script>