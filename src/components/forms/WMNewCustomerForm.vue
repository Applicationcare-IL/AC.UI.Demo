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
          :label="$t('owner') + ':'"
          :value="authStore.userFullName"
        />
        <WMInput
          name="id"
          type="info"
          :highlighted="true"
          :label="$t('id') + ':'"
          value="000000"
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
          @input.stop="onCustomerNumberChanged"
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
          width="80"
        />
        <WMInput
          name="rating"
          type="input-select"
          :highlighted="true"
          :label="$t('customer.rating') + ':'"
          :options="ratings"
          width="80"
        />
        <WMInput
          name="is_provider"
          type="input-select-button"
          :highlighted="true"
          :label="$t('customer.is-provider') + ':'"
          :options="yesNoOptions"
          :selectedOption="yesNoOptions[1]"
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
        />
      </div>
      <Divider class="mt-5 mb-0" layout="horizontal" style="height: 4px" />
      <div class="customer-address flex flex-auto flex-column gap-5">
        <h2 class="h2 mb-0">{{ $t("address.address") }}</h2>

        <div class="wm-form-row gap-5">
          <WMInputSearch
            name="city"
            :highlighted="true"
            :required="true"
            :label="$t('address.city') + ':'"
            :options="cities"
            width="152"
            :placeholder="$t('select', ['address.street'])"
          />
          <WMInputSearch
            name="street"
            :required="true"
            :highlighted="true"
            :label="$t('address.street') + ':'"
            :options="cities"
            width="152"
            :placeholder="$t('select', ['address.street'])"
          />
        </div>
        <div class="wm-form-row gap-5">
          <WMInput
            name="house-number"
            type="input-text"
            :required="true"
            :label="$t('address.house-number') + ':'"
            width="48"
          />
          <WMInput
            name="apartment"
            type="input-text"
            :label="$t('address.apartment') + ':'"
            width="48"
          />
          <WMInput
            name="entrance"
            type="input-select"
            :highlighted="true"
            :label="$t('address.entrance') + ':'"
            :options="alphabetWithDash"
            width="60"
          />
        </div>
        <div class="wm-form-row gap-5">
          <WMInput
            name="zip"
            type="input-text"
            :label="$t('address.zip') + ':'"
            width="80"
          />
        </div>
      </div>
      <Divider class="mt-5 mb-0" layout="horizontal" style="height: 4px" />
      <div class="customer-address flex flex-auto flex-column gap-5">
        <h2 class="h2 mb-0">פרטי התקשרות</h2>
        <div class="wm-form-row gap-5">
          <WMInput
            name="mobile-phone"
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
            :required="true"
            type="input-text"
            :label="$t('email') + ':'"
            width="240"
          />
        </div>
      </div>
      <Divider class="mt-5 mb-0" layout="horizontal" style="height: 4px" />
      <div class="customer-address flex flex-auto flex-column gap-5">
        <h2 class="h2 mb-0">אנשי קשר</h2>
        <div class="wm-form-row gap-5">
          <WMInputSearch
            name="contact"
            :required="true"
            :placeholder="$t('select', ['contact'])"
            type="table"
            :label="$t('contact') + ':'"
            width="160"
            :highlighted="true"
            :searchFunction="searchContact"
            :new="true"
            related-sidebar="newCustomer"
            @change="onContactselected"
            :multiple="true"
          />
        </div>
        <WMContactsTable
          :contacts="selectedContacts"
          :columns="getSelectedContactsForNewCustomerColumns()"
          :showControls="false"
          @update:role="updatedRole"
          @update:mainContact="updatedMainContact"
          @unlink="unlinkContact"
          :multiselect="false"
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
import { ref, onMounted, watch, defineEmits } from "vue";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useUtilsStore } from "@/stores/utils";

import { useForm } from "vee-validate";
import { useAuthStore } from "@/stores/auth";
import { CustomerService } from "@/service/CustomerService";

import { useOptionSetsStore } from "@/stores/optionSets";

const props = defineProps({
  isSidebar: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["closeSidebar"]);

const authStore = useAuthStore();
const optionSetsStore = useOptionSetsStore();
const formUtilsStore = useFormUtilsStore();
const utilsStore = useUtilsStore();

const { getSelectedContactsForNewCustomerColumns } = useListUtils();

const cities = ref();
const types = ref(optionSetsStore.optionSets["customer_type"]);
const ratings = ref(optionSetsStore.optionSets["customer_rating"]);
const serviceAreas = ref(optionSetsStore.optionSets["service_area"]);
const alphabetWithDash = ref(formUtilsStore.getAlphabetWithDash);
const toast = useToast();
const dialog = useDialog();
const yesNoOptions = optionSetsStore.getOptionSetValues("yesNo");
const selectedContacts = ref([]);

onMounted(() => {
  optionSetsStore
    .getOptionSetValuesFromApi("service_area")
    .then((data) => (serviceAreas.value = data));
});

const { errors, handleSubmit, meta, setFieldError } = useForm({
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
  CustomerService.createCustomer(
    CustomerService.parseCustomer(values, contacts)
  )
    .then((data) => {
      dialog.confirmNewCustomer(data.data.id);
      toast.successAction("customer", "created");
    })
    .catch((error) => {
      console.log(error);
      toast.error("customer", "not-created");
    });
});

// if (formUtilsStore.formMeta.dirty) dialog.discardNewCustomer();
const onCancel = () => {
  emit("closeSidebar");
};

const onCustomerNumberChanged = (event) => {
  utilsStore.debounceAction(() => {
    CustomerService.existsCustomer("id", event.target.value).then((exists) =>
      exists
        ? setFieldError("number", {
            key: "validation.exists",
            values: { label: "customer.customer" },
          })
        : setFieldError("number", "")
    );
  });
};

const { getContactsFromApi } = useContacts();

const searchContact = (query) => {
  return getContactsFromApi({
    search: query,
  });
};

const updatedMainContact = (id) => {
  selectedContacts.value.map((contact) => {
    if (contact.id === id) {
      contact.main = true;
    } else {
      contact.main = false;
    }
  });
};

const unlinkContact = (id) => {
  console.log("UNLINK CONTACT" + id);
  const index = selectedContacts.value.findIndex((contact) => {
    return contact.contact_id == id;
  });
  selectedContacts.value.splice(index, 1);
};

const defaultRole = optionSetsStore.optionSets["contact_customer_role"].find(
  (role) => role.value === "employee"
);

const onContactselected = (newContact) => {
  if (
    selectedContacts.value.some((contact) => contact.id === newContact.value.id)
  )
    return;

  //Select the default role for the new contact and add it to the list of selected contacts
  newContact.value.role = { ...defaultRole };
  selectedContacts.value.push(newContact.value);
};

formUtilsStore.formEntity = "customer";

watch(
  () => meta.value,
  (value) => {
    formUtilsStore.formMeta = value;
  }
);

defineExpose({
  onSubmit,
  onCancel,
});
</script>

<style scoped lang="scss"></style>
