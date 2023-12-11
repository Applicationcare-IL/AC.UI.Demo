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
        <span class="h6">From:</span>

        <Chip class="p-chip--purple">
          <span>{{ selectedContacts.name }}</span>
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

      <WMCommunicationsEditor />

      <Divider />
    </div>

    <template #footer>
      <div class="flex flex-row gap-3">
        <Button label="Send" @click="sendEmailDialogVisible = false" />

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
import { ref, watch } from "vue";
import { useOptionSetsStore } from "@/stores/optionSets";

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

const inputSearch = ref();

const { getContactsFromApi, selectedContacts } = useContacts();

const searchContact = (query) => {
  return getContactsFromApi({ search: query });
};

const selectedDropdownContacts = ref(0);
const selectedChannel = ref();

const onContactselected = (contacts) => {
  selectedDropdownContacts.value = contacts;
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
