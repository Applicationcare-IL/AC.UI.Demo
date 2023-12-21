<template>
  <Button
    :label="$t('buttons.message')"
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
    v-model:visible="sendMessageDialogVisible"
    modal
    header="Header"
    :style="{ minWidth: '640px' }"
  >
    <template #header>
      <span class="h4">Send message to contacts</span>
    </template>

    <div class="flex flex-column gap-2 my-5">
      <div v-if="!multiple" class="flex flex-row gap-3">
        <span class="h6">To:</span>

        <Chip class="p-chip--purple">
          <span>{{ getNames(selectedContacts) }}</span>
        </Chip>
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
          :options="contactOptions"
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

      <WMCommunicationsEditor v-model="message" :hide-toolbar="true" />

      <Divider />
    </div>

    <template #footer>
      <div class="flex flex-row gap-3">
        <Button label="Send" @click="handleSendMessage()" />

        <Button
          label="Cancel"
          @click="sendMessageDialogVisible = false"
          severity="secondary"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useOptionSetsStore } from "@/stores/optionSets";

const message = ref("");

const sendMessageDialogVisible = ref(false);

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

const contactOptions = ref([]);

const getContactsFromApiParams = ref({
  per_page: 100,
});

onMounted(async () => {
  const response = await getContactsFromApi(getContactsFromApiParams.value);
  contactOptions.value = response.data;
});

const searchContact = (query) => {
  return getContactsFromApi({
    search: query,
    ...getContactsFromApiParams.value,
  });
};

const selectedDropdownContacts = ref(0);
const selectedChannel = ref();

const onContactselected = (contacts) => {
  selectedDropdownContacts.value = contacts;
};

const handleOverlayMenuClick = (action) => {
  switch (action) {
    case "sms":
      sendMessageDialogVisible.value = true;
      selectedChannel.value = communicationChannels[0];
      break;
    case "whatsapp":
      sendMessageDialogVisible.value = true;
      selectedChannel.value = communicationChannels[1];
      break;
    default:
      break;
  }
};

const { sendSMS } = useCommunications();

const handleSendMessage = () => {
  switch (selectedChannel.value.value) {
    case "sms":
      const params = {
        ids: getContactsIds(selectedDropdownContacts.value),
        body: message.value,
      };

      sendSMS(params);
      break;
    case "whatsapp":
      break;
    default:
      break;
  }

  sendMessageDialogVisible.value = false;
};

const handleClearAllSelectedDropdownContacts = () => {
  selectedDropdownContacts.value = [];
  inputSearch.value.clear();
};

watch(
  () => selectedContacts.value,
  (newSelectedContacts) => {
    fillSelectedContactDropdownWithSelectedContacts(newSelectedContacts);
  }
);

const fillSelectedContactDropdownWithSelectedContacts = (
  newSelectedContacts
) => {
  if (newSelectedContacts.length == 0 || !contactOptions.value) {
    return;
  }

  const newSelectedContactsIds = getContactsIds(newSelectedContacts);

  const filteredContactOptions = contactOptions.value?.filter((contact) => {
    return newSelectedContactsIds.includes(contact.id);
  });

  selectedDropdownContacts.value = filteredContactOptions;

  if (inputSearch.value) {
    inputSearch.value.clear();
  }
};

const getContactsIds = (contacts) => {
  if (!Array.isArray(contacts)) {
    return [contacts.id];
  }

  return contacts.map((contact) => contact.id);
};

// TODO: move to utils
const getNames = (contacts) => {
  if (!Array.isArray(contacts)) {
    return contacts.name;
  }

  return contacts.map((contact) => contact.name).join(", ");
};
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
