<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="customer-data flex flex-auto flex-column gap-5 mb-5">
      <h1 class="h1 mb-0">{{ $t('new', ['customer.customer']) }}</h1>
      <div class="wm-form-row gap-5">
        <WMInput name="owner" type="info" :highlighted="true" :label="$t('owner') + ':'"
                 :value="authStore.userFullName" />
        <WMInput name="id" type="info" :highlighted="true" :label="$t('id') + ':'" value="000000" />
      </div>
      <div class="wm-form-row gap-5">
        <WMInput name="name" :required="true" type="input-text" :label="$t('customer.name') + ':'" />
        <WMInput name="number" :required="true" type="input-text" :label="$t('customer.number') + ':'" />
      </div>
      <div class="wm-form-row gap-5">
        <WMInput name="type" type="input-select" :highlighted="true" :label="$t('customer.type') + ':'" :options="types"
                 width="80" />
        <WMInput name="rating" type="input-select" :highlighted="true" :label="$t('customer.rating') + ':'"
                 :options="rating" width="80" />
      </div>
      <div class="wm-form-row gap-5">
        <WMInputSearch name="service_area" type="input-search" :placeholder="$t('select', ['customer.area'])" :required="true"
                       :label="$t('customer.area') + ':'" :multiple="true" width="248" :options="business"
                       :highlighted="true" />
      </div>
      <Divider class="mt-5 mb-0" layout="horizontal" style="height: 4px;" />
      <div class="customer-address flex flex-auto flex-column gap-5">
        <h2 class="h2 mb-0">{{ $t('address.address') }}</h2>

        <div class="wm-form-row gap-5">
          <WMInputSearch name="city" :highlighted="true" :required="true" :label="$t('address.city') + ':'"
                         :options="cities" width="152" :placeholder="$t('select', ['address.street'])" />
          <WMInputSearch name="street" :required="true" :highlighted="true" :label="$t('address.street') + ':'"
                         :options="cities" width="152" :placeholder="$t('select', ['address.street'])" />
        </div>
        <div class="wm-form-row gap-5">
          <WMInput name="house-number" type="input-text" :required="true" :label="$t('address.house-number') + ':'"
                   width="48" />
          <WMInput name="apartment" type="input-text" :label="$t('address.apartment') + ':'" width="48" />
          <WMInput name="entrance" type="input-select" :highlighted="true" :label="$t('address.entrance') + ':'"
                   :options="alphabetWithDash" width="60" />
        </div>
        <div class="wm-form-row gap-5">
          <WMInput name="zip" type="input-text" :label="$t('address.zip') + ':'" width="80" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import WMInput from '@/components/forms/WMInput.vue';
import WMInputSearch from '@/components/forms/WMInputSearch.vue';
import { useFormUtilsStore } from '@/stores/formUtils';
import { useForm } from 'vee-validate';
import { useAuthStore } from '@/stores/auth';
import { CustomerService } from '@/service/CustomerService';
import { useOptionSetsStore } from '@/stores/optionSets';
import { CitiesService } from '@/service/CitiesService';
import { useToast } from '@/stores/toast';
import { useConfirm } from "primevue/useconfirm";
import { useI18n } from 'vue-i18n'

const i18n = useI18n();
const confirm = useConfirm();

const customers = ref();
const authStore = useAuthStore();
const optionSetsStore = useOptionSetsStore();
const formUtilsStore = useFormUtilsStore();

const cities = ref();
const types = ref();
const rating = ref();
const business = ref();
const alphabetWithDash = ref(formUtilsStore.getAlphabetWithDash);
const toast = useToast();

onMounted(() => {
  CustomerService.getCustomersFromApi({ page: 1 }).then((data) => (customers.value = data.customers));
  CitiesService.getCities().then((data) => (cities.value = data));
  optionSetsStore.getOptionSetValuesFromApi('customer_type').then((data) => (types.value = data));
  optionSetsStore.getOptionSetValuesFromApi('customer_rating').then((data) => (rating.value = data));
  optionSetsStore.getOptionSetValuesFromApi('customer_business').then((data) => (business.value = data));
});

const { errors, handleSubmit, meta } = useForm({
  validationSchema: formUtilsStore.getCustomerFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  CustomerService.createCustomer(CustomerService.parseCustomer(values)).then((data) => {
    toast.success(i18n.t('customer.toast.created'));
    confirm.require({
    message: i18n.t('customer.notification.created.message'),
    header: i18n.t('customer.notification.created.header'),
    acceptLabel: i18n.t('customer.notification.created.detail'),
    rejectLabel: i18n.t('customer.notification.created.list'),
    accept: () => {
      formUtilsStore.goToDetail(data.data.id);
    },
    reject: () => {
      formUtilsStore.closeForm();
    },
  });
  }).catch((error) => {
    toast.error('An Error Ocurred');
    console.log(error);
  });
});

const onCancel = () => {
  if (!formUtilsStore.formMeta.dirty) {
    formUtilsStore.closeForm();
    return;
  }
  confirm.require({
    message: i18n.t('customer.notification.discard.message'),
    header: i18n.t('customer.notification.discard.header'),
    acceptLabel: i18n.t('customer.notification.discard.accept'),
    rejectLabel: i18n.t('customer.notification.discard.cancel'),
    accept: () => {
      formUtilsStore.closeForm();
    },
    reject: () => {
    },
  });
};

formUtilsStore.save = onSave;
formUtilsStore.cancel = onCancel;
formUtilsStore.formErrors = errors;
formUtilsStore.formMeta = meta;
formUtilsStore.formEntity = "customer";

// const searchCustomer = (query) => {
  // return CustomerService.getCustomersFromApi({ search: query });
// }

</script>

<style scoped lang="scss"></style>
 