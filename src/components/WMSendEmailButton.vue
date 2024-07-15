<template>
  <WMButton
    :text="$t('buttons.email')"
    type="type-5"
    :disabled="selectedElements == 0"
    :is-disabled="selectedElements == 0"
    :click="
      () => {
        sendEmailDialogVisible = true;
      }
    "
  >
    <template #customIcon>
      <div class="flex" v-html="EmailIcon" />
    </template>
  </WMButton>

  <Dialog
    v-model:visible="sendEmailDialogVisible"
    modal
    header="Header"
    :style="{ width: '650px' }"
  >
    <template #header>
      <span class="h4">Send email to contacts</span>
    </template>

    <div v-if="selectedContacts" class="flex flex-column gap-2">
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
        <WMButton
          text="Clear all"
          :disabled="selectedContacts == 0"
          type="clear"
          class="custom-input-search__clear"
          @click="handleClearAllSelectedDropdownContacts"
        />
      </div>

      <Divider />

      <WMCommunicationsEditor
        v-model="message"
        @update:attachments="updateAttachments"
        @update:subject="handleUpdateSubject"
      />

      <Divider />
    </div>

    <div v-else>There is not contacts to send email to.</div>

    <template #footer>
      <div v-if="selectedContacts" class="flex flex-row gap-3">
        <Button label="Send" @click="handleSendEmail()" />

        <Button label="Cancel" severity="secondary" @click="sendEmailDialogVisible = false" />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

import EmailIcon from "/icons/email.svg?raw";

const toast = useToast();

const sendEmailDialogVisible = ref(false);

const attachments = ref([]);
const subject = ref("");

const encodeMessage = (message) => {
  return message.replace(/\n/g, "<br>");
};

const handleUpdateSubject = (newSubject) => {
  subject.value = newSubject;
};

const updateAttachments = (newAttachments) => {
  attachments.value = newAttachments;
};

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
    if (!newSelectedContacts || newSelectedContacts.length == 0) {
      return;
    }

    fillSelectedContactDropdownWithSelectedContacts(newSelectedContacts);
  }
);

const fillSelectedContactDropdownWithSelectedContacts = (newSelectedContacts) => {
  if (newSelectedContacts?.length == 0 || !contactOptions.value?.data) {
    return;
  }

  const newSelectedContactsIds = getContactsIdsFromSelectedContacts(newSelectedContacts);

  const filteredContactOptions = contactOptions.value?.data.filter((contact) => {
    return newSelectedContactsIds.includes(contact.id);
  });

  selectedDropdownContacts.value = filteredContactOptions;

  if (inputSearch.value) {
    inputSearch.value.clear();
  }
};

const getContactsIdsFromSelectedContacts = (contacts) => {
  if (!Array.isArray(contacts)) {
    return [contacts.id];
  }

  return contacts.map((contact) => contact.id);
};
/**
 * We have three cases
 * 1. We have the multiple prop as true, so we need to get the ids from the selectedDropdownContacts
 * 2. We have the multiple prop as false, but we have an array of selectedContacts, so we need to get the ids from the selectedContacts
 *    This case happens for example in the customer detial, were we need to be able to send an email to the customer contacts, who can be multiple
 * 3. We have the multiple prop as false, and we have a single selectedContact, so we need to get the id from the selectedContact
 */
const getContactIds = () => {
  if (props.multiple) {
    return getContactsIdsFromSelectedContacts(selectedDropdownContacts.value);
  }

  if (Array.isArray(selectedContacts.value)) {
    return getContactsIdsFromSelectedContacts(selectedContacts.value);
  }

  return [selectedContacts.value.id];
};

const { sendEmail } = useCommunications();

const handleSendEmail = () => {
  const params = {
    ids: getContactIds(),
    subject: subject.value,
    body: encodeMessage(message.value),
  };

  if (attachments.value.length > 0) {
    params.attachments = attachments.value.map((attachment) => attachment.id);
  }

  sendEmail(params).then(() => {
    toast.success({ message: "Email sent successfully" });
    sendEmailDialogVisible.value = false;
  });
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
    right: 0;
    font-weight: 700;
  }
}
</style>
