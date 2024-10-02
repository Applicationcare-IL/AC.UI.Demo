<template>
  <Skeleton v-if="loading" width="100%" height="196px" />
  <template v-else>
    <div class="flex flex-column gap-5">
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

        <div class="flex gap-2">
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
          <router-link
            :to="{
              name: 'contactDetail',
              params: { id: selectedContact.id },
            }"
            class="flex align-items-center vertical-align-middle"
          >
            <div class="flex align-items-center" v-html="NewTabIcon" />
          </router-link>
        </div>
      </div>
      <div class="flex flex-auto gap-5 flex-row">
        <WMInput
          name="sale-type"
          type="info"
          :highlighted="true"
          :label="$t('sale.sale-type') + ':'"
          :value="sale.sale_type"
          option-set
        />
        <WMInput
          name="source"
          type="info"
          :highlighted="true"
          :label="$t('sale.source') + ':'"
          :value="sale.sale_source"
          option-set
        />
        <WMInput
          name="initiator"
          type="info"
          :highlighted="true"
          :label="$t('sale.initiator') + ':'"
          :value="sale.sale_initiator"
          option-set
        />
      </div>
      <div class="flex flex-auto gap-5 flex-row">
        <!-- <WMInput
          name="started-date"
          type="info"
          :highlighted="true"
          :label="$t('task.started_at')"
          :value="task.started_at"
        />

        <WMInput
          name="started-date"
          type="info"
          :highlighted="true"
          :label="$t('task.started_at')"
          :value="task.started_at"
        /> -->

        <!-- <WMSLATag
          v-if="sale.process.sla"
          :sla="sale.process.sla"
          :days-for-closing="sale.process.sla.days_for_closing"
          :state="sale.process.state.value"
        /> -->
      </div>
    </div>
  </template>
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";

import NewTabIcon from "/icons/new_tab.svg?raw";
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
