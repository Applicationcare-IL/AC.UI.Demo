<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const emit = defineEmits(['topbar-item-click'])

const { layoutConfig, onMenuToggle, contextPath } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();

defineProps({
    activeTopbarItem: String
});

onMounted(() => {
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const logoUrl = computed(() => {
    return `${contextPath}Logo.svg`;
});

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};

const onTopbarItemClick = (event, item) => {
    emit('topbar-item-click', { originalEvent: event, item: item });
    event.preventDefault();
};

const onTopbarSubItemClick = (event) => {
    emit('topbar-subitem-click', { originalEvent: event, item: item });
    event.preventDefault();
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

        <div class="flex mx-6">
            <div class="layout-topbar-menu" :class="topbarMenuClasses">

                <!-- <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
                                <i class="pi pi-bars"></i>
                            </button> -->
                <li class="topbar-item notifications"
                    :class="{ 'active-topmenuitem': activeTopbarItem === 'notifications' }">
                    <a href="#" @click="onTopbarItemClick($event, 'notifications')">
                        <Button type="button" class="border-none bg-white">
                            <img alt="logo" src="/icons/notifications_bell.svg" class="h-2rem" />
                            <Badge value="2" class="topbar-badge notifications-badge p-badge-warning"></Badge>
                        </Button>
                    </a>

                    <ul class="notifications-dropdown fadeInDown p-4">
                        <li class="layout-submenu-header flex flex-row justify-content-between">
                            <h6 class="header-text">Notifications</h6>
                            <span class="p-badge">3</span>
                        </li>
                        <li role="menuitem">
                            <a href="#" @click="onTopbarSubItemClick($event)">
                                <div class="notifications-item">
                                    <h6>Notification 1</h6>
                                </div>
                            </a>
                        </li>
                        <li role="menuitem">
                            <a href="#" @click="onTopbarSubItemClick($event)">
                                <div class="notifications-item">
                                    <h6>Notification 2</h6>
                                </div>
                            </a>
                        </li>
                        <li role="menuitem">
                            <a href="#" @click="onTopbarSubItemClick($event)">
                                <div class="notifications-item">
                                    <h6>Notification 3</h6>
                                </div>
                            </a>
                        </li>
                        <li role="menuitem">
                            <a href="#" @click="onTopbarSubItemClick($event)">
                                <div class="notifications-item">
                                    <div class="notifications-item">
                                        <h6>Notification 4</h6>
                                    </div>
                                </div>
                            </a>
                        </li>
                    </ul>
                </li>



                <li class="topbar-item profile" :class="{ 'active-topmenuitem': activeTopbarItem === 'profile' }">
                    <a href="#" @click="onTopbarItemClick($event, 'profile')"
                       class="flex flex-row flex align-items-center gap-2">
                        Israel Israeli
                        <img alt="logo" src="/icons/user.svg" class="" />
                    </a>

                    <ul class="profile-dropdown fadeInDown p-4">
                        <!-- <li class="layout-submenu-header flex flex-row justify-content-between">
                            <h6 class="header-text">Settings</h6>
                            <span class="p-badge"></span>
                        </li> -->
                        <li role="menuitem">
                            <a href="#" @click="onTopbarSubItemClick($event)">
                                <div>
                                    <h6>Settings</h6>
                                </div>
                            </a>
                        </li>
                        <li role="menuitem">
                            <a href="#" @click="authStore.logout">
                                <div class="notifications-item">
                                    <h6>Logout</h6>
                                </div>
                            </a>
                        </li>
                        <li role="menuitem">
                            <a href="#" @click="onTopbarSubItemClick($event)">
                                <div class="notifications-item">
                                    <h6>Notification 3</h6>
                                </div>
                            </a>
                        </li>
                        <li role="menuitem">
                            <a href="#" @click="onTopbarSubItemClick($event)">
                                <div class="notifications-item">
                                    <div class="notifications-item">
                                        <h6>Notification 4</h6>
                                    </div>
                                </div>
                            </a>
                        </li>
                    </ul>
                </li>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
