<template>
  <WMButton
    class="m-1 col-6"
    name="mail-white"
    icon="mail"
    :disabled="selectedElements == 0"
    @click="sendEmailDialogVisible = true"
  >
    דוא”ל
  </WMButton>

  <Dialog
    v-model:visible="sendEmailDialogVisible"
    modal
    header="Header"
    :style="{ minWidth: '640px' }"
  >
    <template #header>
      <span class="h4">Send email to contacts</span>
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

      <Divider />

      <WMCommunicationsEditor v-model="message" />

      <Divider />
    </div>

    <template #footer>
      <div class="flex flex-row gap-3">
        <Button label="Send" @click="handleSendEmail()" />

        <Button
          label="Cancel"
          @click="sendEmailDialogVisible = false"
          severity="secondary"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

const sendEmailDialogVisible = ref(false);

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

const getContactsFromApiParams = ref({
  per_page: 100,
});

const inputSearch = ref();

const { getContactsFromApi, selectedContacts } = useContacts();

const contactOptions = ref([]);

const searchContact = (query) => {
  return getContactsFromApi({
    search: query,
    ...getContactsFromApiParams.value,
  });
};

const selectedDropdownContacts = ref(0);

const onContactselected = (contacts) => {
  selectedDropdownContacts.value = contacts;
};

const handleClearAllSelectedDropdownContacts = () => {
  selectedDropdownContacts.value = [];
  inputSearch.value.clear();
};

const message = ref("");

onMounted(async () => {
  await getContactsFromApi(getContactsFromApiParams.value).then((response) => {
    contactOptions.value = response;
    fillSelectedContactDropdownWithSelectedContacts(selectedContacts.value);
  });
});

// TODO: move to utils
const getNames = (contacts) => {
  if (!Array.isArray(contacts)) {
    return contacts.name;
  }

  return contacts.map((contact) => contact.name).join(", ");
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
  if (newSelectedContacts.length == 0 || !contactOptions.value?.data) {
    return;
  }

  const newSelectedContactsIds = getContactsIds(newSelectedContacts);

  const filteredContactOptions = contactOptions.value?.data.filter(
    (contact) => {
      return newSelectedContactsIds.includes(contact.id);
    }
  );

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

const { sendEmail } = useCommunications();

const handleSendEmail = () => {
  const params = {
    ids: getContactsIds(selectedDropdownContacts.value),
    subject: "subject",
    body: message.value,
  };

  sendEmail(params);

  sendEmailDialogVisible.value = false;
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
