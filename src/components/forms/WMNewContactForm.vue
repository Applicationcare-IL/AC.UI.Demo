<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="contact-data flex flex-auto flex-column gap-5 mb-5">
      <h1 v-if="!props.isSidebar" class="h1 mb-0">
        {{ $t("new", ["contact.contact"]) }}
      </h1>

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
          validationMessage="Validation Message"
          type="input-text"
          :label="$t('last-name') + ':'"
        />
      </div>

      <div class="wm-form-row gap-4">
        <WMInput
          name="contactid"
          :required="true"
          type="input-text"
          :label="$t('id') + ':'"
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
          :required="true"
          type="input-search"
          :label="$t('customer') + ':'"
          :multiple="true"
          width="248"
          :options="customers"
          :highlighted="true"
          :searchFunction="searchCustomer"
          :new="true"
          related-sidebar="newCustomer"
        />

        <WMSidebar
          :visible="isVisible"
          @close-sidebar="closeSidebar"
          @open-sidebar="openSidebar"
          name="newCustomer"
        >
          <WMNewEntityFormHeader entity="customer" name="newCustomer" />
          <WMNewCustomerForm :isSidebar="true" @close-sidebar="closeSidebar" />
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

    <div class="contact-address flex flex-auto flex-column gap-5 mb-5">
      <h2 class="h2 mb-0">{{ $t("address.address") }}</h2>

      <div class="wm-form-row gap-5">
        <WMInputSearch
          name="city"
          :highlighted="true"
          :label="$t('address.city') + ':'"
          :options="cities"
          width="152"
          :placeholder="$t('select', ['address.city'])"
          @change="updateStreets"
        />
        <WMInputSearch
          name="street"
          :highlighted="true"
          :label="$t('address.street') + ':'"
          :options="streets"
          width="152"
          :placeholder="$t('select', ['address.street'])"
        />
      </div>
      <div class="wm-form-row gap-5">
        <WMInput
          name="house-number"
          type="input-text"
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
          width="48"
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

    <Divider class="my-5" layout="horizontal" style="height: 4px" />

    <div class="contact-notes flex flex-auto flex-column gap-5 mb-5">
      <h2 class="h2 mb-0">{{ $t("contact.notes") }}</h2>

      <div class="wm-form-row gap-5">
        <Textarea v-model="value" autoResize rows="8" cols="100" />
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
import { onMounted, watch, defineEmits, defineExpose, ref } from "vue";
import { CustomerService } from "@/service/CustomerService";
import { ContactsService } from "@/service/ContactsService";

import { useAuthStore } from "@/stores/auth";

import { useForm } from "vee-validate";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";
import { useToast } from "@/stores/toast";
import { useDialog } from "@/stores/dialog";

const props = defineProps({
  isSidebar: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["closeSidebar"]);

const authStore = useAuthStore();
const formUtilsStore = useFormUtilsStore();
const optionSetsStore = useOptionSetsStore();

const toast = useToast();
const dialog = useDialog();

const cities = ref();
const selectedCity = ref(null);
const streets = ref();
const selectedStreet = ref(null);

onMounted(() => {
  optionSetsStore.getOptionSetValuesFromApiRaw("service_city").then((data) => {
    console.log(data);
    cities.value = data;
  });
});

const { errors, handleSubmit, setFieldError, meta } = useForm({
  validationSchema: formUtilsStore.getContactNewFormValidationSchema,
});

const isVisible = ref(false);

function openSidebar() {
  isVisible.value = true;
}

function closeSidebar() {
  isVisible.value = false;
}

const genders = optionSetsStore.getOptionSetValuesFromApi("gender");
const alphabetWithDash = formUtilsStore.getAlphabetWithDash;

const searchCustomer = (query) => {
  return CustomerService.getCustomersFromApi({ search: query });
};

const updateStreets = (city) => {
  selectedCity.value = city;
  if (city) {
    optionSetsStore
      .getOptionSetValuesFromApiRaw("service_street")
      .then((data) => {
        streets.value = data;
      });
  }
};

const onSubmit = handleSubmit((values) => {
  ContactsService.createContact(ContactsService.parseContact(values))
    .then((data) => {
      dialog.confirmNewContact(data.data.id);
      toast.successAction("contact", "created");
    })
    .catch((error) => {
      console.log(error);
      toast.error("contact", "not-created");
    });
});

const onCancel = () => {
  emit("closeSidebar");
};

formUtilsStore.formEntity = "contact";

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
