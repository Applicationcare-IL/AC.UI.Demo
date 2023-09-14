<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="customer-data flex flex-auto flex-column gap-5 mb-5">
      <h1 class="h1 mb-0">{{ $t('new',  ['customer.customer']) }}</h1>
      <div class="wm-form-row gap-5">
        <WMInput name="owner"
                 type="info" :highlighted="true"
                 :label="$t('owner') + ':'"
                 :value="authStore.userFullName" />
        <WMInput name="id" type="info"
                 :highlighted="true"
                 :label="$t('id') + ':'"
                 value="000000" />
      </div>
      <div class="wm-form-row gap-5">
        <WMInput name="name"
                 :required="true"
                 type="input-text"
                 :label="$t('customer.name') + ':'" />
        <WMInput name="number"
                 :required="true"
                 type="input-text"
                 :label="$t('customer.number') + ':'" />
      </div>
      <div class="wm-form-row gap-5">
        <WMInput name="type" type="input-select"
                 :highlighted="true"
                 :label="$t('customer.type') + ':'"
                 :options="alphabetWithDash"
                 width="48" />
        <WMInput name="rating" type="input-select"
                 :highlighted="true"
                 :label="$t('customer.rating') + ':'"
                 :options="alphabetWithDash"
                 width="48" />
      </div>
      <div class="wm-form-row gap-5">
        <WMInputSearch name="field"
                       type="input-search"
                       :placeholder="$t('select', ['customer.field'])"
                       :required="true"
                       :label="$t('customer.field') + ':'"
                       :multiple="true" width="248"
                       :options="customers"
                       :highlighted="true" />
      </div>
      <Divider class="mt-5 mb-0" layout="horizontal" style="height: 4px;" />
      <div class="customer-address flex flex-auto flex-column gap-5">
        <h2 class="h2 mb-0">{{ $t('address.address') }}</h2>

        <div class="wm-form-row gap-5">
          <WMInputSearch name="city"
                         :highlighted="true"
                         :required="true"
                         :label="$t('address.city') + ':'"
                         :options="customers"
                         width="152"
                         :placeholder="$t('select', ['address.street'])" />
          <WMInputSearch name="street"
                         :required="true"
                         :highlighted="true"
                         :label="$t('address.street') + ':'"
                         :options="customers"
                         width="152"
                         :placeholder="$t('select', ['address.street'])" />
        </div>
        <div class="wm-form-row gap-5">
          <WMInput name="house-number"
                   type="input-text"
                   :required="true"
                   :label="$t('address.house-number') + ':'"
                   width="48" />
          <WMInput name="apartment"
                   type="input-text"
                   :label="$t('address.apartment') + ':'"
                   width="48" />
          <WMInput name="entrance"
                   type="input-select"
                   :highlighted="true"
                   :label="$t('address.entrance') + ':'"
                   :options="alphabetWithDash"
                   width="48" />
        </div>
        <div class="wm-form-row gap-5">
          <WMInput name="zip"
                   type="input-text"
                   :label="$t('address.zip') + ':'"
                   width="80" />
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
import * as yup from 'yup';
import { useForm } from 'vee-validate';
import { useAuthStore } from '@/stores/auth';
import { CustomerService } from '@/service/CustomerService';

const customers = ref();
const authStore = useAuthStore();
const formUtilsStore = useFormUtilsStore();

onMounted(() => {
  CustomerService.getCustomers().then((data) => (customers.value = data));
});

const { errors, handleSubmit } = useForm({
  validationSchema: formUtilsStore.getCustomerFormValidationSchema,
});

const onSubmit = handleSubmit((values) => {
  CustomerService.createCustomer(values);
  console.log(values);
});

formUtilsStore.submit = onSubmit;
formUtilsStore.formErrors = errors;


</script>

<style scoped lang="scss"></style>
