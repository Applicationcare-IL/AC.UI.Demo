<template>
    <WMButton @click="toggle" class="m-1 col-6" name="assign-white" icon="assign"
              :disabled="utilsStore.selectedElements.length == 0">הקצה
    </WMButton>
    <OverlayPanel ref="isOpen" :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''" >
        <div class="flex flex-column gap-2">
            <span>לקוחות נבחרים:</span>
            <div class="flex flex-row gap-2">
                <Chip v-for="item in utilsStore.selectedElements.slice(0, 3)"> {{ item.name }}</Chip>
                <div>And {{ utilsStore.selectedElements.length - 3 }} more</div>
            </div>
            <span>הקצה ל:</span>
            <div class="flex flex-row gap-2">
                <WMButton @click="onAssignTo('team')" class="m-1 col-6" :class="{'selected' : !assignToUser }" name="basic-secondary">משתמש </WMButton>
                <WMButton @click="onAssignTo('user')" class="m-1 col-6" :class="{'selected': assignToUser }"  name="basic-secondary">צוות </WMButton>
            </div>
            
            <WMInputSearch :placeholder="$t('select', ['user'])" type="input-search"
             :multiple="false" width="248" :options="usersOrTeams"/>
            
            <WMButton @click="onAssign()" class="m-1 col-6" :class="{'selected': assignToUser }"  name="basic-secondary">הקצה </WMButton>

        </div>
    </OverlayPanel>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { useUtilsStore } from '@/stores/utils';
import { useLayout } from '@/layout/composables/layout';
// import { UserService } from '@/service/UserService';
import WMInputSearch from '@/components/forms/WMInputSearch.vue';

const utilsStore = useUtilsStore();
const { layoutConfig } = useLayout();

const isOpen = ref();
const toggle = (event) => {
    isOpen.value.toggle(event);
}

const assignToUser = ref(true);

const onAssignTo = (type) => {
    assignToUser.value = type === 'user';
} 

const usersOrTeams = ref();

// onMounted(() => {
//     UsersService.getUsers().then((response) => {
//         usersOrTeams.value = response.data.map((user) => {
//             return {
//                 label: user.name,
//                 value: user.id
//             }
//         });
//     });
// });

</script>

<style scoped>
.selected{
    background-color: #007ad9;
    color: white;
}
</style>

