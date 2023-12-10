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
    :model="communicationChannels"
    :popup="true"
  >
    <template #item="slotProps">
      <button
        @click="handleOverlayMenuClick(slotProps.item.value)"
        class="p-link flex align-items-center p-2 pl-3 text-color hover:surface-200 border-noround gap-2 w-full"
      >
        <div class="flex flex-column align">
          {{ $t(slotProps.item.label) }}
        </div>
      </button>
    </template>
  </Menu>

  <Dialog
    v-model:visible="SMSDialogVisible"
    modal
    header="Header"
    :style="{ minWidth: '640px' }"
  >
    <template #header>
      <span class="h4">Send message to contacts</span>
    </template>

    <div class="flex flex-column gap-2 my-5">
      <div v-if="!multiple" class="flex flex-row gap-3">
        <span class="h6">From:</span>
        contact
      </div>

      <div v-if="multiple" class="custom-input-search mb-3">
        <span class="h6 custom-input-search__to">To:</span>
        <WMInputSearch
          name="contacts"
          :placeholder="$t('select', ['contact'])"
          :multiple="true"
          :searchFunction="searchContact"
          @update:modelValue="onContactselected"
          :modelValue="selectedDropdownContacts"
          theme="purple"
          class="custom-input-search__input"
          ref="inputSearch"
        />
        <Button
          @click="handleClearAllSelectedDropdownContacts"
          :disabled="selectedContacts == 0"
          link
          class="custom-input-search__clear"
        >
          Clear all
        </Button>
      </div>

      <div class="flex flex-row align-items-baseline gap-3">
        <span class="h6">Channel:</span>
        <Dropdown
          optionLabel="name"
          v-model="selectedChannel"
          :options="communicationChannels"
          placeholder="Select a channel"
          class="w-full md:w-14rem"
        />
      </div>
      <Divider />

      <WMCommunicationsEditor :hide-toolbar="true" />

      <Divider />
    </div>

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
import { ref, watch } from "vue";
import { useOptionSetsStore } from "@/stores/optionSets";

const SMSDialogVisible = ref(false);

const props = defineProps({
  selectedElements: {
    type: Number,
    default: 0,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
});

const inputSearch = ref();

const menu = ref();

const toggleCommunicationsMenu = (event) => {
  menu.value.toggle(event);
};

const optionSetsStore = useOptionSetsStore();

const communicationChannels = optionSetsStore.getOptionSetValues(
  "communicationChannels"
);

const { getContactsFromApi, selectedContacts } = useContacts();

const searchContact = (query) => {
  return getContactsFromApi({ search: query });
};

const selectedDropdownContacts = ref(0);
const selectedChannel = ref();

const onContactselected = (contacts) => {
  selectedDropdownContacts.value = contacts;
};

const handleOverlayMenuClick = (action) => {
  switch (action) {
    case "sms":
      SMSDialogVisible.value = true;
      selectedChannel.value = communicationChannels[0];
      break;
    case "whatsapp":
      SMSDialogVisible.value = true;
      selectedChannel.value = communicationChannels[1];
      break;
    default:
      break;
  }
};

const handleClearAllSelectedDropdownContacts = () => {
  selectedDropdownContacts.value = [];
  inputSearch.value.clear();
};

watch(
  () => selectedContacts.value,
  (value) => {
    selectedDropdownContacts.value = value;
    // check if the input search is undefined
    console.log(typeof inputSearch);
    if (inputSearch.value) {
      inputSearch.value.clear();
    }
  }
);
</script>

<style scoped lang="scss">
.custom-input-search {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;

  &__to {
    top: 6px;
    position: absolute;
  }

  &__input {
    top: 0px;
    position: absolute;
    left: 30px;
  }

  &__clear {
    top: 0px;
    position: absolute;
    left: 150px;
    font-weight: 700;
  }
}
</style>
