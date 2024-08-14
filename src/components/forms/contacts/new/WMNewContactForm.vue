<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="contact-data flex flex-auto flex-column gap-5 mb-5">
      <h1 v-if="!props.isSidebar" class="h1 mb-0">
        {{ $t("new", ["contact.contact"]) }}
      </h1>
      <h2 class="h2 mb-0">{{ $t("general-details") }}</h2>
      <div class="wm-form-row">
        <WMInput
          name="owner"
          type="info"
          :highlighted="true"
          :label="$t('owner') + ':'"
          :value="authStore.userFullName"
          data-testid="contact.form.owner"
        />
      </div>
      <div class="wm-form-row gap-32px">
        <WMInput
          name="first-name"
          :required="true"
          type="input-text"
          :label="$t('first-name') + ':'"
          data-testid="contact.form.first-name"
        />
        <WMInput
          name="last-name"
          :required="true"
          validation-message="Validation Message"
          type="input-text"
          :label="$t('last-name') + ':'"
          data-testid="contact.form.last-name"
        />
      </div>

      <div class="wm-form-row gap-32px">
        <WMInput
            name="contact-number"
            type="input-text"
            :label="$t('contact.number') + ':'"
            data-testid="contact.form.contact-number"
        />

        <WMInput
          v-if="genders"
          name="gender"
          :highlighted="true"
          type="input-select"
          :label="$t('gender') + ':'"
          :options="genders"
          :placeholder="$t('select', ['gender'])"
          width="130"
          option-set
          data-testid="contact.form.gender"
        />
      </div>

      <div class="wm-form-row align-items-end gap-2">
        <WMInputSearch
          name="customer"
          :placeholder="$t('select', ['customer'])"
          :label="$t('customer.customer') + ':'"
          :multiple="true"
          size="md"
          :highlighted="true"
          :search-function="searchCustomer"
          :new="true"
          related-sidebar="newCustomer"
          :model-value="selectedCustomers"
          required
          data-testid="contact.form.customer"
        />

        <WMSidebar
          :visible="isNewCustomerSidebarVisible"
          name="newCustomer"
          @close-sidebar="closeNewCustomerSidebar"
          @open-sidebar="openSidebar"
        >
          <WMNewEntityFormHeader entity="customer" name="newCustomer" />
          <WMNewCustomerForm
            :is-sidebar="true"
            :show-confirm-dialog="false"
            @close-sidebar="closeNewCustomerSidebar"
            @customer-created="handleCustomerCreated"
          />
        </WMSidebar>
      </div>
    </div>

    <Divider class="my-5" layout="horizontal" style="height: 4px" />
    <div class="contact-address flex flex-auto flex-column gap-5 mb-5">
      <h2 class="h2 mb-0">{{ $t("communication-details") }}</h2>
      <div class="wm-form-row gap-32px">
        <WMInput
          name="mobile-phone"
          :required="true"
          type="input-text"
          :label="$t('mobilephone') + ':'"
          width="88"
          data-testid="contact.form.mobile-phone"
        />
        <WMInput
            name="landline"
            type="input-text"
            :label="$t('landline') + ':'"
            width="88"
            data-testid="contact.form.landline"
        />
        <WMInput
            name="fax"
            type="input-text"
            :label="$t('fax') + ':'"
            width="88"
            data-testid="contact.form.fax"
        />
      </div>

      <div class="wm-form-row gap-32px">
        <WMInput
          name="email"
          :required="true"
          type="input-text"
          :label="$t('email') + ':'"
          size="md"
          data-testid="contact.form.email"
        />
      </div>
    </div>

    <Divider class="my-5" layout="horizontal" style="height: 4px" />

    <WMNewFormAddress entity="contact" />

    <Divider class="my-5" layout="horizontal" style="height: 4px" />

    <div class="contact-notes flex flex-auto flex-column gap-5 mb-5">
      <h2 class="h2 mb-0">{{ $t("contact.notes") }}</h2>

      <div class="wm-form-row gap-5">
        <WMInput
            id="notes"
            type="text-area"
            name="notes"
            size="full"
            data-testid="contact.form.notes"
        />
      </div>
    </div>

    <WMFormButtons v-if="isSidebar" @save-form="onSubmit()" @cancel-form="onCancel()" />
  </div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { inject, onMounted, ref, watch } from "vue";

import { useAuthStore } from "@/stores/auth";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const authStore = useAuthStore();
const formUtilsStore = useFormUtilsStore();
const optionSetsStore = useOptionSetsStore();

const toast = useToast();
const dialog = useDialog();

const { getCustomersFromApi, getCustomerFromApi } = useCustomers();
const { createContact, parseContact } = useContacts();

// INJECT
const isFormDirty = inject("isFormDirty");
const closeSidebar = inject("closeSidebar");

// PROPS, EMITS
const props = defineProps({
  isSidebar: {
    type: Boolean,
    default: false,
  },
  showConfirmDialog: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["contactCreated"]);

// REFS
const isNewCustomerSidebarVisible = ref(false);
const genders = ref();
const selectedCustomers = ref([]);

// COMPUTED
// COMPONENT METHODS AND LOGIC
const { handleSubmit, meta, resetForm } = useForm({
  validationSchema: formUtilsStore.getContactNewFormValidationSchema,
});

function openSidebar() {
  isNewCustomerSidebarVisible.value = true;
}

function closeNewCustomerSidebar() {
  isNewCustomerSidebarVisible.value = false;
}

const searchCustomer = (query) => {
  return getCustomersFromApi({ search: query });
};

const onSubmit = handleSubmit((values) => {
  createContact(parseContact(values))
    .then((data) => {
      if (props.showConfirmDialog) {
        dialog.confirmNewContact(data.data.id);
      }

      emit("contactCreated", data.data.id);

      resetForm();
      isFormDirty.value = false;

      closeSidebar();

      toast.success({ message: "Contact successfully created" });
    })
    .catch((error) => {
      console.error(error);
      toast.error("contact", "not-created");
    });
});

const onCancel = () => {
  closeSidebar();
};

function handleCustomerCreated(customerId) {
  if (!customerId) {
    return;
  }

  getCustomerFromApi(customerId).then((response) => {
    const selectedCustomersFromResponse = [];
    selectedCustomersFromResponse.push(response);
    selectedCustomers.value = selectedCustomersFromResponse;

    closeNewCustomerSidebar();
  });
}

onMounted(async () => {
  genders.value = await optionSetsStore.getOptionSetValues("gender");
});

formUtilsStore.formEntity = "contact";

// PROVIDE, EXPOSE
defineExpose({
  onSubmit,
  onCancel,
});

// WATCHERS
watch(
  () => meta.value,
  (value) => {
    formUtilsStore.formMeta = value;
    isFormDirty.value = value.dirty;
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss"></style>
