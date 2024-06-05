<template>
  <WMButton
    aria-haspopup="true"
    name="kebab"
    aria-controls="overlay_menu"
    icon="kebab"
    @click="toggle"
  />
  <Menu id="overlay_menu" ref="menu" :model="items" :popup="true">
    <template #item="slotProps">
      <button
        class="p-link flex align-items-center p-2 pl-3 text-color hover:surface-200 border-noround gap-2"
        @click="handleOverlayMenuClick(slotProps.item.action)"
      >
        <img :src="slotProps.item.image" />
        <div class="flex flex-column align">
          {{ slotProps.item.label }}
        </div>
      </button>
    </template>
  </Menu>
</template>
<script setup>
import { ref } from "vue";

const { deleteDocument } = useDocuments();

const props = defineProps({
  itemId: {
    type: String,
    default: "",
  },
});

const menu = ref();

const toggle = (event) => {
  menu.value.toggle(event);
};

const emit = defineEmits(["editRow", "refreshTable"]);

const handleOverlayMenuClick = (action) => {
  switch (action) {
    case "view":
      break;
    case "edit":
      emit("editRow", props.itemId);
      break;
    case "share":
      break;
    case "download":
      break;
    case "delete":
      deleteDocument(props.itemId);
      emit("refreshTable");
      break;
    default:
      break;
  }
};

const items = ref([
  // {
  //   label: "View",
  //   image: new URL("/icons/menu/view.svg", import.meta.url).href,
  //   action: "view",
  // },
  {
    label: "Edit",
    image: new URL("/icons/menu/rename.svg", import.meta.url).href,
    action: "edit",
  },
  // {
  //   label: "Share",
  //   image: new URL("/icons/menu/share.svg", import.meta.url).href,
  //   action: "share",
  // },
  // {
  //   label: "Download",
  //   image: new URL("/icons/menu/download.svg", import.meta.url).href,
  //   action: "download",
  // },
  {
    label: "Delete",
    image: new URL("/icons/delete.svg", import.meta.url).href,
    action: "delete",
  },
]);
</script>
