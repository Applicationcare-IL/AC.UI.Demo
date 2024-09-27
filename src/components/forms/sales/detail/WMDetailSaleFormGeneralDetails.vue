<template>
  <Skeleton v-if="loading" width="100%" height="196px" />
  <template v-else>
    <div class="flex flex-auto gap-5 flex-row">
      <WMInput
        name="identifier"
        type="info"
        :highlighted="true"
        :label="$t('id') + ':'"
        :value="sale.id"
      />

      <WMInput
        name="owner"
        type="info"
        :highlighted="true"
        :label="$t('owner') + ':'"
        :value="sale.owner.name"
      />

      <WMInput
        name="customer"
        type="info-link"
        :highlighted="true"
        :label="$t('customer.customer') + ':'"
        :value="sale.customer.name + sale.customer.surname"
        :to="'/customer/' + sale.customer.id"
      />
      <div class="flex">
        <WMInput
          name="contact"
          type="input-select"
          :highlighted="true"
          :label="$t('contact.contact') + ':'"
          :options="contacts"
          :value="selectedContact"
          required
          @update:selected-item="selectedContact = $event"
        />
        {{ selectedContact }} Enlace
      </div>
    </div>
    <div class="flex flex-auto gap-5 flex-row"></div>
    <div class="flex flex-auto gap-5 flex-row"></div>
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
