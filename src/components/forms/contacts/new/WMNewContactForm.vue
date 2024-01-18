<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="contact-data flex flex-auto flex-column gap-5 mb-5">
      <h1 v-if="!props.isSidebar" class="h1 mb-0">
        {{ $t("new", ["contact.contact"]) }}
      </h1>
      <h2 class="h2 mb-0">פרטים כלליים</h2>
      <div class="wm-form-row">
        <WMInput
          name="owner"
          type="info"
          :highlighted="true"
          :label="$t('owner') + ':'"
          :value="authStore.userFullName"
        ></WMInput>
      </div>
      <div class="wm-form-row gap-5">
        <WMInput
          name="first-name"
          :required="true"
          type="input-text"
          :label="$t('first-name') + ':'"
        />
        <WMInput
          name="last-name"
          :required="true"
          validation-message="Validation Message"
          type="input-text"
          :label="$t('last-name') + ':'"
        />
      </div>

      <div class="wm-form-row gap-4">
        <WMInput
          name="contact-number"
          type="input-text"
          :label="$t('contact.number') + ':'"
        />

        <WMInput
          name="gender"
          :highlighted="true"
          type="input-select"
          :label="$t('gender') + ':'"
          :options="genders"
          :placeholder="$t('select', ['gender'])"
          width="130"
        />
      </div>

      <div class="wm-form-row align-items-end gap-2">
        <WMInputSearch
          name="customer"
          :placeholder="$t('select', ['customer'])"
          :label="$t('customer.customer') + ':'"
          :multiple="true"
          width="248"
          :highlighted="true"
          :search-function="searchCustomer"
          :new="true"
          related-sidebar="newCustomer"
        />

        <WMSidebar
          :visible="isVisible"
          name="newCustomer"
          @close-sidebar="closeSidebar"
          @open-sidebar="openSidebar"
        >
          <WMNewEntityFormHeader entity="customer" name="newCustomer" />
          <WMNewCustomerForm :is-sidebar="true" @close-sidebar="closeSidebar" />
        </WMSidebar>
      </div>
    </div>

    <Divider class="my-5" layout="horizontal" style="height: 4px" />
    <div class="contact-address flex flex-auto flex-column gap-5 mb-5">
      <h2 class="h2 mb-0">פרטי התקשרות</h2>
      <div class="wm-form-row gap-5">
        <WMInput
          name="mobile-phone"
          :required="true"
          type="input-text"
          :label="$t('mobilephone') + ':'"
          width="88"
        />
        <WMInput
          name="landline"
          type="input-text"
          :label="$t('landline') + ':'"
          width="88"
        />
        <WMInput
          name="fax"
          type="input-text"
          :label="$t('fax') + ':'"
          width="88"
        />
      </div>

      <div class="wm-form-row gap-5">
        <WMInput
          name="email"
          :required="true"
          type="input-text"
          :label="$t('email') + ':'"
          width="240"
        />
      </div>
    </div>

    <Divider class="my-5" layout="horizontal" style="height: 4px" />

    <WMNewFormAddress />

    <Divider class="my-5" layout="horizontal" style="height: 4px" />

    <div class="contact-notes flex flex-auto flex-column gap-5 mb-5">
      <h2 class="h2 mb-0">{{ $t("contact.notes") }}</h2>

      <div class="wm-form-row gap-5">
        <WMInput id="notes" type="text-area" name="notes" />
      </div>
    </div>

    <WMFormButtons
      v-if="isSidebar"
      @save-form="onSubmit()"
      @cancel-form="onCancel()"
    />
  </div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { inject, ref, watch } from "vue";

import { useAuthStore } from "@/stores/auth";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const authStore = useAuthStore();
const formUtilsStore = useFormUtilsStore();
const optionSetsStore = useOptionSetsStore();

const toast = useToast();
const dialog = useDialog();

const { getCustomersFromApi } = useCustomers();
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
const isVisible = ref(false);
const genders = ref(optionSetsStore.optionSets["gender"]);

// COMPUTED
// COMPONENT METHODS
const { handleSubmit, meta } = useForm({
  validationSchema: formUtilsStore.getContactNewFormValidationSchema,
});

function openSidebar() {
  isVisible.value = true;
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
      toast.successAction("contact", "created");
    })
    .catch((error) => {
      console.error(error);
      toast.error("contact", "not-created");
    });
});

const onCancel = () => {
  closeSidebar();
};

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
