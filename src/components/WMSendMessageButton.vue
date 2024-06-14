<template>
  <WMButton
    v-if="can('global.sms') || can('global.whatsapp')"
    :text="$t('buttons.message')"
    type="type-5"
    icon="pi-chevron-down"
    :is-disabled="selectedElements == 0"
    :disabled="selectedElements == 0"
    @click="toggleCommunicationsMenu"
  >
  </WMButton>

  <Menu id="overlay_menu" ref="menu" :model="communicationChannels" :popup="true">
    <template #item="slotProps">
      <button
        class="p-link flex align-items-center p-2 pl-3 text-color hover:surface-200 border-noround gap-2 w-full"
        @click="handleOverlayMenuClick(slotProps.item.value)"
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
    :style="{ minWidth: '300px' }"
  >
    <template #header>
      <span class="h4">Send message to contacts</span>
    </template>
    <div v-if="selectedContacts" class="flex flex-column gap-2 my-5">
      <div v-if="!multiple" class="flex flex-row gap-3">
        <span class="h6">To:</span>

        <Chip class="p-chip--purple">
          <span>{{ getNames(selectedContacts) }}</span>
        </Chip>
      </div>

      <div v-if="multiple" class="custom-input-search mb-3">
        <span class="h6 custom-input-search__to">To:</span>
        <WMInputSearch
          ref="inputSearch"
          name="contacts"
          :placeholder="$t('select', ['contact'])"
          :multiple="true"
          :search-function="searchContact"
          :model-value="selectedDropdownContacts"
          theme="purple"
          class="custom-input-search__input"
          :options="contactOptions"
          @update:model-value="onContactselected"
        />
        <Button
          :disabled="selectedContacts == 0"
          link
          class="custom-input-search__clear"
          @click="handleClearAllSelectedDropdownContacts"
        >
          Clear all
        </Button>
      </div>

      <div class="flex flex-row align-items-baseline gap-3">
        <span class="h6">Channel:</span>
        <Dropdown
          v-model="selectedChannel"
          option-label="name"
          :options="communicationChannels"
          placeholder="Select a channel"
          class="w-full md:w-14rem"
        />
      </div>
      <Divider />

      <WMCommunicationsEditor v-model="message" :hide-toolbar="true" :hide-subject="true" />

      <Divider />
    </div>

    <div v-else>There is not contacts to send messages to.</div>

    <template #footer>
      <div v-if="selectedContacts" class="flex flex-row gap-3">
        <Button label="Send" @click="handleSendMessage()" />

        <Button label="Cancel" severity="secondary" @click="sendMessageDialogVisible = false" />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

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
const { can } = usePermissions();

let communicationChannels = optionSetsStore.getOptionSetValues("communicationChannels");

// filter communication channels based on user permissions
if (!can("global.sms")) {
  communicationChannels = communicationChannels.filter((channel) => channel.value !== "sms");
}

if (!can("global.whatsapp")) {
  communicationChannels = communicationChannels.filter((channel) => channel.value !== "whatsapp");
}

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
  let params;

  switch (selectedChannel.value.value) {
    case "sms":
      params = {
        ids: props.multiple
          ? getContactsIds(selectedDropdownContacts.value)
          : getContactsIds(selectedContacts.value),
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
    if (!newSelectedContacts || newSelectedContacts.length == 0) {
      return;
    }

    fillSelectedContactDropdownWithSelectedContacts(newSelectedContacts);
  }
);

const fillSelectedContactDropdownWithSelectedContacts = (newSelectedContacts) => {
  if (newSelectedContacts?.length == 0 || !contactOptions.value) {
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
