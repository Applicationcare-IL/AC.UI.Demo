<template>
    <FileUpload :auto="true" name="files[]" url="./upload.php" @upload="onAdvancedUpload($event)" :multiple="true" accept=""
                :maxFileSize="1000000">
        <template #content="{ files, uploadedFiles }">

            <DataView :value="products" :layout="layout">
                <template #header>
                    <div class="flex flex-row justify-content-between align-items-center gap-4">
                        <div>
                            <span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText class="" :placeholder="$t('search')" />
                            </span>
                        </div>
                        <div class="flex justify-content-start">
                            <DataViewLayoutOptions v-model="layout" />
                        </div>
                    </div>
                </template>
                <template #list="slotProps">
                    <div class="col-12">
                        <div class="flex flex-row align-items-center justify-content-between" style="height: 40px;">
                            <div class="flex flex-row justify-items-start">
                                <img class="mx-2 border-round-sm"
                                     :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`"
                                     :alt="slotProps.data.name" style="width: 16px; height: 16px;" />
                                <span>Filename.jpg</span>
                            </div>
                            <div class="flex flex-row justify-items-end align-items-center gap-2">
                                <span>20Kb</span>
                                <span>15/03/2023</span>
                                <WMButton @click="toggle" aria-haspopup="true" name="kebab" aria-controls="overlay_menu"
                                          icon="kebab" />
                                <Menu ref="menu" id="overlay_menu" :model="items" :popup="true">
                                    <template #item="slotProps">
                                        <button @click="profileClick"
                                                class="p-link flex align-items-center p-2 pl-3 text-color hover:surface-200 border-noround gap-2">
                                            <img :src="slotProps.item.image">
                                            <div class="flex flex-column align">
                                                {{ slotProps.item.label }}
                                            </div>
                                        </button>
                                    </template>
                                </Menu>
                            </div>
                        </div>
                    </div>
                </template>

                <template #grid="slotProps">

                    <div class="flex flex-column align-items-center px-5 py-2 hover:surface-200 justify-content-between border-round-lg" @contextmenu="onGridRightClick"
                         style="height: 90px;">
                        <img class="border-round-sm"
                             :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`"
                             :alt="slotProps.data.name" style="width: 48px; height: 48px;" />
                        <div>Filename.jpg</div>
                        <ContextMenu ref="menu2" :model="items" >
                            <template #item="slotProps">
                                        <button @click="profileClick"
                                                class="p-link flex align-items-center p-2 pl-3 text-color hover:surface-200 border-noround gap-2">
                                            <img :src="slotProps.item.image">
                                            <div class="flex flex-column align">
                                                {{ slotProps.item.label }}
                                            </div>
                                        </button>
                                    </template>    
                        </ContextMenu>
                    </div>
                </template>
            </DataView>
            <WMButton class="my-3" name="attach" icon="attach" @click="onAttachClick">Attach</WMButton>
            <div v-if='uploadedFiles.length > 0'>
                <span>Uploaded Files</span>
                <div v-for="(file, index) of uploadedFiles"
                     class="flex flex-row justify-content-between align-items-center gap-4">
                    {{ file.name }}
                </div>
            </div>
        </template>
    </FileUpload>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ProductService } from '@/service/ProductService';

onMounted(() => {
    setTimeout(function () {
        ProductService.getProductsSmall().then((data) => (products.value = data.slice(0, 10)));
    }, 1000);
});

const onAttachClick = () => {
    document.querySelector('.p-fileupload-choose').click();
};

const layout = ref('grid');
const products = ref();

const menu = ref();
const menu2 = ref();
const items = ref([
    { label: 'View', image: new URL('/icons/menu/view.svg', import.meta.url).href },
    { label: 'Rename', image: new URL('/icons/menu/rename.svg', import.meta.url).href },
    { label: 'Share', image: new URL('/icons/menu/share.svg', import.meta.url).href },
    { label: 'Download', image: new URL('/icons/menu/download.svg', import.meta.url).href },
    { label: 'Delete', image: new URL('/icons/menu/delete.svg', import.meta.url).href },
]);

const onGridRightClick = (event) => {
    menu2.value.show(event);
};

const toggle = (event) => {
    menu.value.toggle(event);
};

</script>

<style scoped>
:deep(.p-fileupload-buttonbar) {
    display: none;
}
:deep(.p-fileupload-content) {
    padding: 0px;
}
</style>
```