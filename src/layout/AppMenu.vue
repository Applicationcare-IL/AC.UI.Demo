<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

function getImageUrl(path) {
   return new URL(path, import.meta.url).href
}

const model = ref([
    {
        // User Panel
        visible:true,
        section: "user",
        items: [
            { label: 'דאשבורד', to: '/dashboard', image: new URL('/icons/nav/dashboard.svg', import.meta.url).href },
            { label: 'לקוחות', to: '/customers', image: new URL('/icons/nav/customers.svg', import.meta.url).href },
            { label: 'אנשי קשר', to: '/contacts', image: new URL('/icons/nav/contacts.svg', import.meta.url).href },
            { label: 'תהליכים', to: '/services', image: new URL('/icons/nav/services.svg', import.meta.url).href},
            { label: 'משימות', to: '/tasks', image: new URL('/icons/nav/tasks.svg', import.meta.url).href }
    ]
    },
    {
        //Admin Panel
        visible: false,
        section: "admin",
        items: [
            { label: 'Headers', to: '/Headers', image: '/icons/add_customer_active.svg' },
            { label: 'Buttons', to: '/Buttons', image: '/icons/add_customer_active.svg' },
            { label: 'Tables', to: '/Tables', image: '/icons/add_customer_active.svg' }
    ]

    
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
       
    </ul>
</template>

<style lang="scss" scoped></style>
