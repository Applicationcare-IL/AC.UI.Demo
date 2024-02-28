<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="customer-data flex flex-auto flex-column gap-5 mb-5">
      <h1 v-if="!props.isSidebar" class="h1 mb-0">
        {{ $t("new", ["customer.customer"]) }}
      </h1>
      <div class="wm-form-row gap-5">
        <WMInput
          name="owner"
          type="info"
          :highlighted="true"
          :label="$t('owner.owner') + ':'"
          :value="authStore.userFullName"
        />
        <WMInput
          name="id"
          type="info"
          :highlighted="true"
          :label="$t('id') + ':'"
          :value="nextID"
        />
      </div>
      <div class="wm-form-row gap-5">
        <WMInput
          name="name"
          :required="true"
          type="input-text"
          :label="$t('customer.name') + ':'"
        />
        <WMInput
          name="number"
          :required="true"
          type="input-text"
          :label="$t('customer.number') + ':'"
          @input.stop="onCustomerNumberChanged"
        />
      </div>

      <div class="wm-form-row gap-5">
        <WMInput
          name="type"
          type="input-select"
          :highlighted="true"
          :label="$t('customer.type') + ':'"
          :options="types"
          width="80"
          option-set
          required
        />
        <WMInput
          name="rating"
          type="input-select"
          :highlighted="true"
          :label="$t('customer.rating') + ':'"
          :options="ratings"
          width="80"
          option-set
          required
        />

        <WMInput
          name="is_provider"
          type="input-select-button"
          :highlighted="true"
          :label="$t('customer.is-provider') + ':'"
          :options="yesNoOptions"
          :selected-option="yesNoOptions[1]"
          width="80"
        />
      </div>
      <div class="wm-form-row gap-5">
        <WMInputSearch
          name="service_area"
          :placeholder="$t('select', ['customer.area'])"
          :required="true"
          :label="$t('customer.area') + ':'"
          :multiple="true"
          width="248"
          :options="serviceAreas"
          :highlighted="true"
          :option-set="true"
        />
      </div>
      <Divider class="mt-5 mb-0" layout="horizontal" style="height: 4px" />
      <WMNewFormAddress :required-fields="['city', 'street']" />
      <Divider class="mt-5 mb-0" layout="horizontal" style="height: 4px" />
      <div class="customer-address flex flex-auto flex-column gap-5">
        <h2 class="h2 mb-0">
          {{ $t("communication-details") }}
        </h2>
        <div class="wm-form-row gap-5">
          <WMInput
            name="phone"
            :required="true"
            type="input-text"
            :label="$t('telephone') + ':'"
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
            required
            type="input-text"
            :label="$t('email') + ':'"
            width="240"
          />
        </div>
      </div>
      <Divider class="mt-5 mb-0" layout="horizontal" style="height: 4px" />
      <div class="customer-address flex flex-auto flex-column gap-5">
        <h2 class="h2 mb-0">
          {{ $t("contact.contact") }}
        </h2>
        <div class="wm-form-row gap-5">
          <WMInputSearch
            name="contact"
            :placeholder="$t('select', ['contact'])"
            type="table"
            :label="$t('contact.contacts') + ':'"
            width="160"
            :highlighted="true"
            :search-function="searchContact"
            :new="true"
            related-sidebar="newContact"
            :multiple="true"
            @change="onContactselected"
          />
          <WMSidebar
            :visible="isVisible"
            name="newContact"
            @close-sidebar="closeNewContactSidebar"
            @open-sidebar="openSidebar"
          >
            <template v-if="can('contacts.create')">
              <WMNewEntityFormHeader entity="contact" name="newContact" />
              <WMNewContactForm
                :is-sidebar="true"
                :show-confirm-dialog="false"
                @close-sidebar="closeNewContactSidebar"
                @contact-created="handleContactCreated"
              />
            </template>
            <template v-else>
              <div class="m-5">
                {{ $t("permissions.you-dont-have-permission") }}
              </div>
            </template>
          </WMSidebar>
        </div>
        <WMContactsTable
          v-if="can('contacts.read')"
          :contacts="selectedContacts"
          :columns="getSelectedContactsForNewCustomerColumns()"
          :show-controls="false"
          :multiselect="false"
          @update:role="updatedRole"
          @update:main-contact="updatedMainContact"
          @unlink="unlinkContact"
        />
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
import { inject, onMounted, ref, watch } from "vue";

import { useAuthStore } from "@/stores/auth";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const authStore = useAuthStore();
const optionSetsStore = useOptionSetsStore();
const formUtilsStore = useFormUtilsStore();
const utilsStore = useUtilsStore();
const { can } = usePermissions();

const { getSelectedContactsForNewCustomerColumns } = useListUtils();
const { createCustomer, parseCustomer, existsCustomer } = useCustomers();
const { getNextEntityID } = useUtils();

const { getContactsFromApi, getContactFromApi } = useContacts();

const toast = useToast();
const dialog = useDialog();

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

const emit = defineEmits(["customerCreated"]);

// REFS
const types = ref(optionSetsStore.optionSets["customer_type"]);
const ratings = ref(optionSetsStore.optionSets["customer_rating"]);
const serviceAreas = ref(optionSetsStore.optionSets["service_area"]);

const yesNoOptions = optionSetsStore.getOptionSetValues("yesNo");
const selectedContacts = ref([]);

const isVisible = ref(false);
const nextID = ref(0);

// COMPUTED

// COMPONENT METHODS
function openSidebar() {
  isVisible.value = true;
}

const { handleSubmit, meta, setFieldError, resetForm } = useForm({
  validationSchema: formUtilsStore.getCustomerNewFormValidationSchema,
});

const onSubmit = handleSubmit((values) => {
  const contacts = selectedContacts.value.map((contact) => {
    return {
      id: contact.id,
      role: contact.role.id,
      main: contact.main,
    };
  });

  createCustomer(parseCustomer(values, contacts))
    .then((data) => {
      if (props.showConfirmDialog) {
        dialog.confirmNewCustomer(data.data.id);
      }

      emit("customerCreated", data.data.id);

      resetForm();
      isFormDirty.value = false;

      closeSidebar();

      toast.success("Customer successfully created");
    })
    .catch((error) => {
      console.error(error);
      toast.error("customer", "not-created");
    });
});

const onCancel = () => {
  closeSidebar();
};

const onCustomerNumberChanged = (event) => {
  utilsStore.debounceAction(() => {
    existsCustomer("id", event.target.value).then((exists) =>
      exists
        ? setFieldError("number", {
            key: "validation.exists",
            values: { label: "customer.customer" },
          })
        : setFieldError("number", "")
    );
  });
};

const searchContact = (query) => {
  return getContactsFromApi({
    search: query,
  });
};

const updatedMainContact = (id) => {
  // unselect contact if it was selected
  const index = selectedContacts.value.findIndex((contact) => {
    return contact.id == id;
  });

  if (index !== -1 && selectedContacts.value[index].main) {
    selectedContacts.value[index].main = false;
    return;
  }

  // change main contact to a new one
  selectedContacts.value.map((contact) => {
    if (contact.id === id) {
      contact.main = true;
    } else {
      contact.main = false;
    }
  });
};

const unlinkContact = (id) => {
  const index = selectedContacts.value.findIndex((contact) => {
    return contact.contact_id == id;
  });
  selectedContacts.value.splice(index, 1);
};

const onContactselected = (newContact) => {
  if (
    selectedContacts.value.some((contact) => contact.id === newContact.value.id)
  ) {
    return;
  }

  // Select the default role for the new contact and add it to the list of selected contacts
  newContact.value.role = { ...defaultRole };
  selectedContacts.value.push(newContact.value);
};

const closeNewContactSidebar = () => {
  isVisible.value = false;
};

function handleContactCreated(contactId) {
  if (!contactId) {
    return;
  }

  getContactFromApi(contactId).then((contact) => {
    const newContact = {
      ...contact,
      role: { ...defaultRole },
    };

    selectedContacts.value.push(newContact);
    closeNewContactSidebar();
  });
}

const defaultRole = optionSetsStore.optionSets["contact_customer_role"][0];

formUtilsStore.formEntity = "customer";

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
onMounted(() => {
  optionSetsStore
    .getOptionSetValuesFromApi("service_area")
    .then((data) => (serviceAreas.value = data));

  getNextEntityID("customer").then((id) => {
    nextID.value = id;
  });
});
</script>

<style scoped lang="scss"></style>
