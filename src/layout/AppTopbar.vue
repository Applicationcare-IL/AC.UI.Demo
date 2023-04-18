<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';

const { layoutConfig, onMenuToggle, contextPath } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();

onMounted(() => {
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const logoUrl = computed(() => {
    // return `${contextPath}layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
    return `${contextPath}Logo.svg`;
});

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};
const onSettingsClick = () => {
    topbarMenuActive.value = false;
    router.push('/documentation');
};
const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};
</script>

<template>
    <div class="layout-topbar flex  justify-content-between">

        <div class="flex mx-3">
            <router-link to="/" class="layout-topbar-logo">
                <img :src="logoUrl" alt="logo" />
            </router-link>

            <div class="flex mx-4 gap-2">
                <div class="class px-3 flex align-items-center ">
                    <span>תזכורות</span>
                    <span class="bg-yellow-500 px-2 py-1 mx-1 border-round-lg text-white">24</span>
                </div>

                <div class="class px-3 flex align-items-center">
                    <span>מעקבים</span>
                    <span class="bg-yellow-500 px-2 py-1 mx-1 border-round-lg text-white">24</span>
                </div>
            </div>
        </div>


        <span class="p-input-icon-left lg:flex hidden">
            <i class="pi pi-search" />
            <InputText class="w-30rem" v-model="value1" placeholder="Search" />
        </span>

        <div>
            <div class="layout-topbar-menu" :class="topbarMenuClasses">

                <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
                    <i class="pi pi-bars"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
