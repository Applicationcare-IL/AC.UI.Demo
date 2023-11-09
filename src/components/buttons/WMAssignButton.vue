<template>
    <WMButton @click="toggle" class="m-1 col-6" name="assign-white" icon="assign"
              :disabled="selectedElements==0">הקצה
    </WMButton>
    <OverlayPanel ref="isOpen" :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''">
        <div class="flex flex-column gap-2">
            <span>לקוחות נבחרים:</span>
            <div class="flex flex-row gap-2">
                <Chip v-for="item in utilsStore.selectedElements[props.entity]?.slice(0, 3)"> {{ item.name }}</Chip>
                <div v-if="utilsStore.selectedElements[props.entity]?.length > 3">And {{
                    utilsStore.selectedElements[props.entity]?.length - 3 }} more</div>
            </div>
            <span>הקצה ל:</span>
            <div class="flex flex-row gap-2">
                <WMButton @click="onAssignTo('employee')" class="m-1 col-6" :class="{ 'selected': assignTo == 'employee' }"
                          name="basic-secondary"> משתמש</WMButton>
                <WMButton @click="onAssignTo('team')" class="m-1 col-6" :class="{ 'selected': assignTo == 'team' }"
                          name="basic-secondary"> צוות</WMButton>
            </div>

            <WMInputSearch name="employeeOrTeam" :placeholder="$t('select', ['employee'])" type="input-search" :multiple="false" @change="ownerChanged"
                           width="248" :options="owners" :searchFunction="searchOwner" :modelValue="selectedOwner" :selectedOption="selectedOwner"/>

            <WMButton @click="assignOwner" class="m-1 col-6" name="basic-secondary">הקצה </WMButton>

        </div>
    </OverlayPanel>
</template>

<script setup>

import { ref, onMounted, watch } from 'vue';
import { useUtilsStore } from '@/stores/utils';
import { useLayout } from '@/layout/composables/layout';
import { OwnersService } from '@/service/OwnersService';
import WMInputSearch from '@/components/forms/WMInputSearch.vue';
import { useToast } from '@/stores/toast';

const props = defineProps({
    entity: {
        type: String,
        default: ''
    },
});

const ownerChanged = (event) => {
    selectedOwner.value = event.value;
}

const utilsStore = useUtilsStore();
const { layoutConfig } = useLayout();

const isOpen = ref();
const toggle = (event) => {
    isOpen.value.toggle(event);
}

const assignTo = ref('employee');

const onAssignTo = (type) => {
    assignTo.value = type;
}

const toast = useToast();

const owners = ref([{}]);
const selectedOwner = ref();

const selectedElements = ref(0);
watch(() => utilsStore.selectedElements[props.entity], (value) => {
    selectedElements.value = value.length
});

const searchOwner = (query) => {
  return OwnersService.getOwnersFromApi({ search: query }, assignTo.value);
}

const assignOwner = () => {
    console.log(selectedOwner.value);
    OwnersService.assignTo(utilsStore.selectedElements[props.entity],props.entity, selectedOwner.value.id, assignTo.value).then((data) => {
        isOpen.value.hide();
        toast.successAction('owner', 'assigned');
    })
}

</script>

<style scoped>
.selected {
    background-color: #007ad9;
    color: white;
}
</style>

