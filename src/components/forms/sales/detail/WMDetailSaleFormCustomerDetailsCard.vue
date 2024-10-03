<template>
  <Card>
    <template #title>
      <div class="w-full flex align-items-center justify-content-between">
        <span>
          {{ $t("sale.customer-details") }}
        </span>
        <WMEditButtonIconOnly
          v-if="!editFormCustomerDetails"
          @click="editFormCustomerDetails = true"
        />
        <WMSaveButtonIconOnly
          v-else
          @click="
            emit('save');
            editFormCustomerDetails = false;
          "
        />
      </div>
    </template>
    <template #content>
      <Skeleton v-if="loading" width="100%" height="196px" />
      <template v-else>
        <div class="flex flex-auto gap-5 flex-row pb-5">
          <div v-show="!editFormCustomerDetails">
            <WMInput
              type="info-link"
              :highlighted="true"
              :label="$t('sale.customer-consultant') + ':'"
              :value="sale.consultant?.name + sale.consultant?.surname"
              :to="'/contact/' + sale.consultant?.id"
            />
          </div>

          <div v-show="editFormCustomerDetails">
            <WMInput
              name="consultant"
              :highlighted="true"
              type="input-select"
              :label="$t('sale.customer-consultant') + ':'"
              :options="contacts"
              :value="selectedCusomerConsultant"
              :placeholder="$t('select', ['contact.contact'])"
              size="sm"
            />
          </div>

          <div v-show="!editFormCustomerDetails">
            <WMInput
              type="info-link"
              :highlighted="true"
              :label="$t('sale.information-technology') + ':'"
              :value="sale.information_technology?.name + sale.information_technology?.surname"
              :to="'/contact/' + sale.information_technology?.id"
            />
          </div>

          <div v-show="editFormCustomerDetails">
            <WMInput
              name="information_technology"
              :highlighted="true"
              type="input-select"
              :label="$t('sale.information-technology') + ':'"
              :options="contacts"
              :value="selectedInfoTech"
              :placeholder="$t('select', ['contact.contact'])"
              size="sm"
            />
          </div>

          <div v-show="!editFormCustomerDetails">
            <WMInput
              type="info-link"
              :highlighted="true"
              :label="$t('sale.business-manager') + ':'"
              :value="sale.business_manager?.name + sale.business_manager?.surname"
              :to="'/contact/' + sale.business_manager?.id"
            />
          </div>

          <div v-show="editFormCustomerDetails">
            <WMInput
              name="business_manager"
              :highlighted="true"
              type="input-select"
              :label="$t('sale.business-manager') + ':'"
              :options="contacts"
              :value="selectedBuissnesManager"
              :placeholder="$t('select', ['contact.contact'])"
              size="sm"
            />
          </div>

          <div v-show="!editFormCustomerDetails">
            <WMInput
              type="info-link"
              :highlighted="true"
              :label="$t('sale.decision-maker') + ':'"
              :value="sale.decision_maker?.name + sale.decision_maker?.surname"
              :to="'/contact/' + sale.decision_maker?.id"
            />
          </div>

          <div v-show="editFormCustomerDetails">
            <WMInput
              name="decision_maker"
              :highlighted="true"
              type="input-select"
              :label="$t('sale.decision-maker') + ':'"
              :options="contacts"
              :value="selectedDecisionMaker"
              :placeholder="$t('select', ['contact.contact'])"
              size="sm"
            />
          </div>
        </div>
        <div class="flex flex-auto gap-5 flex-row">
          <div v-show="!editFormCustomerDetails">
            <WMInput
              type="info-link"
              :highlighted="true"
              :label="$t('sale.budgeting-factor') + ':'"
              :value="sale.budgeting_factor?.name + sale.budgeting_factor?.surname"
              :to="'/contact/' + sale.budgeting_factor?.id"
            />
          </div>

          <div v-show="editFormCustomerDetails">
            <WMInput
              name="budgeting_factor"
              :highlighted="true"
              type="input-select"
              :label="$t('sale.budgeting-factor') + ':'"
              :options="contacts"
              :value="selectedBudgetingFactor"
              :placeholder="$t('select', ['contact.contact'])"
              size="sm"
            />
          </div>
          <!-- {{ currency }} -->
          <WMInputCurrency
            v-model="currency"
            :read-only="!editFormCustomerDetails"
            name="budget"
            label="Budget"
          />
        </div>
      </template>
    </template>
  </Card>
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

const emit = defineEmits(["save"]);

// REFS
const editFormCustomerDetails = ref(false);

const contacts = ref();
const selectedCusomerConsultant = ref();
const selectedInfoTech = ref();
const selectedBuissnesManager = ref();
const selectedDecisionMaker = ref();
const selectedBudgetingFactor = ref();
const currency = ref(54);
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
      label: `${contact.firstName} ${contact.lastName}`,
    };
  });

  loading.value = false;
};

const setSelectedFields = () => {
  selectedCusomerConsultant.value = contacts.value.find(
    (contact) => contact.id === props.sale.consultant?.id
  );

  selectedInfoTech.value = contacts.value.find(
    (contact) => contact.id === props.sale.information_technology?.id
  );

  selectedBuissnesManager.value = contacts.value.find(
    (contact) => contact.id === props.sale.business_manager?.id
  );

  selectedDecisionMaker.value = contacts.value.find(
    (contact) => contact.id === props.sale.decision_maker?.id
  );

  selectedBudgetingFactor.value = contacts.value.find(
    (contact) => contact.id === props.sale.budgeting_factor?.id
  );

  currency.value = props.sale.budget;
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  await loadLazyData();
  setSelectedFields();
});
</script>

<style scoped></style>
