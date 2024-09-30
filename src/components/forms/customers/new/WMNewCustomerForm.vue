<template>
  <div
    class="wm-new-form-container flex flex-auto flex-column overflow-auto"
    data-testid="customer"
  >
    <div class="customer-data flex flex-auto flex-column gap-5 mb-5">
      <h1 v-if="!props.isSidebar" class="h1 mb-0">
        {{ $t("new", ["customer.customer"]) }}
      </h1>
      <div class="wm-form-row gap-5">
        <WMInput
          name="owner"
          type="info"
          :highlighted="true"
          :label="$t('owner') + ':'"
          :value="authStore.userFullName"
          data-testid="owner"
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
        />
      </div>

      <div class="wm-form-row gap-5">
        <WMInput
          name="type"
          type="input-select"
          :highlighted="true"
          :label="$t('customer.type') + ':'"
          :options="types"
          size="xs"
          option-set
          required
        />
        <WMInput
          name="rating"
          type="input-select"
          :highlighted="true"
          :label="$t('customer.rating') + ':'"
          :options="ratings"
          size="xs"
          option-set
          required
        />

        <WMInput
          v-if="yesNoOptions"
          name="is_provider"
          type="input-select-button"
          :highlighted="true"
          :label="$t('customer.is-provider') + ':'"
          :options="yesNoOptions"
          :value="yesNoOptions[1]"
          width="80"
          @update:selected-item="onProviderChanged"
        />
      </div>
      <div v-if="isProvider" class="wm-form-row gap-5">
        <WMInput
          name="basic_term"
          type="input-select"
          :highlighted="true"
          :label="$t('customer.basic_term') + ':'"
          :options="basicTerms"
          width="80"
          option-set
        />

        <WMInput
          name="calculate_term"
          type="input-text"
          :highlighted="true"
          :label="$t('customer.calculate_term') + ':'"
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
          <WMInput name="fax" type="input-text" :label="$t('fax') + ':'" width="88" />
        </div>

        <div class="wm-form-row gap-5">
          <WMInput name="email" required type="input-text" :label="$t('email') + ':'" size="md" />
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
          related-entity="customer"
          @update:role="updatedRole"
          @update:main-contact="updatedMainContact"
          @unlink="unlinkContact"
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
const optionSetsStore = useOptionSetsStore();
const formUtilsStore = useFormUtilsStore();
const { can } = usePermissions();

const { getSelectedContactsForNewCustomerColumns } = useListUtils();
const { createCustomer, parseCustomer } = useCustomers();

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
const types = ref();
const ratings = ref();
const serviceAreas = ref();
const basicTerms = ref();
const defaultRole = ref();

const yesNoOptions = ref();
const selectedContacts = ref([]);

const isVisible = ref(false);
const nextID = ref(0);

// COMPUTED

// COMPONENT METHODS AND LOGIC
function openSidebar() {
  isVisible.value = true;
}

const isProvider = ref(false);

function onProviderChanged(value) {
  isProvider.value = value.value;
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

      toast.success({ message: "Customer successfully created" });
    })
    .catch((error) => {
      console.error(error);
      toast.error("customer", "not-created");
    });
});

const onCancel = () => {
  closeSidebar();
};

// const onCustomerNumberChanged = (event) => {
//   utilsStore.debounceAction(() => {
//     existsCustomer("id", event.target.value).then((exists) =>
//       exists
//         ? setFieldError("number", {
//             key: "validation.exists",
//             values: { label: "customer.customer" },
//           })
//         : setFieldError("number", "")
//     );
//   });
// };

const searchContact = async (query) => {
  let activeStateId = await optionSetsStore.getId("state", "active");

  return await getContactsFromApi({
    search: query,
    per_page: 9999,
    state: activeStateId,
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
  if (selectedContacts.value.some((contact) => contact.id === newContact.value.id)) {
    return;
  }

  // Select the first role as the default role for the new contact and add it to the list of selected contacts
  newContact.value.role = { ...defaultRole.value[0] };
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
onMounted(async () => {
  types.value = await optionSetsStore.getOptionSetValues("customer_type");
  ratings.value = await optionSetsStore.getOptionSetValues("customer_rating");
  serviceAreas.value = await optionSetsStore.getOptionSetValues("service_area");
  basicTerms.value = await optionSetsStore.getOptionSetValues("basic_term");
  defaultRole.value = await optionSetsStore.getOptionSetValues("contact_customer_role");

  optionSetsStore.getOptionSetValues("service_area").then((data) => (serviceAreas.value = data));
  yesNoOptions.value = await optionSetsStore.getOptionSetValues("yesNo");
});
</script>

<style scoped lang="scss"></style>
