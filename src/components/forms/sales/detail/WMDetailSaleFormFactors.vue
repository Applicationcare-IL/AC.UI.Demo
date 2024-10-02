<template>
  <Skeleton v-if="loading" width="100%" height="196px" />
  <template v-else>
    editMode {{ editMode }}
    <div class="flex flex-auto gap-5 flex-row">
      <div v-show="!editMode">
        <WMInput
          name="legal_adviser_info_link"
          type="info-link"
          :highlighted="true"
          :label="$t('sale.legal-adviser') + ':'"
          :value="sale.contact.name + sale.contact.surname"
          :to="'/contact/' + sale.contact.id"
        />
      </div>

      <div v-show="editMode">
        <WMInput
          name="legal_adviser"
          :highlighted="true"
          type="input-select"
          :label="$t('sale.legal-adviser') + ':'"
          :options="contacts"
          :value="sale.legal_adviser"
          :placeholder="$t('select', ['contact.contact'])"
          size="sm"
        />
      </div>
    </div>
  </template>
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const { getContactsFromApi } = useContacts();
const optionSetsStore = useOptionSetsStore();

// INJECT

// PROPS, EMITS
const props = defineProps({
  sale: {
    type: Object,
    required: true,
  },
  editMode: {
    type: Boolean,
    default: false,
  },
});

// REFS
const contacts = ref();
const selectedContact = ref();
const loading = ref(true);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  const activeStateId = await optionSetsStore.getId("state", "active");

  const filters = {
    per_page: 99999,
    state: activeStateId,
  };

  const contactsResponse = await getContactsFromApi(filters);

  contacts.value = contactsResponse.data.map((contact) => {
    return {
      id: contact.id,
      label: contact.firstName,
    };
  });

  selectedContact.value = contacts.value.find((contact) => contact.id === props.sale.contact.id);

  loading.value = false;
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  loadLazyData();
});
</script>

<style scoped></style>
