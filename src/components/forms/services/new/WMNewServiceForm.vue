<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="service-data flex flex-auto flex-column gap-5 mb-5">
      <h1 class="h1 mb-0" v-if="!props.isSidebar">
        {{ $t("new", ["service.service"]) }}
      </h1>
      <h2 class="h2 my-0">{{ $t("general-details") }}</h2>
      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMTeamOwnerFields />
        </div>
      </div>
      <div class="wm-form-row align-items-end gap-5">
        <WMInputSearch
          name="contact"
          :required="true"
          :placeholder="$t('select', ['contact'])"
          type="input-search"
          :label="$t('contact') + ':'"
          width="160"
          :highlighted="true"
          :searchFunction="searchContact"
          :new="true"
          related-sidebar="newContact"
        />

        <WMSidebar
          :visible="isNewContactSidebarVisible"
          @close-sidebar="closeNewContactSidebar"
          @open-sidebar="openNewContactSidebar"
          name="newContact"
        >
          <WMNewEntityFormHeader entity="contact" name="newContact" />
          <WMNewContactForm
            :isSidebar="true"
            @close-sidebar="closeNewContactSidebar"
          />
        </WMSidebar>

        <WMInputSearch
          name="customer"
          :required="true"
          :placeholder="$t('select', ['customer'])"
          type="input-search"
          :label="$t('customer') + ':'"
          width="160"
          :highlighted="true"
          :searchFunction="searchCustomer"
          :new="true"
          related-sidebar="newCustomer"
        />

        <WMSidebar
          :visible="isNewCustomerSidebarVisible"
          @close-sidebar="closeNewCustomerSidebar"
          @open-sidebar="openNewCustomerSidebar"
          name="newCustomer"
        >
          <WMNewEntityFormHeader entity="customer" name="newCustomer" />
          <WMNewCustomerForm
            :isSidebar="true"
            @close-sidebar="closeNewCustomerSidebar"
          />
        </WMSidebar>
      </div>
      <div class="wm-form-row gap-5">
        <WMInput
          name="direction"
          type="input-select"
          :highlighted="true"
          :label="$t('direction') + ':'"
          width="80"
          :options="directions"
          optionSet
        />
        <WMInput
          name="channel"
          type="input-select"
          :highlighted="true"
          :label="$t('channel') + ':'"
          :options="channels"
          optionSet
          width="104"
        />
        <WMInput
          name="priority"
          type="input-select"
          :highlighted="true"
          :label="$t('priority') + ':'"
          :options="urgencies"
          width="104"
          optionSet
        />
      </div>

      <Divider class="" layout="horizontal" />
      <div class="service-classification flex flex-auto flex-column gap-5">
        <h2 class="h2 mb-0">{{ $t("classification") }}</h2>

        <div class="wm-form-row gap-5">
          <WMInputSearch
            name="short-classification"
            :highlighted="true"
            :label="$t('short-classification') + ':'"
            :options="quickCodes"
            width="336"
            :placeholder="$t('select', ['short-classification'])"
          />
        </div>
        <div class="wm-form-row gap-5">
          <WMInputSearch
            name="area"
            :highlighted="true"
            :required="true"
            :label="$t('classification-1') + ':'"
            type="input-search"
            :options="areas"
            width="152"
            :placeholder="$t('select', ['classification-1'])"
            @change="updateDropdown('service_type', $event.value.id, 'types')"
          />

          <WMInputSearch
            name="type"
            :highlighted="true"
            :required="true"
            :label="$t('classification-2') + ':'"
            :options="types"
            width="152"
            :placeholder="$t('select', ['classification-2'])"
            @change="
              updateDropdown('service_request_1', $event.value.id, 'requests1')
            "
          />
          <WMInputSearch
            name="request1"
            :highlighted="true"
            :required="true"
            :label="$t('classification-3') + ':'"
            :options="requests1"
            width="152"
            :placeholder="$t('select', ['classification-3'])"
            @change="
              updateDropdown('service_request_2', $event.value.id, 'requests2')
            "
          />
        </div>

        <div class="wm-form-row gap-5">
          <WMInputSearch
            name="request2"
            :highlighted="true"
            :label="$t('classification-4') + ':'"
            :options="requests2"
            width="152"
            :placeholder="$t('select', ['classification-4'])"
            @change="
              updateDropdown('service_request_3', $event.value.id, 'requests3')
            "
          />
          <WMInputSearch
            name="request_3"
            :highlighted="true"
            :label="$t('classification-5') + ':'"
            :options="requests3"
            width="152"
            :placeholder="$t('select', ['classification-5'])"
          />
        </div>
      </div>
      <Divider class="mb-0" layout="horizontal" />
      <div class="service-description flex flex-auto flex-column gap-5">
        <h2 class="h2 mb-0">{{ $t("description") }}</h2>
        <div class="wm-form-row gap-5">
          <WMInput type="text-area" id="description" name="description" />
        </div>
      </div>
      <Divider class="mt-5 mb-0" layout="horizontal" />
      <WMNewFormAddress />
      <Divider class="mt-5 mb-0" layout="horizontal" />
      <WMNewServiceFormSite />
    </div>
    <WMFormButtons
      v-if="isSidebar"
      @save-form="onSubmit()"
      @cancel-form="onCancel()"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useForm, useField } from "vee-validate";
import { useOptionSetsStore } from "@/stores/optionSets";
import { useRouter } from "vue-router";

const props = defineProps({
  isSidebar: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["closeSidebar"]);

const router = useRouter();
const customers = ref();
const contacts = ref();
const optionSetsStore = useOptionSetsStore();

const toast = useToast();
const dialog = useDialog();
const formUtilsStore = useFormUtilsStore();

const directions = ref();
const channels = ref();
const urgencies = ref();

const quickCodes = ref([]);
const areas = ref([]);
const types = ref([]);
const requests1 = ref([]);
const requests2 = ref([]);
const requests3 = ref([]);
const optionRefs = {
  areas: areas,
  types: types,
  requests1: requests1,
  requests2: requests2,
  requests3: requests3,
};
const { value } = useField("description");
const { getCustomersFromApi } = useCustomers();

onMounted(() => {
  optionSetsStore
    .getOptionSetValuesFromApi("service_direction")
    .then((data) => (directions.value = data));
  optionSetsStore
    .getOptionSetValuesFromApi("service_channel")
    .then((data) => (channels.value = data));
  optionSetsStore
    .getOptionSetValuesFromApi("service_urgent")
    .then((data) => (urgencies.value = data));
  optionSetsStore
    .getOptionSetValuesFromApiRaw("service_area")
    .then((data) => (areas.value = data));
});

const updateDropdown = (dropdown, selectedId, dropdownOptions) => {
  optionSetsStore
    .getOptionSetValuesFromApiRaw(dropdown, selectedId)
    .then((data) => {
      optionRefs[dropdownOptions].value = data;
    });
};

const selectedContact = ref();
const selectedCustomer = ref();

const searchCustomer = (query) => {
  return getCustomersFromApi({
    search: query,
    contact_id: values.contact?.id,
  });
};

const { getContactsFromApi } = useContacts();

const searchContact = (query) => {
  return getContactsFromApi({
    search: query,
    customer_id: values.customer?.id,
  });
};

const { errors, handleSubmit, setFieldError, meta, values } = useForm({
  validationSchema: formUtilsStore.getServiceFormValidationSchema,
  initialValues: {
    description: "",
  },
});

const { createService, parseService } = useServices();

const onSubmit = handleSubmit((values) => {
  createService(parseService(values))
    .then((data) => {
      dialog.confirmNewService(data.data.id);
      toast.successAction("service", "created");
    })
    .catch((error) => {
      console.error(error);
      toast.error("service", "not-created");
    });
});

// if (formUtilsStore.formMeta.dirty) dialog.discardNewService();
const onCancel = () => {
  emit("closeSidebar");
};

formUtilsStore.formEntity = "service";

watch(
  () => meta.value,
  (value) => {
    formUtilsStore.formMeta = value;
  }
);

// new contact sidebar
const isNewContactSidebarVisible = ref(false);

function openNewContactSidebar() {
  isNewContactSidebarVisible.value = true;
}

function closeNewContactSidebar() {
  isNewContactSidebarVisible.value = false;
}

// new customer sidebar
const isNewCustomerSidebarVisible = ref(false);

function openNewCustomerSidebar() {
  isNewCustomerSidebarVisible.value = true;
}

function closeNewCustomerSidebar() {
  isNewCustomerSidebarVisible.value = false;
}

const openNewContact = () => {
  router.push("/new-contact");
  const routeData = router.resolve({ name: "newContact" });
  window.open(routeData.href, "_blank");
};

defineExpose({
  onSubmit,
  onCancel,
});
</script>

<style scoped lang="scss"></style>
