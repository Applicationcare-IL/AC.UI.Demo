<template>
  <Button
    label="הודעה"
    icon="pi pi-chevron-down"
    aria-haspopup="true"
    @click="toggleCommunicationsMenu"
    aria-controls="overlay_menu"
    class="m-1 p-button-default"
    :disabled="selectedElements == 0"
  />

  <Menu
    ref="menu"
    id="overlay_menu"
    :model="communicationsMenuItems"
    :popup="true"
  >
    <template #item="slotProps">
      <button
        @click="handleOverlayMenuClick(slotProps.item.action)"
        class="p-link flex align-items-center p-2 pl-3 text-color hover:surface-200 border-noround gap-2 w-full"
      >
        <div class="flex flex-column align">
          {{ slotProps.item.label }}
        </div>
      </button>
    </template>
  </Menu>

  <Dialog v-model:visible="SMSDialogVisible" modal header="Header">
    <template #header>
      <span>Send message to contacts</span>
    </template>

    <!-- Content -->

    <template #footer>
      <div class="flex flex-row gap-3">
        <Button label="Send" @click="SMSDialogVisible = false" />

        <Button
          label="Cancel"
          @click="SMSDialogVisible = false"
          severity="secondary"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref } from "vue";

const SMSDialogVisible = ref(false);

const props = defineProps({
  selectedElements: {
    type: Number,
    default: 0,
  },
});

const menu = ref();

const toggleCommunicationsMenu = (event) => {
  menu.value.toggle(event);
};

const communicationsMenuItems = ref([
  {
    label: "SMS",
    action: "sms",
  },
  {
    label: "Whatsapp",
    action: "whatsapp",
  },
]);

const handleOverlayMenuClick = (action) => {
  switch (action) {
    case "sms":
      SMSDialogVisible.value = true;
      break;
    case "whatsapp":
      console.log("whatsapp");
      break;
    default:
      break;
  }
};
</script>
