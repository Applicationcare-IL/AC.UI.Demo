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
          :options="rating"
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
          type="input-search"
          :placeholder="$t('select', ['customer.area'])"
          :required="true"
          :label="$t('customer.area') + ':'"
          :multiple="true"
          width="248"
          :options="service_areas"
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
import { CitiesService } from "@/service/CitiesService";
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
const optionSetsStore = useOptionSetsStore();
const formUtilsStore = useFormUtilsStore();
const utilsStore = useUtilsStore();

const cities = ref();
const types = ref();
const rating = ref();
const service_areas = ref();
const alphabetWithDash = ref(formUtilsStore.getAlphabetWithDash);
const toast = useToast();
const dialog = useDialog();
const yesNoOptions = optionSetsStore.getOptionSetValues("yesNo");

onMounted(() => {
  CitiesService.getCities().then((data) => (cities.value = data));
  optionSetsStore
    .getOptionSetValuesFromApi("customer_type")
    .then((data) => (types.value = data));
  optionSetsStore
    .getOptionSetValuesFromApi("customer_rating")
    .then((data) => (rating.value = data));
  optionSetsStore
    .getOptionSetValuesFromApi("service_area")
    .then((data) => (service_areas.value = data));
});

const { errors, handleSubmit, meta, setFieldError } = useForm({
  validationSchema: formUtilsStore.getCustomerNewFormValidationSchema,
});

const onSubmit = handleSubmit((values) => {
  CustomerService.createCustomer(CustomerService.parseCustomer(values))
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
