<template>
    <WMButton @click="toggle" class="m-1 col-6" name="assign-white" icon="assign"
              :disabled="utilsStore.selectedElements[props.entity]?.length == 0">הקצה
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
                <WMButton @click="onAssignTo('team')" class="m-1 col-6" :class="{ 'selected': !assignToUser }"
                          name="basic-secondary">משתמש </WMButton>
                <WMButton @click="onAssignTo('user')" class="m-1 col-6" :class="{ 'selected': assignToUser }"
                          name="basic-secondary">צוות </WMButton>
            </div>

            <WMInputSearch name="userOrTeam" :placeholder="$t('select', ['user'])" type="input-search" :multiple="true"
                           width="248" :options="usersOrTeams" />

            <WMButton class="m-1 col-6" name="basic-secondary">הקצה </WMButton>

        </div>
    </OverlayPanel>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { useUtilsStore } from '@/stores/utils';
import { useLayout } from '@/layout/composables/layout';
// import { UserService } from '@/service/UserService';
import WMInputSearch from '@/components/forms/WMInputSearch.vue';

const props = defineProps({
    entity: {
        type: String,
        default: ''
    },
});

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

const usersOrTeams = ref([{}]);

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
.selected {
    background-color: #007ad9;
    color: white;
}
</style>

